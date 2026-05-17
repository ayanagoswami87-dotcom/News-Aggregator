// Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const COLOR_MAP = {
  orange: "#ff7b00", red: "#e91e63", blue: "#2196f3",
  purple: "#9c27b0", green: "#4caf50",
};
const GRADIENT_MAP = {
  orange: "linear-gradient(135deg, #ff7b00, #ff0058)",
  red: "linear-gradient(135deg, #e91e63, #ff5252)",
  blue: "linear-gradient(135deg, #2196f3, #21cbf3)",
  purple: "linear-gradient(135deg, #9c27b0, #e040fb)",
  green: "linear-gradient(135deg, #4caf50, #8bc34a)",
};

// Stable rating from title hash — same title always gives same rating
const getStableRating = (title) => {
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i);
    hash |= 0;
  }
  return 4 + (Math.abs(hash) % 10) / 10; // 4.0–4.9
};

function Dashboard() {
  // Read saved preferences synchronously to avoid race condition on first fetch
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const p = JSON.parse(localStorage.getItem("userPreferences"));
    if (p?.interfaceTheme === "dark") return true;
    if (p?.interfaceTheme === "light") return false;
    return localStorage.getItem("theme") === "dark";
  });
  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const newsRef = useRef(null);
  const [channel, setChannel] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [trendingNews, setTrendingNews] = useState([]);
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isListening, setIsListening] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [category, setCategory] = useState(() => (JSON.parse(localStorage.getItem("userPreferences"))?.categories?.[0]) || "");
  const [favCategories, setFavCategories] = useState(() => JSON.parse(localStorage.getItem("userPreferences"))?.categories || []);
  const [language, setLanguage] = useState(() => JSON.parse(localStorage.getItem("userPreferences"))?.language || "en");
  const [themeColor, setThemeColor] = useState(() => JSON.parse(localStorage.getItem("userPreferences"))?.themeColor || "orange");

  const NEWS_API_KEY = "0bbb23274b417aaa3d2fc10df661eff9";
  const WEATHER_API_KEY = "a3a17aa5e90e1f7f7469785177d1dce5";

  // CSS custom properties for theme color
  const themeVars = {
    "--theme-color": COLOR_MAP[themeColor] || COLOR_MAP.orange,
    "--theme-gradient": GRADIENT_MAP[themeColor] || GRADIENT_MAP.orange,
  };

  // LOAD PERSONALIZATION PREFERENCES ON MOUNT
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userPreferences"));
    if (saved) {
      if (saved.interfaceTheme === "dark") { setIsDarkMode(true); localStorage.setItem("theme", "dark"); }
      else if (saved.interfaceTheme === "light") { setIsDarkMode(false); localStorage.setItem("theme", "light"); }
      if (saved.language) setLanguage(saved.language);
      if (saved.themeColor) setThemeColor(saved.themeColor);
      if (saved.categories && saved.categories.length > 0) {
        setFavCategories(saved.categories);
        setCategory(saved.categories[0]);
      }
    }
  }, []);

  // THEME BODY CLASS
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  // DARK MODE TOGGLE
  const toggleMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // VOICE SEARCH
  const startVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice Search not supported in this browser. Please use Chrome."); return; }
    const recognition = new SR();
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearch(transcript);
      setIsListening(false);
      setChannel("");
      setCategory("");
      // Fetch directly with transcript
      handleSearch(transcript);
    };
    recognition.onerror = (e) => { console.log("Voice error:", e.error); setIsListening(false); };
    recognition.onend = () => { setIsListening(false); };
  };

  // SEARCH HANDLER - direct fetch that bypasses stale state
  const handleSearch = (query) => {
    const q = query || search;
    if (q.trim() === "") return;
    setChannel("");
    setCategory("");
    setPage(1);
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=${language}&max=10&page=1&apikey=${NEWS_API_KEY}`;
    setLoading(true);
    loadingRef.current = true;
    fetch(url).then(res => res.json()).then(data => {
      if (data?.articles?.length > 0) setNews(data.articles);
      else setNews([]);
      setLoading(false);
      loadingRef.current = false;
      setTimeout(() => { newsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 500);
    }).catch(err => { console.log("Search error:", err); setNews([]); setLoading(false); loadingRef.current = false; });
  };

  // FETCH WEATHER
  const fetchWeather = async () => {
    if (city.trim() === "") return;
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      setWeather(data);
    } catch (err) { console.log(err); }
  };

  // FETCH TRENDING NEWS
  const fetchTrendingNews = async () => {
    try {
      const res = await fetch(`https://gnews.io/api/v4/top-headlines?lang=${language}&country=in&max=5&apikey=${NEWS_API_KEY}`);
      const data = await res.json();
      if (data?.articles?.length > 0) setTrendingNews(data.articles);
      else if (news.length > 0) setTrendingNews(news.slice(0, 5));
    } catch (err) {
      console.log(err);
      if (news.length > 0) setTrendingNews(news.slice(0, 5));
    }
  };

  // FETCH NEWS
  const loadingRef = useRef(false);
  const fetchNews = async () => {
    if (loadingRef.current) return;
    try {
      let url = "";
      if (search.trim() !== "") {
        url = `https://gnews.io/api/v4/search?q=${search}&lang=${language}&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      } else if (channel !== "") {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(channel)}&lang=en&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      } else {
        url = `https://gnews.io/api/v4/top-headlines?category=${category || "general"}&lang=${language}&country=in&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      }
      setLoading(true);
      loadingRef.current = true;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.articles && data.articles.length > 0) {
        if (page === 1) setNews(data.articles);
        else setNews((prev) => [...prev, ...data.articles]);
      } else if (page === 1) { setNews([]); }
      setLoading(false);
      loadingRef.current = false;
    } catch (err) { console.log("API Error:", err); setNews([]); setLoading(false); loadingRef.current = false; }
  };

  useEffect(() => { fetchNews(); }, [category, channel, language, page]);
  useEffect(() => { if (news.length > 0) fetchTrendingNews(); }, [news]);
  useEffect(() => { fetchTrendingNews(); }, []);

  // INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 300 &&
        !loadingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // BOOKMARK
  const handleBookmark = (item) => {
    if (bookmarks.find((b) => b.url === item.url)) { alert("Already Bookmarked"); return; }
    const updated = [...bookmarks, item];
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    alert("News Bookmarked");
  };

  const removeBookmark = (url) => {
    const updated = bookmarks.filter((b) => b.url !== url);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  // FILTER + SORT
  const filteredNews = [...news]
    .filter((item) => item.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "ratings") return getStableRating(b.title) - getStableRating(a.title);
      if (sortBy === "latest") return new Date(b.publishedAt) - new Date(a.publishedAt);
      return 0;
    });

  const langLabel = language === "hi" ? "हिन्दी" : "English";

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : "light-mode"}`} style={themeVars}>

      {/* HEADER */}
      <div className="dash-header">
        <h1 className="dash-title">GEOSPHERE <span className="dash-globe">🌏</span></h1>
        <p className="dash-subtitle">Your personalized news & weather hub</p>
      </div>


      {/* TOPBAR */}
      <div className="topbar">
        <h3>Welcome to the News Dashboard 👋</h3>
        <div className="topbar-actions">
          <span className="lang-badge">{langLabel}</span>
          <button className="mode-btn" onClick={toggleMode}>
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button className={`pref-btn ${showBookmarks ? 'active' : ''}`} onClick={() => setShowBookmarks(!showBookmarks)}>🔖 Bookmarks ({bookmarks.length})</button>
          <Link to="/personalization">
            <button className="pref-btn">⚙️ Preferences</button>
          </Link>
          <Link to="/">
            <button className="logout-btn">Logout</button>
          </Link>
        </div>
      </div>

      {/* BOOKMARKS PANEL */}
      {showBookmarks && (
        <div className="bookmarks-panel">
          <h2>🔖 Saved Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="no-bookmarks">No bookmarks saved yet.</p>
          ) : (
            <div className="bookmarks-list">
              {bookmarks.map((item, i) => (
                <div key={i} className="bookmark-item">
                  <Link to="/news-details" state={item} style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
                    <h4>{item.title}</h4>
                    <small>{item.source?.name}</small>
                  </Link>
                  <button className="remove-bookmark" onClick={() => removeBookmark(item.url)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOP CONTENT */}
      <div className="top-layout">

        {/* WEATHER */}
        <div className="weather-card">
          <h2>Weather 🌤️</h2>
          <div className="weather-search">
            <input type="text" placeholder="Enter city" value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()} />
            <button onClick={fetchWeather}>Check</button>
          </div>
          {weather && weather.main && (
            <div className="weather-info">
              <h3>{weather.name}</h3>
              <p>🌡️ Temperature: {weather.main.temp}°C</p>
              <p>☁️ Weather: {weather.weather[0].main}</p>
              <p>💨 Wind: {weather.wind.speed} km/h</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="right-content">

          {/* SEARCH */}
          <div className="search-section">
            <input type="text" placeholder={language === "hi" ? "समाचार खोजें..." : "Search news..."}
              value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} />
            <button onClick={() => handleSearch()}>Search 🔍</button>
            <button onClick={startVoiceSearch}>
              {isListening ? "🎙️ Listening..." : "🎤 Voice"}
            </button>
          </div>

          {/* CHANNELS */}
          <div className="channels">
            {["BBC", "CNN", "The Hindu", "Times of India", "NDTV", "Financial Express"].map((ch) => (
              <button key={ch} className={channel === ch ? "active" : ""}
                onClick={() => { setPage(1); setSearch(""); setCategory(""); setChannel(channel === ch ? "" : ch); }}>
                {ch}
              </button>
            ))}
          </div>

          {/* FILTER */}
          <div className="filters">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="ratings">Ratings</option>
            </select>
          </div>

          {/* CATEGORIES */}
          <div className="categories">
            {(favCategories.length > 0 ? favCategories : ["technology", "sports", "business", "health", "entertainment", "science"]).map((cat) => (
              <button key={cat} className={category === cat ? "active" : ""}
                onClick={() => { setPage(1); setSearch(""); setChannel(""); setCategory(cat); }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRENDING NEWS */}
      <div className="trending-section">
        <h2>🔥 Trending News</h2>
        <div className="trending-list">
          {trendingNews.length > 0 ? trendingNews.map((item, i) => (
            <div key={i} className="trending-item">
              <h4>{item.title}</h4>
              <small>{item.source?.name}</small>
            </div>
          )) : (
            <div className="trending-item"><h4>Loading Trending News...</h4></div>
          )}
        </div>
      </div>

      {/* NEWS CARDS */}
      <div className="cards-container" ref={newsRef}>
        {filteredNews.length === 0 ? (
          <h2>No News Found</h2>
        ) : (
          filteredNews.map((item, index) => (
            <Link key={index} to="/news-details" state={item}
              style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card">
                <button className="bookmark-btn" onClick={(e) => {
                  e.preventDefault(); e.stopPropagation(); handleBookmark(item);
                }}>🔖</button>
                <img src={item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"}
                  alt="news" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"; }} />
                <h2>{item.title}</h2>
                <p className="card-desc">{item.description}</p>
                <p className="rating">⭐ Rating: {getStableRating(item.title).toFixed(1)}/5</p>
                <p className="card-source"><b>Source:</b> {item.source?.name}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {loading && <h2 style={{ textAlign: "center" }}>Loading News...</h2>}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Geosphere 🌍</h3>
          <p>Smart News & Weather Aggregator Platform</p>
          <p>Built with React • MongoDB • GNews API • Weather API</p>
          <p className="copyright">© 2026 Geosphere Team</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
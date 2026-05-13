import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);

  const API_KEY = "fd81d5cccc6846feb9bf786c06704e69";

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // FETCH NEWS API
  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNews(data.articles);
      });
  }, []);

  // SEARCH FILTER
  const filteredNews = news.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h1 className="header">Geosphere 🌏</h1>

      <div className="topbar">
        <h3>Welcome to the News Dashboard 👋</h3>

        <div className="topbar-actions">
          <button className="mode-btn" onClick={toggleMode}>
            {isDarkMode ? "☀️Light Mode" : "🌙Dark Mode"}
          </button>

          <Link to="/">
            <button className="logout-btn">Logout</button>
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button>Search 🔍</button>
      </div>

      {/* CHANNELS */}
      <div className="channels">
        <button>BBC News</button>
        <button>CNN</button>
        <button>The Hindu</button>
        <button>The Times of India</button>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        <button>Technology</button>
        <button>Sports</button>
        <button>Business</button>
        <button>Entertainment</button>
        <button>Health</button>
        <button>Science</button>
      </div>

      {/* NEWS CARDS */}
      <div className="cards-container">
        {filteredNews.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => setSelectedNews(item)}
          >
            <button className="bookmark-btn">🔖</button>

            <img
              src={
                item.urlToImage ||
                "https://via.placeholder.com/300x180"
              }
              alt="news"
            />

            <h2>{item.title}</h2>
          </div>
        ))}
      </div>

      {/* NEWS DETAILS */}
      {selectedNews && (
        <div className="news-details">
          <h2>{selectedNews.title}</h2>

          <img
            src={
              selectedNews.urlToImage ||
              "https://via.placeholder.com/500x300"
            }
            alt="news"
            style={{ width: "100%", borderRadius: "10px" }}
          />

          <p style={{ marginTop: "20px" }}>
            {selectedNews.description}
          </p>

          <a
            href={selectedNews.url}
            target="_blank"
            rel="noreferrer"
          >
            Read Full News
          </a>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
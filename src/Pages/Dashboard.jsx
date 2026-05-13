import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedNews, setSelectedNews] = useState(null);

  const [news, setNews] = useState([]);

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("latest");

  const [isListening, setIsListening] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);

  const [category, setCategory] = useState("");

  const [channel, setChannel] = useState("");

  const [loading, setLoading] = useState(false);

  // PUT YOUR GNEWS API KEY HERE
  const API_KEY = "ed2f7aec665595d63a813ada95c7014d";

  // DARK MODE
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // VOICE SEARCH
  const startVoiceSearch = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert("Voice Search not supported");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {

      setSearch(
        event.results[0][0].transcript
      );

      setIsListening(false);
    };

    recognition.onerror = () => {

      setIsListening(false);
    };
  };

  // FETCH NEWS
  const fetchNews = async () => {

    setLoading(true);

    let url = "";

    // CHANNEL NEWS
    if (channel) {

      url =
        `https://gnews.io/api/v4/search?q=${channel}` +
        `&lang=en&country=in&max=10&page=${page}` +
        `&apikey=${API_KEY}`;
    }

    // CATEGORY NEWS
    else if (category) {

      url =
        `https://gnews.io/api/v4/top-headlines?category=${category}` +
        `&lang=en&country=in&max=10&page=${page}` +
        `&apikey=${API_KEY}`;
    }

    // DEFAULT INDIA NEWS
    else {

      url =
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in` +
        `&max=10&page=${page}&apikey=${API_KEY}`;
    }

    try {

      const response = await fetch(url);

      const data = await response.json();

      console.log(data);

      if (data.errors) {

        alert("Invalid API Key");

        setLoading(false);

        return;
      }

      if (data.articles) {

        const updatedArticles =
          data.articles.map((item) => ({

            ...item,

            // FIX IMAGE FIELD
            urlToImage: item.image,

            // FIX SOURCE FIELD
            source: {
              name: item.source?.name,
            },

            // RANDOM RATINGS
            rating:
              Math.floor(
                Math.random() * 5
              ) + 1,
          }));

        if (page === 1) {

          setNews(updatedArticles);

        } else {

          setNews((prev) => [
            ...prev,
            ...updatedArticles,
          ]);
        }
      }

    } catch (error) {

      console.log("ERROR:", error);
    }

    setLoading(false);
  };

  // FETCH NEWS
  useEffect(() => {

    fetchNews();

  }, [page, category, channel]);

  // INFINITE SCROLL
  useEffect(() => {

    let timeout;

    const handleScroll = () => {

      clearTimeout(timeout);

      timeout = setTimeout(() => {

        if (
          window.innerHeight +
            document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight &&
          !loading
        ) {

          setPage((prev) => prev + 1);
        }

      }, 500);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, [loading]);

  // BOOKMARK
  const handleBookmark = (item) => {

    const alreadyBookmarked =
      bookmarks.find(
        (bookmark) =>
          bookmark.url === item.url
      );

    if (alreadyBookmarked) {

      alert("Already Bookmarked");

      return;
    }

    setBookmarks([
      ...bookmarks,
      item,
    ]);

    alert("News Bookmarked");
  };

  // FILTER + SORT
  const filteredNews = news

    .filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

    .sort((a, b) => {

      if (sortBy === "ratings") {

        return (
          b.rating - a.rating
        );
      }

      return 0;
    });

  return (

    <div
      className={`dashboard ${
        isDarkMode
          ? "dark-mode"
          : "light-mode"
      }`}
    >

      <h1 className="header">
        Geosphere 🌏
      </h1>

      {/* TOPBAR */}

      <div className="topbar">

        <h3>
          Welcome to the News Dashboard 👋
        </h3>

        <div className="topbar-actions">

          <button
            className="mode-btn"
            onClick={toggleMode}
          >

            {isDarkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}

          </button>

          <Link to="/">
            <button className="logout-btn">
              Logout
            </button>
          </Link>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-section">

        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button>
          Search 🔍
        </button>

        <button
          onClick={startVoiceSearch}
        >

          {isListening
            ? "🎙️ Listening..."
            : "🎤 Voice Search"}

        </button>

      </div>

      {/* CHANNELS */}

      <div className="channels">

        <button
          onClick={() => {

            setPage(1);

            setCategory("");

            setChannel("BBC");
          }}
        >
          BBC News
        </button>

        <button
          onClick={() => {

            setPage(1);

            setCategory("");

            setChannel("CNN");
          }}
        >
          CNN
        </button>

        <button
          onClick={() => {

            setPage(1);

            setCategory("");

            setChannel("The Hindu");
          }}
        >
          The Hindu
        </button>

        <button
          onClick={() => {

            setPage(1);

            setCategory("");

            setChannel("Times of India");
          }}
        >
          The Times of India
        </button>

      </div>

      {/* SORT */}

      <div className="filters">

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >

          <option value="latest">
            Latest
          </option>

          <option value="ratings">
            Ratings
          </option>

        </select>

      </div>

      {/* CATEGORIES */}

      <div className="categories">

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "technology"
            );
          }}
        >
          Technology
        </button>

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "sports"
            );
          }}
        >
          Sports
        </button>

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "business"
            );
          }}
        >
          Business
        </button>

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "entertainment"
            );
          }}
        >
          Entertainment
        </button>

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "health"
            );
          }}
        >
          Health
        </button>

        <button
          onClick={() => {

            setPage(1);

            setChannel("");

            setCategory(
              "science"
            );
          }}
        >
          Science
        </button>

      </div>

      {/* NEWS CARDS */}

      <div className="cards-container">

        {filteredNews.map(
          (item, index) => (

            <div
              className="card"
              key={index}
              onClick={() =>
                setSelectedNews(item)
              }
            >

              {/* BOOKMARK */}

              <button
                className="bookmark-btn"
                onClick={(e) => {

                  e.stopPropagation();

                  handleBookmark(item);
                }}
              >
                🔖
              </button>

              {/* IMAGE */}

              <img
                src={
                  item.urlToImage ||
                  "https://via.placeholder.com/300x180"
                }
                alt="news"
              />

              {/* TITLE */}

              <h2>
                {item.title}
              </h2>

              {/* RATING */}

              <p>
                ⭐ Rating:
                {item.rating}/5
              </p>

              {/* SOURCE */}

              <p>
                <b>Source:</b>{" "}
                {
                  item.source?.name
                }
              </p>

            </div>

          )
        )}

      </div>

      {/* LOADING */}

      {loading && (

        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >

          Loading News...

        </h2>

      )}

      {/* NEWS DETAILS */}

      {selectedNews && (

        <div className="news-details">

          <h2>
            {selectedNews.title}
          </h2>

          <img
            src={
              selectedNews.urlToImage ||
              "https://via.placeholder.com/500x300"
            }
            alt="news"

            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <p
            style={{
              marginTop: "20px",
            }}
          >

            {
              selectedNews.description
            }

          </p>

          <a
            href={
              selectedNews.url
            }
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
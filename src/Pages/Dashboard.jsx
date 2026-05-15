import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {

  const [isDarkMode, setIsDarkMode] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [news, setNews] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [sortBy, setSortBy] =
    useState("latest");

  const [isListening, setIsListening] =
    useState(false);

  const [bookmarks, setBookmarks] =
    useState([]);

  const [category, setCategory] =
    useState("");

  const [channel, setChannel] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  

  // YOUR API KEY
  const API_KEY =
    "5dabd041937d8a6936955e9ace163bd8";

  // DARK MODE
  const toggleMode = () => {

    setIsDarkMode(
      !isDarkMode
    );
  };

  


  // VOICE SEARCH
  const startVoiceSearch = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice Search not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setIsListening(true);

    recognition.onresult = (
      event
    ) => {

      setSearch(
        event.results[0][0]
          .transcript
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

    // DEFAULT NEWS
    else {

      url =
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in` +
        `&max=10&page=${page}` +
        `&apikey=${API_KEY}`;
    }

    try {

      const response =
        await fetch(url);

      const data =
        await response.json();

      console.log(data);

      if (data.articles) {

        const updatedArticles =
          data.articles.map(
            (item) => ({

              ...item,

              urlToImage:
                item.image,

              source: {
                name:
                  item.source?.name,
              },

              rating:
                Math.floor(
                  Math.random() * 5
                ) + 1,
            })
          );

        if (page === 1) {

          setNews(
            updatedArticles
          );

        } else {

          setNews((prev) => [
            ...prev,
            ...updatedArticles,
          ]);
        }
      }

    } catch (error) {

      console.log(error);
    }

    setLoading(false);
  };

  // FETCH NEWS
  useEffect(() => {

    fetchNews();

  }, [page, category, channel]);

  // INFINITE SCROLL
  useEffect(() => {

    const handleScroll = () => {

      if (
        window.innerHeight +
          document.documentElement
            .scrollTop + 1 >=
        document.documentElement
          .scrollHeight &&
        !loading
      ) {

        setPage(
          (prev) => prev + 1
        );
      }
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
  const handleBookmark = (
    item
  ) => {

    const alreadyBookmarked =
      bookmarks.find(
        (bookmark) =>
          bookmark.url ===
          item.url
      );

    if (alreadyBookmarked) {

      alert(
        "Already Bookmarked"
      );

      return;
    }

    setBookmarks([
      ...bookmarks,
      item,
    ]);

    alert(
      "News Bookmarked"
    );
  };

  // FILTER NEWS
  const filteredNews = news

    .filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

    .sort((a, b) => {

      if (
        sortBy === "ratings"
      ) {

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

      {/* HEADER */}

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
          onClick={
            startVoiceSearch
          }
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

            setChannel(
              "The Hindu"
            );
          }}
        >
          The Hindu
        </button>

        <button
          onClick={() => {

            setPage(1);

            setCategory("");

            setChannel(
              "Times of India"
            );
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

            <Link
              key={index}
              to="/news-details"
              state={item}
              style={{
                textDecoration:
                  "none",
                color: "inherit",
              }}
            >

              <div className="card">

                <button
                  className="bookmark-btn"
                  onClick={(e) => {

                    e.preventDefault();

                    e.stopPropagation();

                    handleBookmark(
                      item
                    );
                  }}
                >
                  🔖
                </button>

                <img
                  src={
                    item.urlToImage ||
                    "https://via.placeholder.com/300"
                  }
                  alt="news"
                />

                <h2>
                  {item.title}
                </h2>

                <p>
                  {item.description}
                </p>

                <p>
                  ⭐ Rating:
                  {item.rating}/5
                </p>

                <p>

                  <b>Source:</b>{" "}

                  {item.source?.name}

                </p>

              </div>

            </Link>

          )
        )}

      </div>

      {/* LOADING */}

      {loading && (

        <h2
          style={{
            textAlign:
              "center",
          }}
        >

          Loading News...

        </h2>

      )}

    </div>
  );
}

export default Dashboard;    
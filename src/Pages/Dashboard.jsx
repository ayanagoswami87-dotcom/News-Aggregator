// Dashboard.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {

  // STATES
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

  // WEATHER STATES
  const [weather, setWeather] =
    useState(null);

  const [city, setCity] =
    useState("Dhemaji");

  // API KEYS
  const NEWS_API_KEY =
    "ed2f7aec665595d63a813ada95c7014d";

  const WEATHER_API_KEY =
    "a3a17aa5e90e1f7f7469785177d1dce5";

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

  // FETCH WEATHER
  const fetchWeather =
    async () => {

      // EMPTY INPUT
      if (!city.trim()) {

        alert(
          "Please enter city name"
        );

        return;
      }

      try {

        const response =
          await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              city
            )}&appid=${WEATHER_API_KEY}&units=metric`
          );

        const data =
          await response.json();

        console.log(
          "Weather Data:",
          data
        );

        // INVALID CITY
        if (
          data.cod === "404" ||
          data.cod === 404
        ) {

          alert(
            "City not found"
          );

          return;
        }

        // INVALID API KEY
        if (
          data.cod === 401
        ) {

          alert(
            "Invalid Weather API Key"
          );

          return;
        }

        setWeather(data);

      } catch (error) {

        console.log(error);

        alert(
          "Weather API Error"
        );
      }
    };

  // FETCH NEWS
  const fetchNews = async () => {

    setLoading(true);

    let url = "";

    // SEARCH NEWS
    if (search) {

      url =
        `https://gnews.io/api/v4/search?q=${search}` +
        `&lang=en&country=in&max=10&page=${page}` +
        `&apikey=${NEWS_API_KEY}`;
    }

    // CHANNEL NEWS
    else if (channel) {

      url =
        `https://gnews.io/api/v4/search?q=${channel}` +
        `&lang=en&country=in&max=10&page=${page}` +
        `&apikey=${NEWS_API_KEY}`;
    }

    // CATEGORY NEWS
    else if (category) {

      url =
        `https://gnews.io/api/v4/top-headlines?category=${category}` +
        `&lang=en&country=in&max=10&page=${page}` +
        `&apikey=${NEWS_API_KEY}`;
    }

    // DEFAULT NEWS
    else {

      url =
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in` +
        `&max=10&page=${page}` +
        `&apikey=${NEWS_API_KEY}`;
    }

    try {

      const response =
        await fetch(url);

      const data =
        await response.json();

      console.log(
        "News Data:",
        data
      );

      if (
        data &&
        data.articles &&
        Array.isArray(
          data.articles
        )
      ) {

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

        // FIRST PAGE
        if (page === 1) {

          setNews(
            updatedArticles
          );

        }

        // INFINITE SCROLL
        else {

          setNews((prev) => [
            ...prev,
            ...updatedArticles,
          ]);
        }

      } else {

        setNews([]);
      }

    } catch (error) {

      console.log(error);

      setNews([]);
    }

    setLoading(false);
  };

  // INITIAL FETCH
  useEffect(() => {

    fetchNews();

    fetchWeather();

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

      {/* WEATHER SECTION */}

      <div className="weather-card">

        <h2>
          Weather 🌤️
        </h2>

        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) =>
            setCity(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              fetchWeather();
            }
          }}
        />

        <button
          onClick={() => {

            fetchWeather();
          }}
        >
          Check Weather
        </button>

        {weather &&
          weather.main && (

            <div>

              <h3>
                {weather.name}
              </h3>

              <p>
                🌡️ Temperature:
                {
                  weather.main.temp
                }
                °C
              </p>

              <p>
                ☁️ Weather:
                {
                  weather.weather[0]
                    .main
                }
              </p>

              <p>
                💨 Wind Speed:
                {
                  weather.wind.speed
                }
                km/h
              </p>

            </div>
          )}

      </div>

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

        <button
          onClick={() => {

            setPage(1);

            fetchNews();
          }}
        >
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

            setSearch("");

            setCategory("");

            setChannel("BBC");
          }}
        >
          BBC News
        </button>

        <button
          onClick={() => {

            setPage(1);

            setSearch("");

            setCategory("");

            setChannel("CNN");
          }}
        >
          CNN
        </button>

        <button
          onClick={() => {

            setPage(1);

            setSearch("");

            setCategory("");

            setChannel(
              "The Hindu"
            );
          }}
        >
          The Hindu
        </button>

      </div>

      {/* FILTER */}

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

            setSearch("");

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

            setSearch("");

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

            setSearch("");

            setChannel("");

            setCategory(
              "business"
            );
          }}
        >
          Business
        </button>

      </div>

      {/* NEWS CARDS */}

      <div className="cards-container">

        {filteredNews.length ===
        0 ? (

          <h2>
            No News Found
          </h2>

        ) : (

          filteredNews.map(
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
                    {
                      item.description
                    }
                  </p>

                  <p>
                    ⭐ Rating:
                    {item.rating}/5
                  </p>

                  <p>

                    <b>
                      Source:
                    </b>{" "}

                    {
                      item.source
                        ?.name
                    }

                  </p>

                </div>

              </Link>

            )
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
// Dashboard.jsx

import React, {
  useEffect,
  useState,
  useRef,
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
  const newsRef =
useRef(null);

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
  
  const [trendingNews, setTrendingNews] =
  useState([]);

 

  const [city, setCity] =
    useState("");

  // API KEYS
  const NEWS_API_KEY =
    "5dabd041937d8a6936955e9ace163bd8";

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
 const fetchWeather = async () => {

if(city.trim()===""){

return;

}

try{

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`

);

const data =
await response.json();

setWeather(data);

}

catch(error){

console.log(error);

}

};
      

 
 
  // TRENDING NEWS

 const fetchTrendingNews = async () => {

try {

const response = await fetch(

`https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=5&apikey=${NEWS_API_KEY}`

);

const data = await response.json();

console.log(
"Trending Data:",
data
);

if(
data &&
data.articles &&
data.articles.length > 0
){

setTrendingNews(
data.articles
);

}
else{

if(news.length>0){

setTrendingNews(
news.slice(0,5)
);

}

}
}

catch(error){

console.log(error);

if(news.length>0){

setTrendingNews(
news.slice(0,5)
);

}

}

};

   // FETCH NEWS
const fetchNews = async () => {

try{

let url="";

if(search.trim()!==""){

url=`https://gnews.io/api/v4/search?q=${search}&lang=en&country=in&max=10&apikey=${NEWS_API_KEY}`;

}
else{

url=`https://gnews.io/api/v4/top-headlines?category=${category.toLowerCase()}&lang=en&country=in&max=10&page=${page}&apikey=${NEWS_API_KEY}`;

}

const response=
await fetch(url);

const data=
await response.json();

if(
data &&
data.articles
){

if(page===1){

setNews(
data.articles
);

}
else{

setNews(
(prev)=>[
...prev,
...data.articles
]
);

}

}

}

catch(error){

console.log(error);

}

};
  // INITIAL FETCH
  // MAIN NEWS + WEATHER

useEffect(() => {

  fetchNews();

  

}, [ page,category]);



// TRENDING NEWS

useEffect(() => {

if(news.length > 0){

fetchTrendingNews();

}

}, [news]);
  // INFINITE SCROLL
useEffect(()=>{

const handleScroll=()=>{

const scrollTop=

window.scrollY;

const windowHeight=

window.innerHeight;

const fullHeight=

document.documentElement.scrollHeight;


if(

scrollTop+
windowHeight>=
fullHeight-200

){

setPage(
(prev)=>prev+1
);

}

};

window.addEventListener(
"scroll",
handleScroll
);

return()=>{

window.removeEventListener(
"scroll",
handleScroll
);

};

},[]);
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


      {/* WEATHER SECTION */}

      {/* TOP CONTENT */}

<div className="top-layout">

  {/* WEATHER */}

  <div className="weather-card">

<h2>
Weather 🌤️
</h2>

<div className="weather-search">

<input
type="text"
placeholder="Enter city"
value={city}
onChange={(e)=>
setCity(
e.target.value
)
}
/>

<button
onClick={fetchWeather}
>
Check Weather
</button>

</div>


{weather && weather.main && (

<div className="weather-info">

<h3>
{weather.name}
</h3>

<p>
🌡️ Temperature:
{weather.main.temp}°C
</p>

<p>
☁️ Weather:
{weather.weather[0].main}
</p>

<p>
💨 Wind:
{weather.wind.speed}
km/h
</p>

</div>

)}

</div>
  {/* RIGHT SIDE */}

  <div className="right-content">

    {/* SEARCH */}

    <div className="search-section">

      <input
      type="text"
      placeholder="Search news..."
      value={search}
      onChange={(e)=>
      setSearch(
      e.target.value
      )
      }
      />

     <button
onClick={()=>{

setPage(1);

fetchNews();

setTimeout(()=>{

newsRef.current?.scrollIntoView({

behavior:"smooth",

block:"start"

});

},1000);

}}
>

Search 🔍

</button>
      <button
      onClick={startVoiceSearch}
      >
      {
      isListening
      ?
      "🎙️ Listening..."
      :
      "🎤 Voice Search"
      }
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
         <button
          onClick={() => {

            setPage(1);

            setSearch("");

            setCategory("");

            setChannel(
              " Times of India"
            );
          }}
        >
          The Times of India
        </button>
         <button
          onClick={() => {

            setPage(1);

            setSearch("");

            setCategory("");

            setChannel(
              "NDTV"
            );
          }}
        >
          NDTV
        </button>
         <button
          onClick={() => {

            setPage(1);

            setSearch("");

            setCategory("");

            setChannel(
              "Financial Express"
            );
          }}
        >
          Financial Express
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
         <button
          onClick={() => {

            setPage(1);

            setSearch("");

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

            setSearch("");

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

            setSearch("");

            setChannel("");

            setCategory(
              "science"
            );
          }}
        >
          Science
        </button>
         


      </div>
      </div> {/* right-content */}

</div> {/* top-layout */}


{/* TRENDING NEWS */}

<div className="trending-section">

<h2>
🔥 Trending News
</h2>

<div className="trending-list">

{
trendingNews.length > 0 ?

trendingNews.map(
(item,index)=>(

<div
key={index}
className="trending-item"
>

<h4>
{item.title}
</h4>

<small>
{item.source?.name}
</small>

</div>

))

:

<div
className="trending-item"
>

<h4>
Loading Trending News...
</h4>

</div>

}

</div>

</div>


      {/* NEWS CARDS */}

      <div
className="cards-container"
ref={newsRef}
>

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
    {/* FOOTER */}

<footer className="footer">

  <div className="footer-content">

    <h3>
      Geosphere 🌍
    </h3>

    <p>
      Smart News & Weather
      Aggregator Platform
    </p>

    <p>
      Built with React • MongoDB •
      GNews API • Weather API
    </p>

    <p className="copyright">

      © 2026 Geosphere Team

    </p>

  </div>

</footer>
    </div>
  );
}

export default Dashboard;
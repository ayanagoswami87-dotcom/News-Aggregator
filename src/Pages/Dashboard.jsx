import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

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

  const [loading, setLoading] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [channel, setChannel] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [bookmarks, setBookmarks] =
    useState([]);

  const API_KEY =
    "ed2f7aec665595d63a813ada95c7014d";



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
        "Voice search not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setIsListening(true);

    recognition.onresult =
      (event) => {

        setSearch(
          event.results[0][0]
            .transcript
        );

        setIsListening(false);

      };

    recognition.onerror =
      () => {

        setIsListening(false);

      };
  };



  // FETCH NEWS

  const fetchNews = async () => {

    setLoading(true);

    let url = "";

    if (channel) {

      url =
        `https://gnews.io/api/v4/search?q=${channel}&lang=en&country=in&max=10&page=${page}&apikey=${API_KEY}`;

    }

    else if (category) {

      url =
        `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&page=${page}&apikey=${API_KEY}`;

    }

    else {

      url =
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&page=${page}&apikey=${API_KEY}`;

    }

    try {

      const response =
        await fetch(url);

      const data =
        await response.json();

      if (data.articles) {

        const updatedNews =
          data.articles.map(
            (item) => ({

              ...item,

              urlToImage:
                item.image,

              source: {
                name:
                  item.source?.name
              },

              rating:
                Math.floor(
                  Math.random() * 5
                ) + 1

            })
          );

        if (page === 1) {

          setNews(
            updatedNews
          );

        }

        else {

          setNews(
            (prev) => [
              ...prev,
              ...updatedNews
            ]
          );

        }

      }

    }

    catch(error){

      console.log(error);

    }

    setLoading(false);

  };



  useEffect(() => {

    fetchNews();

  },[
    page,
    category,
    channel
  ]);



  // INFINITE SCROLL

  useEffect(() => {

    const handleScroll =
      () => {

      if(

        window.innerHeight +
        document.documentElement.scrollTop + 1

        >=

        document.documentElement.scrollHeight

        && !loading

      ){

        setPage(
          (prev)=>
          prev+1
        );

      }

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return ()=>{

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  },[loading]);



  // BOOKMARK

  const handleBookmark =
    (item)=>{

      const exists =
      bookmarks.find(

        bookmark=>

        bookmark.url===item.url

      );

      if(exists){

        alert(
          "Already bookmarked"
        );

        return;

      }

      setBookmarks(
        [
          ...bookmarks,
          item
        ]
      );

      alert(
        "News bookmarked"
      );

  };



  // FILTER + SORT

  const filteredNews =
    news

    .filter(

      item=>

      item.title
      ?.toLowerCase()

      .includes(

        search
        .toLowerCase()

      )

    )

    .sort((a,b)=>{

      if(
        sortBy==="ratings"
      ){

        return(
          b.rating-
          a.rating
        );

      }

      return 0;

    });



  return (

<div
className={`dashboard ${
isDarkMode
?"dark-mode"
:"light-mode"
}`}>

<h1>
Geosphere 🌏
</h1>



<div className="topbar">

<button
onClick={
toggleMode
}
>

{isDarkMode
?
"☀️ Light"
:
"🌙 Dark"
}

</button>



<button
onClick={() => {
localStorage.removeItem("user");
navigate("/");
}}
>

Logout

</button>

</div>



<div className="search-section">

<input

type="text"

placeholder=
"Search News"

value={search}

onChange={
(e)=>

setSearch(
e.target.value
)

}

/>



<button>

Search 🔍

</button>



<button
onClick=
{
startVoiceSearch
}
>

{
isListening
?

"🎙 Listening..."

:

"🎤 Voice"
}

</button>

</div>



<div className="categories">

<button
onClick={()=>{
setPage(1);
setCategory(
"technology"
);
}}
>
Technology
</button>

<button
onClick={()=>{
setPage(1);
setCategory(
"sports"
);
}}
>
Sports
</button>

<button
onClick={()=>{
setPage(1);
setCategory(
"business"
);
}}
>
Business
</button>

</div>



<div className=
"filters">

<select
value={sortBy}
onChange={(e)=>
setSortBy(
e.target.value
)}
>

<option
value="latest"
>
Latest
</option>

<option
value="ratings"
>
Ratings
</option>

</select>

</div>



<div className=
"cards-container">

{

filteredNews.map(

(item,index)=>(

<div

className="card"

key={index}

onClick={()=>

navigate(
"/news-details",
{ state: item }
)

}

>

<button

className=
"bookmark-btn"

onClick={(e)=>{

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

⭐ {item.rating}/5

</p>

<p>

{item.source?.name}

</p>

</div>

)

)

}

</div>



{

loading &&

<h2>

Loading...

</h2>

}





</div>

);

}

export default Dashboard;
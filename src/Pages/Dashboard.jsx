
import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import "./Dashboard.css";




function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    const [search,setSearch]=useState("");
    const [channel,setChannel]=useState("bbc-news");
    const [ratings,setRatings]=useState({});
    const API_KEY="1d4b1e7e56e1459698bca6ebef4376ff";
    useEffect(() => {
        fetch(
            `https://newsapi.org/v2/top-headlines?sources=${channel}&apiKey=${API_KEY}`
        )
        .then((response) => response.json())
        .then((data) => {
            setNews(data.articles);
        });
    }, [channel]);
    const filteredNews=news.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
    );

    const news= [
        {
            title: "Technology News",
            description: "Latest updates in technology updates around the world.",
            image: "https://via.placeholder.com/300x180"
        },
        {
            title: "Sports News",
            description: "Latest sports highlights and scores.",
            image: "https://via.placeholder.com/300x180"
        },
        {
            title: "Business News",
            description: "Latest business trends and market updates.",
            image: "https://via.placeholder.com/300x180"
          },
        {
            title: "Entertainment News",
            description: "Latest celebrity gossip and movie releases.",
            image: "https://via.placeholder.com/300x180"
        }
    ];   
    return(
        <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 classname= "header"> News Dashboard</h1>
            <div className="topbar">
                <h3>Welcome to the News Dashboard 👋</h3>
                
                <div className="topbar-actions">
                    <button className="mode-btn" onClick={toggleMode}>{isDarkMode ? '☀️Light Mode' : '🌙Dark Mode'}</button>
                <Link to="/"><button className="logout-btn">Logout</button></Link>
             </div>
             </div>
             
                <div className="search-section">
                    <input type="text" placeholder="Search news..."/>
                    <button>Search🔍</button>
                
                </div>

                <div className="channels">
                    <button onClick={() => setChannel("bbc-news")}>BBC News</button>
                    <button onClick={() => setChannel("cnn")}>CNN</button>
                    <button onClick={() => setChannel("the-hindu")}>The Hindu</button>
                    <button onClick={() => setChannel("the-times-of-india")}>The Times of India</button>
                </div>

            <div className="categories">
                <button>Technology</button>
                <button>Sports</button>
                <button>Business</button>
                <button>Entertainment</button>
            </div>
            <div className="cards-container">
                {filteredNews.map((item, index) => (
                    <div className="card" key={index}>
                        <img src={item.urlToImage || "https://via.placeholder.com/300x180"} alt="news"/>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <a href={item.url} target="_blank">Read More</a>

                        <div className="rating">{[1,2,3,4,5].map((star) => (
                            <span key={star}onClick={()=>setRatings({...ratings,[index]:star})} style={{cursor:'pointer',fontSize:'22px'}}>{ratings[index] >= star ? '⭐' : '☆'}</span>
                        ))}</div>
                        <div className="comment-box">
                            <input type="text" placeholder="Add a comment..."/>
                            <button>Post</button>
                        </div>
                        <button className="bookmark-btn">🔖Bookmark</button>
                        <div className="comments">
                            <p>. Nice Article!</p>
                            <p>. Very Informative!</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )  ;     
        }

export default Dashboard;

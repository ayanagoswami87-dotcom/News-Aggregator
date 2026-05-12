
import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import "./Dashboard.css";




function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };
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
        },

        {   
            title: "Education News",
            description: "Latest education policies.",
            image: "https://via.placeholder.com/300x180" 
        },

        {
            title: "Health News",
            description: "Latest health and medical updates.",
            image: "https://via.placeholder.com/300x180"
        },

        {
            title: "Science News",
            description: "Latest scientific discoveries and research.",
            image: "https://via.placeholder.com/300x180"
        },

        {
            title: "Investment and Stock Market News",
            description: "Latest updates in investment and stock market.",
            image: "https://via.placeholder.com/300x180"
        },
    ];
    return(
        <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 classname= "header"> Geosphere 🌏 </h1>
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

            <div className="categories">
                <button>Technology</button>
                <button>Sports</button>
                <button>Business</button>
                <button>Entertainment</button>
                <button>Education</button>
                <button>Health</button>
                <button>Science</button>
                <button>Investment and Stock Market</button>
            </div>
            <div className="cards-container">
                {news.map((item, index) => (
                    <div className="card" key={index}>
                        <img src={item.image} alt="news"/>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <a href="/">Read More</a>
                        <div className="rating">⭐⭐⭐⭐⭐</div>
                        <div className="comment-box">
                            <input type="text" placeholder="Add a comment..."/>
                            <button>Post</button>
                        </div>
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

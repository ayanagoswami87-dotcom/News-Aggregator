import React, {useState} from "react";


const Personalization = () => { 
    const [categories, setCategories] = useState([]);
    const [theme, setTheme] = useState([]);
    const [language, setLanguage] = useState([]);
    const handleCategoryChange = (category) => {
        if (categories.includes(category)) {
            setCategories(categories.filter(item => item !== category));
        } else {
            setCategories([...categories,category]);
        }
    };
    const savePreferences = () => {
        const preferences = {
            categories,theme,language,
        };
        console.log(preferences);
        alert("Preferences Saved!");

        window.location.href = "/dashboard";
        
    };
    return (
        <div>
            <header>Hi, help us know you better.....</header>
            <div className="personalization-container">
                <h2>Select Favourite categories</h2>
                <div className="categories">
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Technology")}/>Technology</label>
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Sports")}/>Sports</label>
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Business")}/>Business</label>
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Health")}/>Health</label>
                
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Entertainment")}/>Entertainment</label>
                    <label><input type="checkbox" onChange={() => handleCategoryChange("Science")}/>Science</label>
                     
                </div>
                <h2>Choose Theme</h2>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option>Light Mode</option>
                    <option>Dark Mode</option>
                </select>
                <h2>Select Language</h2>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Assamese</option>
                    <option>Bengali</option>
                </select>
                <br/><br/>
                <button onClick={savePreferences}>Save Preferences</button>
            </div>
        </div>
    );
};

export default Personalization;
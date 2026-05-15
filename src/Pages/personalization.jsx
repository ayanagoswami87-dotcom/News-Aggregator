import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Personalization = () => {

  // STATES
  const [categories, setCategories] = useState([]);
  const [theme, setTheme] = useState("Light Mode");

  const [viewMode, setViewMode] = useState("detailed");
  const [fontSize, setFontSize] = useState("medium");
  const [layout, setLayout] = useState("grid");

  // LOAD SAVED PREFERENCES
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userPreferences"));

    console.log("Loaded Preferences:", saved); // DEBUG

    if (saved) {
      setCategories(saved.categories ?? []);
      setTheme(saved.theme ?? "Light Mode");
      setViewMode(saved.viewMode ?? "detailed");
      setFontSize(saved.fontSize ?? "medium");
      setLayout(saved.layout ?? "grid");
    }
  }, []);

  // CATEGORY SELECT (FIXED - no stale state)
  const handleCategoryChange = (category) => {
    setCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // SAVE (FORCE FRESH SAVE)
  
const savePreferences = () => {
  const preferences = {
    categories,
    theme,
    viewMode,
    fontSize,
    layout,
  };

  console.log("Saving Preferences:", preferences);

  // ✅ Directly save (no removeItem)
  localStorage.setItem("userPreferences", JSON.stringify(preferences));

  alert("Preferences Saved!");

  // ✅ Better navigation (no reload issue)
  window.location.assign("/dashboard");
};
  return (
    
    <div className={theme === "Dark Mode" ? "dark-mode" : "light-mode"}>
   
    

      <header>Hi, help us know you better.....</header>

      <div className="personalization-container">

        {/* CATEGORIES */}
        <h2>Select Favourite Categories</h2>
        <div className="categories">

          {[
            "Technology",
            "Sports",
            "Business",
            "Health",

            "Entertainment",
            "Science",
            
          ].map((cat, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => handleCategoryChange(cat.toLowerCase())}
                
              />
              {cat}
            </label>
          ))}

        </div>

        {/* THEME */}
        <h2>Choose Theme</h2>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="Light Mode">Light Mode</option>
          <option value="Dark Mode">Dark Mode</option>
        </select>
        <p>Selected: {theme}</p>

        {/* READING MODE */}
        <h2>Reading Mode</h2>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="detailed">Detailed</option>
          <option value="compact">Compact</option>
        </select>
        <p>Selected: {viewMode}</p>

        {/* FONT SIZE */}
        <h2>Font Size</h2>
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <p>Selected: {fontSize}</p>

        {/* LAYOUT */}
        <h2>Layout Style</h2>
        <select value={layout} onChange={(e) => setLayout(e.target.value)}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <p>Selected: {layout}</p>
        <br /><br />

        <button onClick={savePreferences}>
          Save Preferences
        </button>

      </div>
    </div>
  );
};      

export default Personalization;
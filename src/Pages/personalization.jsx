import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Personalization.css";

const Personalization = () => {

  const navigate = useNavigate();

  // STATES
  const [themeColor, setThemeColor] = useState("orange");
  const [interfaceTheme, setInterfaceTheme] = useState("light");
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState("en");

  // COLOR OPTIONS
  const colorOptions = [
    { name: "orange", color: "#ff7b00" },
    { name: "red", color: "#e91e63" },
    { name: "blue", color: "#2196f3" },
    { name: "purple", color: "#9c27b0" },
    { name: "green", color: "#4caf50" },
  ];

  // CATEGORY OPTIONS
  const categoryOptions = [
    { name: "Technology", icon: "💻" },
    { name: "Sports", icon: "⚽" },
    { name: "Business", icon: "💼" },
    { name: "Health", icon: "❤️" },
    { name: "Entertainment", icon: "🎬" },
    { name: "Science", icon: "🔬" },
  ];

  // LOAD SAVED PREFERENCES
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("userPreferences")
    );

    if (saved) {
      setThemeColor(saved.themeColor ?? "orange");
      setInterfaceTheme(saved.interfaceTheme ?? "light");
      setCategories(saved.categories ?? []);
      setLanguage(saved.language ?? "en");
    }
  }, []);

  // CATEGORY TOGGLE
  const toggleCategory = (cat) => {
    setCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // SAVE
  const savePreferences = () => {
    const preferences = {
      themeColor,
      interfaceTheme,
      categories,
      language,
      // Keep backward compat with old keys
      theme: interfaceTheme === "dark" ? "Dark Mode" : "Light Mode",
      viewMode: "detailed",
      fontSize: "medium",
      layout: "grid",
    };

    localStorage.setItem(
      "userPreferences",
      JSON.stringify(preferences)
    );

    navigate("/dashboard");
  };

  return (
    <div className="pz-page">

      {/* DECORATIVE BLOBS */}
      <div className="pz-blob pz-blob-1"></div>
      <div className="pz-blob pz-blob-2"></div>

      <div className="pz-card">

        {/* HEADER */}
        <div className="pz-header">
          <h1>PERSONALIZATION</h1>
          <span className="pz-sparkle">✦</span>
        </div>

        {/* THEME COLOR */}
        <div className="pz-section">
          <div className="pz-section-title">
            <span className="pz-icon">🎨</span>
            <div>
              <h2>Theme Color</h2>
              <p>Personalize your dashboard style.</p>
            </div>
          </div>

          <div className="pz-colors">
            {colorOptions.map((c) => (
              <button
                key={c.name}
                className={`pz-color-btn ${
                  themeColor === c.name ? "pz-color-active" : ""
                }`}
                style={{ background: c.color }}
                onClick={() => setThemeColor(c.name)}
                aria-label={c.name}
              >
                {themeColor === c.name && (
                  <span className="pz-color-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <hr className="pz-divider" />

        {/* INTERFACE THEME */}
        <div className="pz-section">
          <div className="pz-section-title">
            <span className="pz-icon">🖥️</span>
            <div>
              <h2>Interface Theme</h2>
              <p>Select your preferred UI theme.</p>
            </div>
          </div>

          <div className="pz-themes">
            {/* Light */}
            <div
              className={`pz-theme-card ${
                interfaceTheme === "light" ? "pz-theme-active" : ""
              }`}
              onClick={() => setInterfaceTheme("light")}
            >
              <div className="pz-theme-preview pz-preview-light">
                <div className="pz-preview-sidebar">
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                </div>
                <div className="pz-preview-content">
                  <div className="pz-preview-topbar">
                    <div className="pz-preview-toggle"></div>
                  </div>
                  <div className="pz-preview-body">
                    <div className="pz-preview-block"></div>
                    <div className="pz-preview-block"></div>
                  </div>
                </div>
              </div>
              {interfaceTheme === "light" && (
                <span className="pz-theme-check">✓</span>
              )}
              <span className={`pz-theme-label ${
                interfaceTheme === "light" ? "pz-label-active" : ""
              }`}>Light Theme</span>
            </div>

            {/* Dark */}
            <div
              className={`pz-theme-card ${
                interfaceTheme === "dark" ? "pz-theme-active" : ""
              }`}
              onClick={() => setInterfaceTheme("dark")}
            >
              <div className="pz-theme-preview pz-preview-dark">
                <div className="pz-preview-sidebar">
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                </div>
                <div className="pz-preview-content">
                  <div className="pz-preview-topbar">
                    <div className="pz-preview-toggle"></div>
                  </div>
                  <div className="pz-preview-body">
                    <div className="pz-preview-block"></div>
                    <div className="pz-preview-block"></div>
                  </div>
                </div>
              </div>
              {interfaceTheme === "dark" && (
                <span className="pz-theme-check">✓</span>
              )}
              <span className={`pz-theme-label ${
                interfaceTheme === "dark" ? "pz-label-active" : ""
              }`}>Dark Theme</span>
            </div>

            {/* System */}
            <div
              className={`pz-theme-card ${
                interfaceTheme === "system" ? "pz-theme-active" : ""
              }`}
              onClick={() => setInterfaceTheme("system")}
            >
              <div className="pz-theme-preview pz-preview-system">
                <div className="pz-preview-sidebar">
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                  <div className="pz-preview-line"></div>
                  <div className="pz-preview-line short"></div>
                </div>
                <div className="pz-preview-content">
                  <div className="pz-preview-topbar">
                    <div className="pz-preview-toggle"></div>
                  </div>
                  <div className="pz-preview-body">
                    <div className="pz-preview-block"></div>
                    <div className="pz-preview-block"></div>
                  </div>
                </div>
              </div>
              {interfaceTheme === "system" && (
                <span className="pz-theme-check">✓</span>
              )}
              <span className={`pz-theme-label ${
                interfaceTheme === "system" ? "pz-label-active" : ""
              }`}>System</span>
            </div>
          </div>
        </div>

        <hr className="pz-divider" />

        {/* FAVORITE CATEGORIES */}
        <div className="pz-section">
          <div className="pz-section-title">
            <span className="pz-icon">⭐</span>
            <div>
              <h2>Favorite Categories</h2>
              <p>Select topics you enjoy reading.</p>
            </div>
          </div>

          <div className="pz-categories">
            {categoryOptions.map((cat) => (
              <button
                key={cat.name}
                className={`pz-cat-btn ${
                  categories.includes(cat.name.toLowerCase())
                    ? "pz-cat-active"
                    : ""
                }`}
                onClick={() =>
                  toggleCategory(cat.name.toLowerCase())
                }
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <hr className="pz-divider" />

        {/* LANGUAGE */}
        <div className="pz-section">
          <div className="pz-section-title">
            <span className="pz-icon">🌐</span>
            <div>
              <h2>Language</h2>
              <p>Select platform language.</p>
            </div>
          </div>

          <div className="pz-language">
            <button
              className={`pz-lang-btn ${
                language === "en" ? "pz-lang-active" : ""
              }`}
              onClick={() => setLanguage("en")}
            >
              <span className="pz-flag">🇺🇸</span>
              English
            </button>

            <button
              className={`pz-lang-btn ${
                language === "hi" ? "pz-lang-active" : ""
              }`}
              onClick={() => setLanguage("hi")}
            >
              <span className="pz-flag">🇮🇳</span>
              हिन्दी
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          className="pz-save-btn"
          onClick={savePreferences}
        >
          💾 Save Preferences
        </button>

      </div>
    </div>
  );
};

export default Personalization;
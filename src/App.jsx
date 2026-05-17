// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import NewsDetails from "./Pages/NewsDetails";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Personalization from "./Pages/personalization";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personalization" element={<Personalization />} />
        <Route path="/news-details" element={<NewsDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
// App.jsx

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./Pages/Dashboard";
import NewsDetails from "./Pages/NewsDetails";


import Personalization from "./Pages/personalization";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", loginData);

    alert("Login Successful");

    navigate("/signup");
  };

  return (
    <div>
      <h1>Welcome to Geonews 🌏</h1>
      <h2>Login Page</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Signup Data:", signupData);

    alert("Signup Successful");

    navigate("/personalization");
    
  };

  return (
    <div>
      <h1>Welcome to Geonews 🌏</h1>
      <h2>Signup Page</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={signupData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={signupData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={signupData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">Signup</button>
      </form>

      <br />

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

function App() {
  return (
 
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/personalization" element={<Personalization />} />
        <Route path="/news-details" element={<NewsDetails />} />
      </Routes>
    </Router>
  );
}




export default App;
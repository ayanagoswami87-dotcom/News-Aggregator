import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/personalization");

    if (email === "" || password === "") {
      alert("Please fill all fields");
    } else {
      alert("Login Successful");
    }
  };

  return (
    <div>
      <h1>News Aggregator</h1>
      <p>Read Daily News Anytime</p>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <div>
        <a href="#">Forgot Password?</a>

        <br />
        <br />

        <a href="#">Sign Up</a>
      </div>
    </div>
  );
}

export default Login;
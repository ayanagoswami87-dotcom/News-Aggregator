import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

  e.preventDefault();

  try {

    const response = await fetch(
      "http://localhost:5000/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      alert(data.message);

      navigate("/dashboard");

    } else {

      alert(data.message);
    }

  } catch (error) {

    console.log(error);
  }
};

  return (
    <div>
      <h1>Welcome to Geonews 🌏</h1>
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
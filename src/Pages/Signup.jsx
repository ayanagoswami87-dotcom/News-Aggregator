import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Login.css";

function Signup() {

  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [info, setInfo] =
    useState(location.state?.message || "");

  const [error, setError] =
    useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8000/signup",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok && data.success !== false) {

        // Clear any old user data so new user goes to personalization after login
        localStorage.removeItem("userPreferences");
        localStorage.removeItem("user");

        // Redirect to login page with success message
        navigate("/", {
          state: {
            message: "Account created! Please login."
          }
        });

      } else {

        setError(
          data.message ||
          "Signup failed. Please try again."
        );

      }

    }

    catch(error){

      console.log(error);

      setError(
        "Signup failed. Make sure the backend server is running on port 8000."
      );

    }

    setLoading(false);
  };

  return (

    <div className="auth-container">

      {/* LEFT SIDE */}

      <div className="left-section">

        <div className="form-box">

          <div className="globe">
            🌍
          </div>

          <h1>
            GEOSPHERE
          </h1>

          <p>
            Create Account
          </p>

          <div className="subtitle-line">

            <div className="dot"></div>

            <div className="dot"></div>

            <div className="dot"></div>

          </div>


          <form onSubmit={handleSignup}>

            {info && (
              <div className="auth-info">
                {info}
              </div>
            )}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="input-group">

              <label>
                Name
              </label>

              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e)=>
                setName(
                e.target.value
                )}
                required
              />

            </div>


            <div className="input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e)=>
                setEmail(
                e.target.value
                )}
                required
              />

            </div>


            <div className="input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=>
                setPassword(
                e.target.value
                )}
                required
              />

            </div>


            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >

              {loading
                ? "Signing up..."
                : "Sign Up"
              }

            </button>


          </form>


          <div className="bottom-text">

            Already have an account?

            <Link to="/">

              Login

            </Link>

          </div>


        </div>

      </div>


      {/* RIGHT SIDE */}


      <div className="right-section">

        <div className="overlay">

          <div className="overlay-globe">

            🌎

          </div>

          <h2>

            Join

            <br />

            <span>
              Geosphere Today
            </span>

          </h2>

          <div className="overlay-line"></div>

          <p>

            Stay updated with breaking news,
            trending stories and personalized
            recommendations from around
            the world.

          </p>

        </div>

      </div>

    </div>

  );
}

export default Signup;

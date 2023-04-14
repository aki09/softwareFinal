import React, { useState, useEffect } from "react";
import "../../styles/Auth/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import logo from "../../assets/logo2.png";
import Cookies from "js-cookie";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
//
const Login = () => {
  const [error, setError] = useState("");
  const [user, setuser] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let isLoggedIn = !!Cookies.get("auth-token");
    if (isLoggedIn) {
      navigate("/home");
    }
    let isLoggedInAdmin = !!Cookies.get("admin-auth-token");
    if (isLoggedInAdmin) {
      navigate("/pchiahome");
    }
  });

  const handleChange = ({ currentTarget: input }) => {
    setuser({ ...user, [input.name]: input.value });
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.REACT_APP_SERVER + "/login";
      const res = await axios.post(url, user);
      const cookie = res.data.access;
      Cookies.set("auth-token", cookie);
      navigate("/home");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          detectRetina: false,
          fpsLimit: 60,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "bubble",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 40,
                duration: 2,
                opacity: 8,
                size: 10,
                speed: 3,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
              animation: {
                enable: true,
                speed: 40,
                sync: true,
              },
            },
            lineLinked: {
              blink: false,
              color: "white",
              consent: false,
              distance: 30,
              enable: true,
              opacity: 0.3,
              width: 0.5,
            },
            move: {
              attract: {
                enable: false,
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              bounce: false,
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: false,
                area: 2000,
              },
              limit: 0,
              value: 200,
            },
            opacity: {
              animation: {
                enable: true,
                minimumValue: 0.05,
                speed: 2,
                sync: false,
              },
              random: false,
              value: 1,
            },
            shape: {
              type: "circle",
            },
            size: {
              animation: {
                enable: false,
                minimumValue: 0.1,
                speed: 40,
                sync: false,
              },
              random: true,
              value: 1,
            },
          },
        }}
      />
      <div
        style={{
          background: "linear-gradient(#141e30, #243b55)",
          height: "100vh",
        }}
      >
        <a
          href="/"
          className="heading d-flex align-item-center text-light p-5"
          style={{ textDecoration: "none" }}
        >
          <img src={logo} width="50" />
          <h3 className="fly m-2">
            Fly<span className="novate">novate</span>
          </h3>
        </a>
        <div className="login-box">
          <h2>Login</h2>
          {error && (
            <div className="my-4 pb-3">
              <Alert variant="danger">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                name="username"
                required
                onChange={handleChange}
                value={user.username}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
                value={user.password}
                autoComplete="on"
              />
              <label>Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={handleTogglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>

          <div className="mt-5 text-light">
            New here?
            <span className="p-2">
              <a href="/signup" className="signup p-2">
                Sign Up
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

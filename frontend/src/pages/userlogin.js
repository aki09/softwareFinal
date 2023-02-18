import React, { useState } from "react";
import "../styles/Auth/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import logo from "../assets/logo2.png";

const Login = () => {
  const [error, setError] = useState("");
  const [user, setuser] = useState({ username: "", password: "" });
  const [cookieValue, setCookieValue] = useState(null);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setuser({ ...user, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/login";
      const res = await axios.post(url, user);
      const cookie = res.data.access;
      setCookieValue(cookie);
      navigate("/home", {
        state: { user: res.data.user, cookieValue: res.data.access },
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const particlesInit = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
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
      <div className="container fluid">
        <div className="heading d-flex align-item-center text-light p-5">
          <img src={logo} width="50" />
          <h3 className="fly m-2">
            Fly<span className="novate">novate</span>
          </h3>
        </div>
        <div className="login-box">
          <h2>Login</h2>
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
                type="password"
                name="password"
                required
                onChange={handleChange}
                value={user.password}
              />
              <label>Password</label>
            </div>

            <button type="submit">Submit</button>
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

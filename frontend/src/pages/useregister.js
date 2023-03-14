import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import logo from "../assets/logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [user, setuser] = useState({
    username: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setcPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOTPChange = ({ currentTarget: input  }) => {
    const { value } = input;
    setOTP(value);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const url = process.env.REACT_APP_SERVER + "/verifyOTP";
    //   const { success } = await axios.post(url, { otp });
    //   if (success) {
    //     navigate("/login");
    //   } else {
    //     setError("Invalid OTP");
    //   }
    // } catch (error) {
    //   setError("An error occurred while verifying OTP. Please try again later.");
    // }
  };

  const handleChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    let errors = {};

    if (name === "password") {
      if (value.length < 8) {
        errors.password = "Password must contain at least 8 characters";
      }
      if (!/[A-Z]/.test(value)) {
        errors.password = "Password must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(value)) {
        errors.password = "Password must contain at least one lowercase letter";
      }
      if (!/[0-9]/.test(value)) {
        errors.password = "Password must contain at least one digit";
      }
      if (!/[\W_]/.test(value)) {
        errors.password =
          "Password must contain at least one special character";
      }
    }
    if (name === "confirmPassword") {
      if (value !== user.password) {
        setcPasswordError("Passwords do not match");
      } else {
        setcPasswordError(null);
      }
    }

    setuser({ ...user, [name]: value });
    setPasswordError(errors.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || cPasswordError) {
      return;
    }  
    setShowOTP(true);
    // try {
    //   const url = process.env.REACT_APP_SERVER + "/signup";
    //   const { user: res } = await axios.post(url, user);
    //   navigate("/login");
    //   console.log(res.message)
    // } catch (error) {
    //   if (
    //     error.response &&
    //     error.response.status >= 400 &&
    //     error.response.status <= 500
    //   ) {
    //     setError(error.response.data.message);
    //   }
    // }
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
                speed: 20,
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
          polygon: {
            draw: {
              enable: true,
              lineColor: "rgba(255,255,255,0.2)",
              lineWidth: 0.3,
            },
            move: {
              radius: 10,
            },
            inlineArrangement: "equidistant",
            scale: 0.5,
            type: "inline",
          },
        }}
      />
      <div
        style={{
          background: "linear-gradient(#141e30, #243b55)",
          height: "100vh",
        }}
      >
        <div className="heading d-flex align-item-center text-light p-5">
          <img src={logo} width="50" />
          <h3 className="fly m-2">
            Fly<span className="novate">novate</span>
          </h3>
        </div>
        <div className="login-box">
          <h2>Sign Up</h2>
          {showOTP ? (
          <form onSubmit={handleOTPSubmit}>
            <div className="user-box">
              <input
                type="number"
                name="otp"
                required
                onChange={handleOTPChange}
                value={OTP}
              />
              <label>Enter OTP</label>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                name="username"
                required
                minLength={5}
                onChange={handleChange}
                value={user.username}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                type="text"
                name="company"
                required
                onChange={handleChange}
                value={user.company}
              />
              <label>Company Name</label>
            </div>
            <div className="user-box">
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                value={user.email}
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                onChange={handleChange}
                value={user.password}
              />
              <label>Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={handleTogglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && (
                <div className="small text-danger mt-1" role="alert">
                  {passwordError}
                </div>
              )}
            </div>
            <div className="user-box">
              <input
                type="password"
                name="confirmPassword"
                required
                onChange={handleChange}
                value={user.confirmPassword}
              />
              <label>Confirm Password</label>
              {cPasswordError && (
                <div className="small text-danger mt-1">{cPasswordError}</div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        )}
        {error && (
          <div className="small text-danger mt-3" role="alert">
            {error}
          </div>
        )}
          <div className="mt-5 text-light">
            One of us?{" "}
            <span className="p-2">
              <a href="/login" className="signup p-2">
                Login
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import logo from "../../assets/logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const Register = () => {
  const [user, setuser] = useState({
    username: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");

  useEffect(() => {
    let isLoggedIn = !!Cookies.get("auth-token");
    if (isLoggedIn) {
      navigate("/home");
    }
    let isLoggedInAdmin = !!Cookies.get('admin-auth-token');
    if(isLoggedInAdmin){
      navigate("/pchiahome");
    }
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOTPChange = ({ currentTarget: input }) => {
    const { value } = input;
    setOTP(value);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (OTP != "" && OTP.length == 6) {
      setError(null);
      setMessage(null);
      try {
        const url = process.env.REACT_APP_SERVER + "/verifyotp";
        const response = await axios.post(url, { email: user.email, otp: OTP });
        if (response.status === 200) {
          try {
            const signurl = process.env.REACT_APP_SERVER + "/signup";
            const res = await axios.post(signurl, {
              username: user.username,
              company: user.company,
              email: user.email,
              password: user.password,
            });
            if (res.status === 200) {
              setMessage(res.data.message);
              navigate("/login");
            }
          } catch (error) {
            if (
              error.response &&
              error.response.status >= 400 &&
              error.response.status <= 500
            ) {
              setError(error.response.data.error);
            }
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.error);
        }
      }
    } else {
      setError("Please Enter a valid OTP ");
      return;
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.REACT_APP_SERVER + "/resendotp";
      const response = await axios.post(url, { email: user.email });
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      }
    }
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

    setuser({ ...user, [name]: value });
    setPasswordError(errors.password);
  };

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.username === "" || user.username.length < 5) {
      isValid = false;
      setError("Username must be at least 5 characters long.");
    } else {
      setError("");
    }

    if (user.email === "" || !emailRegex.test(user.email)) {
      isValid = false;
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }

    if (
      user.username === "" ||
      user.company === "" ||
      user.email === "" ||
      user.password === "" ||
      user.confirmPassword === ""
    ) {
      isValid = false;
      setError("All fields are required.");
    } else {
      setError("");
    }
    if (user.password !== user.confirmPassword) {
      isValid = false;
      setError("Passwords do not match.");
    } else {
      setError("");
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const url = process.env.REACT_APP_SERVER + "/sendotp";
        const response = await axios.post(url, {
          email: user.email,
          username: user.username,
        });
        setShowOTP(true);
        setMessage(response.data.message);
        setError(null);
      } catch (error) {
        setError(error.response.data.error);
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
          <form>
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
              {passwordError && (
                <div className="small text-danger" role="alert">
                  {passwordError}
                </div>
              )}
            </div>
            <div className={`user-box ${passwordError ? "mt-3" : ""}`}>
              <input
                type="password"
                name="confirmPassword"
                required
                onChange={handleChange}
                value={user.confirmPassword}
              />
              <label>Confirm Password</label>
            </div>

            {showOTP ? (
              <form>
                <div className="user-box">
                  <input
                    type="string"
                    name="otp"
                    onChange={handleOTPChange}
                    value={OTP}
                  />
                  <label>Enter OTP</label>
                </div>
                <button onClick={handleResendOtp} className="submit-btn">
                  Resend OTP
                </button>
                <button onClick={handleOTPSubmit} className="submit-btn">
                  Submit
                </button>
                <br />
                <br />
                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}
              </form>
            ) : (
              <button
                type="submit"
                className="submit-btn"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
            {error && (
              <div className="medium text-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </form>
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

import React, { useState, useEffect } from "react";
import "../../styles/Auth/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import logo from "../../assets/logo3.png";
import Cookies from "js-cookie";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Nav, Container, Navbar } from "react-bootstrap";

const Forgot = () => {
  const [error, setError] = useState("");
  const [userName, setuserName] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingotp,setisSubmittingotp]=useState(false);
  const [isSubmittingpass,setisSubmittingpass]=useState(false);

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
    setuserName(input.value);
  };

  const handleOtpChange = ({ currentTarget: input }) => {
    setOTP(input.value);
  };

  const handlePasswordChange = ({ currentTarget: input }) => {
    setPassword(input.value);
  };

  const handleConfirmPasswordChange = ({ currentTarget: input }) => {
    setConfirmPassword(input.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const url = process.env.REACT_APP_SERVER + "/forgot";
      const res = await axios.post(url, {
        userName: userName,
      });
      if (res.data.message === "OTP sent successfully") {
        setIsSubmitting(false);
        setOtpSent(true);
        setError("");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setIsSubmitting(false);
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      setisSubmittingotp(true);
      const url = process.env.REACT_APP_SERVER + "/reset";
      const res = await axios.post(url, {
        userName: userName,
        otp: otp,
      });
      if (res.data.message === "OTP is verified successfully") {
        setisSubmittingotp(false);
        setError("");
        setShowPassword(true);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setisSubmittingotp(false);
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handlepasschange = async (e) => {
    e.preventDefault();
    if(password===""){
      setError("Please input new Password");
      return;
    }
    let value=password;
    if (!/[A-Z]/.test(value)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(value)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(value)) {
      setError("Password must contain at least one digit");
      return;
    }
    if (!/[\W_]/.test(value)) {
      setError("Password must contain at least one special character");
      return;
    }
    if (value.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }
    if(confirmPassword===""){
      setError("Please confirm new Password");
      return;
    }
    if(password!==confirmPassword){
      setError("Passwords do not match");
      return;
    }
    try {
      setError("")
      setisSubmittingpass(true);
      const url = process.env.REACT_APP_SERVER + "/passchange";
      const res = await axios.post(url, {
        userName: userName,
        password: password,
      });
      if (res.data.message === "Password changed successfully") {
        setisSubmittingpass(false);
        setMessage(res.data.message);
        setError("");
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setisSubmittingpass(false);
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
        <Navbar style={{ backgroundColor: "transparent" }} className="navbar1">
          <Container className="d-flex flex-col">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={logo}
                height="50px"
                className="d-inline-block align-top me-5"
              />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end align-items-center">
              <Nav>
                <Nav.Link href="/" className="nav-links text-white pt-3">
                  HOME PAGE
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {showPassword?(
          <div className="login-box">
          <h2>Reset Password</h2>
          <h5>Please Enter New Password</h5>
          <h6>Password must be of atleast 8 letters and must contain a capital letter, small letter ,digits and special character </h6>
          <br/>
          <form>
            <div className="user-box">
              <input
                type="password"
                required
                onChange={handlePasswordChange}
                value={password}
              />
              <label>Password</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                required
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
              />
              <label>Confirm Password</label>
            </div>
            <button onClick={handlepasschange} className="submit-btn" disabled={isSubmittingpass}>
                  {isSubmittingpass ? "Loading..." : "Submit"}
            </button>
          </form>
        
          {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}
            {error && (
              <div className="my-4 pb-3">
                <Alert variant="danger">{error}</Alert>
              </div>
            )}
          </div>
        ):(
          <div className="login-box">
          <h2>Reset Password</h2>
          <h5>We will send you OTP on your Email</h5>
          <h5>Please Enter your User Name</h5>
          <br/>
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                required
                onChange={handleChange}
                value={userName}
              />
              <label>User Name</label>
            </div>
            {otpSent ? (
              <form>
                <div className="user-box">
                  <input
                    type="number"
                    length="6"
                    name="otp"
                    onChange={handleOtpChange}
                    value={otp}
                  />
                  <label>Enter OTP</label>
                </div>
                <div className="d-flex justify-content-center">
                <button onClick={handleOTPSubmit} className="submit-btn" disabled={isSubmittingotp}>
                  {isSubmittingotp ? "Loading..." : "Submit OTP"}
                </button>
                </div>
                <br />
                <br />
              </form>
            ) : (
              <div className="d-flex justify-content-center">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
              </div>
            )}
            {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}
            {error && (
              <div className="my-4 pb-3">
                <Alert variant="danger">{error}</Alert>
              </div>
            )}
          </form>
        </div>
        )}
      </div>
    </>
  );
};

export default Forgot;

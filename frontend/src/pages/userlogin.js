import React, {useState,useEffect}  from "react";
import "../styles/Auth/Login.css";
import axios from "axios"
import {  useNavigate } from "react-router-dom";

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
      const cookie=res.data.access;
      setCookieValue(cookie);
		  navigate("/home",{state:{user:res.data.user,cookieValue:cookieValue}});
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
  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input type="text" name="username" required onChange={handleChange} value={user.username}/>
          <label>Username</label>
        </div>
        <div className="user-box">
          <input type="password" name="password" required onChange={handleChange} value={user.password}/>
          <label>Password</label>
        </div>

        <button type="submit">Submit</button>
      </form>

      <div className="mt-5 text-light">
        New here?{" "}
        <span className="p-2">
          <a href="/signup" className="signup p-2">Sign Up</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
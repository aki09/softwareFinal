import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setuser] = useState({
		username: "",
		email: "",
		company: "",
		password: "",
        confirmPassword:"",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
		setuser({ ...user, [input.name]: input.value });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3000/signup";
			const { user: res } = await axios.post(url, user);
			navigate("/login");
			console.log(res.message);
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input type="text" name="username" required onChange={handleChange} value={user.username}/>
          <label>Username</label>
        </div>
        <div className="user-box">
          <input type="text" name="company" required onChange={handleChange} value={user.company}/>
          <label>Company Name</label>
        </div>
        <div className="user-box">
          <input type="email" name="email" required onChange={handleChange} value={user.email}/>
          <label>Email</label>
        </div>
        <div className="user-box">
          <input type="password" name="password" required onChange={handleChange} value={user.password}/>
          <label>Password</label>
        </div>
        <div className="user-box">
          <input type="password" name="confirmPassword" required onChange={handleChange} value={user.confirmPassword}/>
          <label>Confirm Password</label>
        </div>

        <button type="submit">Submit</button>
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
  );
};

export default Register;
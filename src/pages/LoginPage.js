import React, { useState } from "react";
import axios from "axios";
import "./login.css";
// import book from "../assets/book.mp4";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaEye, FaEyeSlash } from 'react-icons/fa';
import { showSuccess } from '../utils/notification';

const APP_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const checkPasswordStrength = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("at least 3 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("a lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("a number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("a special character (e.g. !@#$%)");
    }
  
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
  
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }
  
    if (!isLogin) {
      const strengthErrors = checkPasswordStrength(password);
      if (strengthErrors.length > 0) {
        setError("Password must contain " + strengthErrors.join(", ") + ".");
        setSuccess("");
        return;
      }
    }
  
    const payload = isLogin
      ? username
        ? { username, password }
        : { email, password }
      : { username, email, password, confirmPassword };
  
    const url = isLogin
      ? `${APP_URL}/api/auth/login`
      : `${APP_URL}/api/auth/register`;
  
    try {
      const { data } = await axios.post(url, payload);
      setSuccess(isLogin ? "Login successful!" : "User registered successfully!");
      setError("");
      showSuccess(isLogin ? "Login successful!" : "Registration successful!");
      console.log(data);
      
      // Reset form after successful registration
      if (!isLogin) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        setFormKey((prev) => prev + 1);
        setIsLogin(true);
        
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/BookList");
      }
      

    } catch (error) {
      setError(error.response?.data?.message || "Error occurred, please try again");
      setSuccess("");
    }
  };
  

  return (
    <div className="wrapper-login ">
      <div className="container-login ">
        <div className="left-panel-login ">
          <video autoPlay loop muted className="bg-video-login ">
              <source src="https://res.cloudinary.com/dghkbezot/video/upload/v1775626823/book_ss7jut.mp4" type="video/mp4" />
          </video>
          <div className="overlay-content-login ">
            <h1>Join a world where books are <br />just the beginning</h1>
            <p>Book lover. Let’s turn the page!</p>
            <div className="bottom-bar-login ">
              {isLogin ? (
                <>
                  Don't have an account?
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
                      setFormKey((prev) => prev + 1);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
                      setFormKey((prev) => prev + 1);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="right-panel-login ">
        <div className="logo-login">
  <FaBookOpen size={40} color="#2e7d32" />
</div>

<h2 style={{ color: '#66bb6a' }}>
  {isLogin ? "Welcome Back!" : "Create Account"}
</h2>


          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form key={formKey} autoComplete="off" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                required
                autoComplete="off"
                value={formData.username}
                onChange={handleChange}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              required
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {!isLogin && (
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}

           

            <button type="submit" className="login-btn-login ">
              {isLogin ? "Login →" : "Sign Up →"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

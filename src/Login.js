import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleChange } from "./lib/functions";
import "./App.css";

// Define and export the fetchUserData function
export const fetchUserData = async (email) => {
  try {
    const userRes = await axios.get("http://localhost:5252/useremail", {
      params: { email: email }
    });
    const userData = userRes.data;
    
    console.log(userData);
    console.log(userData.name);
    
    // Store user data in local storage
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("username", userData.userName || ""); // Avoid storing undefined
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("profilePicture", userData.profilePicture || "");
    localStorage.setItem("userType",userData.userType )
    localStorage.setItem('userid', userData._id)
  } catch (error) {
    console.error("Fetch user data error:", error.response ? error.response.data : error.message);
  }
};

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user
      const res = await axios.post("http://localhost:5252/login", formData);
      console.log("Response:", res);

      if (res.status === 200) {
        // Fetch user data using email
        await fetchUserData(formData.email);
        
        alert("Login successful");
        navigate("/home");
      } else {
        alert("Login failed: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#e8f5e9" }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title mb-4 text-center">School Login Form</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    style={{ background: "#e8f5e9" }}
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    style={{ background: "#e8f5e9" }}
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                  />
                </div>
                <div className="d-flex text-center container align-items-center row">
                  <button className="btn btn-primary w-100" type="submit">Submit</button>
                  <a href="/forgetPassword">ForgetPassword</a>
                  <a href="/">Register</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

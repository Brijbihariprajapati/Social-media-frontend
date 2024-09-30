import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { handleChange } from "./lib/functions";
import "./App.css";

function RessetPassword() {
  const location = useLocation();
  const { email } = location.state || {}; // Access email from the state
  const [formData, setFormData] = useState({
    email: email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    let errors = {};
    if (!formData.otp) {
      errors.otp = "OTP is required.";
    }
    if (!formData.newPassword) {
      errors.newPassword = "New Password is required.";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5252/reset-password", formData);
      console.log(res);
      
      if (res.status === 200) {
        alert("Password reset successfully.");
        navigate("/login");
      } else {
        alert("Error: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error during password reset:", error.response ? error.response.data : error.message);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ background: "#e8f5e9" }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title mb-4 text-center">Reset Password</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="form-control"
                    placeholder="Enter the OTP"
                    value={formData.otp}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                  />
                  {formErrors.otp && <div className="text-danger">{formErrors.otp}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                  />
                  {formErrors.newPassword && <div className="text-danger">{formErrors.newPassword}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                  />
                  {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary w-100" type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RessetPassword;

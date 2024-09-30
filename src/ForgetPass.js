import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleChange } from "./lib/functions";
import "./App.css";

function ForgetPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid.";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5252/sendotp", formData);
      console.log("Response:", res);

      if (res.status === 200) {
        alert("Password reset instructions sent to your email.");
        navigate("/ressetPassword", { state: { email: formData.email } });
      } else {
        alert("Error: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("An error occurred. Please try again later.");
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
              <h1 className="card-title mb-4 text-center">Forget Password</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange(e, setFormData)}
                    required
                    style={{ background: "#e8f5e9" }}
                  />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
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

export default ForgetPassword;

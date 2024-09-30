import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

function Password() {
  const { id } = useParams(); // Get id from URL params
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5252/changePassword/${id}`, { // Include id in URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
  
      const responseData = await response.json();
      console.log("Response data:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.error || "Network response was not ok");
      }
  
      console.log("Password reset successful:", responseData);
      navigate("/");
    } catch (error) {
      console.error("Error resetting password:", error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center pt-5">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body" style={{ background: "#e8f5e9" }}>
              <h1 className="card-title mb-4 text-center">Reset Password</h1>
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    className="form-control"
                    value={passwordData.confirmNewPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">Reset Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password;

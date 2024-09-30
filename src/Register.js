import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserData } from "./lib/types";
import { handleChange, handleSubmit } from "./lib/functions";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const [formData, setFormData] = useState(UserData);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e, formData);

    if (result.success) {
      alert("Registered Successfully");
      navigate("/login");
    } else {
      setFormErrors(result.errors);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center pt-5">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body" style={{ background: "#e8f5e9" }}>
              <h1 className="card-title mb-4 text-center">
                School Registration Form
              </h1>
              <form onSubmit={onSubmit}>
                <div className="row">
                  {/* Left Side */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.name && (
                        <div className="text-danger">{formErrors.name}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="className" className="form-label">
                        Class
                      </label>
                      <input
                        type="text"
                        id="className"
                        name="className"
                        className="form-control"
                        placeholder="Class"
                        value={formData.className}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.className && (
                        <div className="text-danger">
                          {formErrors.className}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rollNo" className="form-label">
                        Roll No
                      </label>
                      <input
                        type="text"
                        id="rollNo"
                        name="rollNo"
                        className="form-control"
                        placeholder="Roll No"
                        value={formData.rollNo}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.rollNo && (
                        <div className="text-danger">{formErrors.rollNo}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="dateOfBirth" className="form-label">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="form-control"
                        placeholder="Date of birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.dateOfBirth && (
                        <div className="text-danger">
                          {formErrors.dateOfBirth}
                        </div>
                      )}
                    </div>
                    <label htmlFor="joiningDate" className="form-label">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        className="form-control"
                        placeholder="Joining Date"
                        value={formData.joiningDate}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.joiningDate && (
                        <div className="text-danger">
                          {formErrors.joiningDate}
                        </div>
                        
                      )}
                  </div>

                  {/* Right Side */}
                  <div className="col-md-6">
                    <div className="mb-3">
                    
                        <div className="mb-3">
                      <label htmlFor="userType" className="form-label">
                        User Type
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        className="form-control"
                        value={formData.userType || ""}
                        onChange={(e) => handleChange(e, setFormData)}
                      >
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </select>
                      {formErrors.userType && (
                        <div className="text-danger">{formErrors.userType}</div>
                      )}
                    </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.password && (
                        <div className="text-danger">{formErrors.password}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        className="form-control"
                        placeholder="Username"
                        value={formData.userName}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.userName && (
                        <div className="text-danger">{formErrors.userName}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.email && (
                        <div className="text-danger">{formErrors.email}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="profilePicture" className="form-label">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        className="form-control"
                        onChange={(e) => handleChange(e, setFormData)}
                      />
                      {formErrors.profilePicture && (
                        <div className="text-danger">
                          {formErrors.profilePicture}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="container text-center d-flex justify-content-center align-items-center row">
                  <button className="btn btn-primary w-100" type="submit">
                    Submit
                  </button>
                  <br />
                  <a href="/home">Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

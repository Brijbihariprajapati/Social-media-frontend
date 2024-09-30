import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { fetchUserData } from "./Login"; // Imported function

function Update() {
  const {state} = useLocation()
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const email = state.item.email
  console.log('eeeeeeeeeeee', email);
  
    
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5252/user/${email}`);
        const user = await response.json();
        setFormData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    fetch(`http://localhost:5252/updatedata/${id}`, {
      method: "PUT",
      body: formDataToSend,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        fetchUserData(formData.email); 
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center pt-5">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body" style={{ background: "#e8f5e9" }}>
              <h1 className="card-title mb-4 text-center">
                Update User Information
              </h1>
              <form onSubmit={handleUpdate}>
                <div className="row">
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
                        value={formData.name || ""}
                        onChange={handleChange}
                      />
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
                        value={formData.className || ""}
                        onChange={handleChange}
                      />
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
                        value={formData.rollNo || ""}
                        onChange={handleChange}
                      />
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
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="joiningDate" className="form-label">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        className="form-control"
                        value={formData.joiningDate || ""}
                        onChange={handleChange}
                      />
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly', gap:'20px'}}>
                <button className="btn btn-primary w-100" type="submit">
                  Update
                </button>
                <button className="btn btn-primary w-100" onClick={()=>navigate('/home')}>
                  Back To Home
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;

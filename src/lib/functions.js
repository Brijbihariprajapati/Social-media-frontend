import axios from "axios";

export const handleChange = (e, callback) => {
  const { name, value, type } = e.target;
  if (type === "file") {
    callback((formData) => {
      return {
        ...formData,
        [name]: e.target.files[0]
      };
    });
  } else {
    callback((formData) => {
      return {
        ...formData,
        [name]: value
      };
    });
  }
};

export const handleSubmit = async (e, formData) => {
  e.preventDefault();

  // Frontend validation
  let errors = {};

  if (formData.name.length > 25) errors.name = "Name must be 20 characters or less";
  if (formData.className.length > 4) errors.className = "Class must not be more than 4 characters";
  if (formData.rollNo.length > 8) errors.rollNo = "Roll No must be exactly 8 digits";
  const dob = new Date(formData.dateOfBirth);
  const today = new Date();
  if (dob > today.setFullYear(today.getFullYear() - 6)) {
    errors.dateOfBirth = "You must be at least 6 years old";
  }
  if (new Date(formData.joiningDate) < new Date()) errors.joiningDate = "Joining Date cannot be in the past";
  if (!/[0-9@]/.test(formData.userName)) errors.userName = "UserName must contain @ or number";
  if (/[A-Z]/.test(formData.userName)) errors.userName = "UserName should not contain any uppercase letters";
  if (!/[a-z]/.test(formData.email)) errors.email = "Email must contain at least one lowercase letter";
  if (/[A-Z]/.test(formData.email)) errors.email = "Email should not contain any uppercase letters";
  if (!/[A-Z]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
    errors.password = "Password must contain at least one uppercase letter and one special character";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const response = await axios.post("http://localhost:5252/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, errors: { global: response.data.message || "Unknown error" } };
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      // Merge frontend and backend errors
      const backendErrors = error.response.data.errors;
      const combinedErrors = { ...errors, ...backendErrors };
      return { success: false, errors: combinedErrors };
    } else {
      return { success: false, errors: { global: "An unexpected error occurred. Please try again." } };
    }
  }
};

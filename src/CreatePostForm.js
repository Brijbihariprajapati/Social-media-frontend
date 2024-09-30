import React, { useState, useRef } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePostForm = () => {
    const navigate = useNavigate()
    const userid = localStorage.getItem('username')
  const [formData, setFormData] = useState({
    userId: userid,
    title: '',
    description: '',
    image: null
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file); // Log the selected file
    setFormData({ ...formData, image: file });
  };
//   console.log(formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.userId || !formData.title || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.userId);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    // Log FormData content for debugging
    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.post("http://localhost:5252/createpost", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
    //   console.log("image",response.data.image); // Axios parses the response

      setSuccessMessage(response.data.message); // Set success message
      setError(''); // Clear error message
  
      // Reset form fields
      setFormData({
        userId: '',
        title: '',
        description: '',
        image: null
      });
      navigate('/home')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };
  
  

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="form-container p-4 border rounded shadow-sm">
            <h2 className="text-center mb-4">Create a New Post</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUserId">
                {/* <Form.Label>User ID</Form.Label> */}
                <Form.Control
                  type="hidden"
                  placeholder="Enter User ID"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formMedia">
  <Form.Label>Upload Media (Image/Video)</Form.Label>
  <Form.Control
    type="file"
    accept="image/*,video/*" // Accept both image and video files
    name="name"
    onChange={handleFileChange}
    ref={fileInputRef} // Attach ref here
  />
</Form.Group>

               <div style={{display:"flex", alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Submit
              </Button>
              <a href='/home'>Back To HomePage</a></div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePostForm;

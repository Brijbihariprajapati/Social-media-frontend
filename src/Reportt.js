import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const Reportt = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [postid, setPostid] = useState("");
  const [reportid, setReportid] = useState("");
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (state && state.post) {
      const post = state.post; // Adjust this if state.post is an array
      if (post && post._id) {
        setPostid(post._id);
        setReportid(id);
      }
    }
  }, [state, id]);
console.log(postid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { reason, description, postid, reportid, username };

    try {
      const res = await axios.post('http://localhost:5252/report', data);
      if (res.status === 200) {
        alert('Report submitted successfully');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('There was an error submitting the report. Please try again.');
    } finally {
      setLoading(false);
      setReason("");
      setDescription("");
      setPostid(""); // Optional: Reset postid
      setReportid(""); // Optional: Reset reportid
    }
  };

  return (
    <Container className="mt-5">
      <h2>Report Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="reportReason">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as="select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select a reason</option>
            <option value="Spam">Spam</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Harassment">Harassment</option>
            <option value="Other">Other</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="reportDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide additional details (optional)"
          />
        </Form.Group>
        <Button variant="danger" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </Form>
    </Container>
  );
};

export default Reportt;

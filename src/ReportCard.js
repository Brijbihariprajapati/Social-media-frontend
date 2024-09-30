import React, { useState, useEffect } from "react";
import { Card, ListGroup, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReportCard = () => {
  const [reportData, setReportData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  // Fetch report data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5252/reportdata");
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert("Failed to fetch report data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle modal show
  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  // Handle post deletion
  const handleDelete = (postId) => {
    axios.put(`http://localhost:5252/updatestatus/${postId}`, { status: 'deactivate' })
      .then((res) => {
        if (res.status === 200) {
          alert('Status deactivated successfully');
          // Update the local state to reflect the change in the UI
          setReportData((prevData) =>
            prevData.map((report) => ({
              ...report,
              postid: report.postid._id === postId ? { ...report.postid, status: 'deactivate' } : report.postid
            }))
          );
        } else {
          alert('Failed to deactivate status');
        }
      })
      .catch((error) => {
        alert('Failed to update status');
        console.error('Error:', error);
      });
  };

  if (reportData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Row>
        {reportData.map((report) => (
          <Col xs={12} md={6} lg={4} key={report._id} className="mb-4">
            <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Card.Body>
                <Card.Title>{report.reason}</Card.Title>
                <Card.Text>{report.description}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item key={report.postid._id}>
                  {report.postid.image && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5252/public/PostImage/${report.postid.image}`}
                      alt={report.postid.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div>
                    <strong>Title:</strong> {report.postid.title}
                  </div>
                  <div>
                    <strong>Description:</strong> {report.postid.description}
                  </div>
                  <div>
                    <strong>User:</strong> {report.postid.username}
                  </div>
                  <div>
                    <strong>Reported By:</strong> {report.username}
                  </div>
                  <Card.Link style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(report.postid._id)}>Delete</Card.Link>
                </ListGroup.Item>
              </ListGroup>
              <Card.Body className="mt-auto" style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <Card.Link style={{ cursor: "pointer" }} onClick={() => handleShowModal(report)}>View Report</Card.Link>
                <Card.Link style={{ cursor: "pointer", color: "green" }} onClick={() => navigate("/home")}>Back To Home</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying report details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <h4>{selectedReport.reason}</h4>
              <p>{selectedReport.description}</p>
              {selectedReport.postid && (
                <div key={selectedReport.postid._id} style={{ marginBottom: "1rem" }}>
                  {selectedReport.postid.image && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5252/public/PostImage/${selectedReport.postid.image}`}
                      alt={selectedReport.postid.title}
                      style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
                    />
                  )}
                  <h5>{selectedReport.postid.title}</h5>
                  <p>{selectedReport.postid.description}</p>
                  <div>
                    <strong>User:</strong> {selectedReport.postid.username}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportCard;

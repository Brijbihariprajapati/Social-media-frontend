import React, { useEffect, useState } from 'react';
import { Button, Image, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function DataTable() {
    const { id, name } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    

    const fetchUserData = async () => {
        try {
            const res = await fetch(`http://localhost:5252/userid/${id}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const result = await res.json();
            setUser(result);
        } catch (error) {
            setError("Error fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async (name) => {
        if (user) {
                try {
                  const response = await fetch(
                    `http://localhost:5252/userrpost/${name}`
                  );
                  if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                  }
                  const data = await response.json();
            
                  setPosts(data);
                  setError("");
                } catch (error) {
                  console.error("Error fetching posts:", error);
                  setError("Failed to fetch posts");
                } finally {
                  setLoading(false);
                }
            
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    useEffect(() => {
        fetchPosts(name);
        // console.log('daataa',name);
        
    }, [user, name]);

    const handleDelete = async (postId) => {
        try {
            setLoading(true);
            await fetch(`http://localhost:5252/deletePost/${postId}`, { method: 'DELETE' });
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            setError("Failed to delete post");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    console.log('ddddddd', posts);


    return (
        <div className="container mt-4">
            {user && (
                <Card className="text-center">
                    <Card.Header>
                        <Image 
                            src={`http://localhost:5252/public/image/${user.profilePicture || 'default.png'}`} 
                            roundedCircle 
                            width={150} 
                            height={150} 
                            alt={`${user.userName || 'User'}'s profile`} 
                        />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{user.userName || 'User Name'}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{user.email || 'User Email'}</Card.Subtitle>
                        <Card.Text>
                            <strong>Class:</strong> {user.className || 'N/A'}<br />
                            <strong>Roll No:</strong> {user.rollNo || 'N/A'}<br />
                            <strong>Joining Date:</strong> {user.joiningDate || 'N/A'}<br />
                            <strong>Date of Birth:</strong> {user.dateOfBirth || 'N/A'}
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                            <Button 
                                variant="warning" 
                                size="sm" 
                                onClick={() => navigate('/home')} 
                                className="me-2"
                            >
                                Back To HomePage
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => navigate(`/FPassword/${id}`)}
                            >
                                Change Password
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}
            <div className="mt-4">
                <Row xs={1} md={2} lg={3} className="g-4">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Col key={post._id}>
                                <Card className="h-100">
                                    {post.image && (
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:5252/public/PostImage/${post.image}`}
                                            alt={post.title}
                                            style={{ height: "270px", objectFit: "cover" }}
                                        />
                                    )}
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>{post.description}</Card.Text>
                                        <div className="d-grid gap-2 mt-auto">
                                            <Button
                                                variant="info"
                                                className="w-100"
                                                onClick={() => navigate("/postview", { state: { post } })}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="w-100"
                                                onClick={() => handleDelete(post._id)}
                                                disabled={loading}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Card>
                                <Card.Body className="text-center">
                                    <p>No posts available</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );
}

export default DataTable;

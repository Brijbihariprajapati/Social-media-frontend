import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PostCardList = ({ posts, formData, handleDelete, loading }) => {
  const navigate = useNavigate();

  const findUserName = (userId) => {
    const user = formData.find((data) => data.userName === userId);
    return user ? user.name : "Unknown User";


  };
console.log('user',findUserName);

  return (
    <div className="mt-4">
      <h2>All Posts</h2>
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
                  <Card.Text>Posted by: {findUserName(post.userId)}</Card.Text>
                  <div className="d-grid gap-2 mt-auto">
                    <Button
                      variant="info"
                      className="w-100"
                      onClick={() => {
                        navigate("/postview", { state: { post } });
                      }}
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
  );
};

export default PostCardList;

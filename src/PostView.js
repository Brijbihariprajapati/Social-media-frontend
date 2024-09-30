import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Container } from "react-bootstrap";

function PostView() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post; // Access the post object from location state
  const [showMedia, setShowMedia] = useState(false); // State to control media enlargement
  const isVideo = post?.image?.match(/\.(mp4|webm|ogg)$/); // Determine if the file is a video

  const handleMediaClick = () => {
    setShowMedia(true);
  };

  const handleCloseMedia = () => {
    setShowMedia(false);
  };

  const h = localStorage.getItem('homee');

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      {post ? (
        <>
          {/* Media Section */}
          <div
            style={{
              width: "70vw", // 70% of viewport width
              height: "70vh", // 70% of viewport height
              margin: "0 auto",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {isVideo ? (
              <video
                src={`http://localhost:5252/public/PostImage/${post.image}`}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                controls
                onClick={handleMediaClick}
              />
            ) : (
              <img
                src={`http://localhost:5252/public/PostImage/${post.image}`}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={handleMediaClick}
              />
            )}

            {/* Full-size Media Modal */}
            {showMedia && (
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw", // Full viewport width
                  height: "100vh", // Full viewport height
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
                onClick={handleCloseMedia}
              >
                {isVideo ? (
                  <video
                    src={`http://localhost:5252/public/PostImage/${post.image}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    controls
                  />
                ) : (
                  <img
                    src={`http://localhost:5252/public/PostImage/${post.image}`}
                    alt={post.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Details Section */}
          <Card className="mt-3" style={{ width: '70vw', height: '20vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.description}</Card.Text>
              <Button variant="secondary" onClick={() => navigate('/home', { state: { home: h } })}>
                Back
              </Button>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="info" className="text-center">
          Post not found
        </Alert>
      )}
    </Container>
  );
}

export default PostView;

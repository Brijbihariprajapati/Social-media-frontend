import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Container } from "react-bootstrap";

function LikedPost() {
  const { postId } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedia, setShowMedia] = useState(false); 

  const fetchPostData = async () => {
    try {
      const response = await fetch(`http://localhost:5252/userrpostss/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post); 
        setLoading(false);
      } else {
        console.error('Failed to fetch post');
        setLoading(false);
      }
    } catch (error) {
      console.error(`Error fetching post: ${error.message}`);
      setLoading(false);
    }
  };
console.log('pooooost',post);

  useEffect(() => {
    fetchPostData(); 
  }, [postId]);

  const handleMediaClick = () => {
    setShowMedia(true);
  };

  const handleCloseMedia = () => {
    setShowMedia(false);
  };

  const h = localStorage.getItem('homee');
  const isVideo = post?.image?.match(/\.(mp4|webm|ogg)$/); 
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      {post ? (
        <>
          {/* Media Section */}
          <div
            style={{
              width: "70vw", 
              height: "70vh", 
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
                  width: "100vw", 
                  height: "100vh", 
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

export default LikedPost;

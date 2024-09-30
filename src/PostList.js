import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./App.css";

const PostList = () => {
  const navigate = useNavigate();
  const [postdata, setdata] = useState([]);
  const [action, setAction] = useState();

  const folowActios = async () => {
    const val = await fetch("http://localhost:5252/followAction");
    if (!val.ok) {
      throw new Error("network response was not ok");
    }
    const data = await val.json();

    setAction(data);
  };
  console.log("followAction", action);

  useEffect(() => {
    folowActios();
  }, []);

  const followposts = async () => {
    try {
      const userid = localStorage.getItem("userid");
      console.log(userid);

      const response = await axios.get(
        `http://localhost:5252/followedPost/${userid}`
      );
      setdata(response.data);
      console.log("postdta", response.data);
    } catch (error) {
      console.error("Failed to get data", error);
      alert("Failed to get data");
    }
  };

  useEffect(() => {
    followposts();
  }, []);

  const UserID = localStorage.getItem("userid");
  const username = localStorage.getItem("username");

  const fetchCurrentLikeStatus = async (postId, userId) => {
    try {
      const res = await axios.get(`http://localhost:5252/userlike/status`, {
        params: { postid: postId, userid: userId },
      });
      return res.data.userlike;
    } catch (error) {
      console.error(
        `Error fetching like status: ${
          error.response?.data?.message || error.message
        }`
      );
      return 0;
    }
  };

  const likess = async (data) => {
    try {
      const res = await axios.post("http://localhost:5252/userlike", data);

      if (res.status === 200) {
        if (data.userlike === 1) {
          alert("You liked successfully");
        } else {
          alert("You unliked successfully");
        }
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLike = async (postId) => {
    try {
      const currentLikeStatus = await fetchCurrentLikeStatus(postId, UserID);
      const newLikeStatus = currentLikeStatus === "0" ? 1 : 0;

      const updatedPosts = postdata.map((post) =>
        post._id === postId
          ? { ...post, liked: post.liked + (newLikeStatus ? 1 : -1) }
          : post
      );

      setdata(updatedPosts);
      await likess({
        postid: postId,
        userid: UserID,
        username,
        userlike: newLikeStatus,
      });

      followposts();
    } catch (error) {
      console.log({ message: error });
    }
  };

  const follow = async (followId, followUserName) => {
    const data = { followId, UserID, followUserName };

    try {
      const val = await axios.post("http://localhost:5252/follow", data);
      if (val.status === 200) {
        alert("Followed successfully");
      } else {
        alert("Failed to follow");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="post-list-container">
      <div className="mt-1">
        <Row xs={1} md={2} lg={3} className="g-4">
          {postdata.map((post) => (
            <Col key={post._id}>
              <Card className="h-100">
                {post.image && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5252/public/PostImage/${post.image}`}
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="post-header d-flex justify-content-between mb-2">
                    <div className="like-section text-center">
                      <div className="like-count mb-1">{post.liked}</div>
                      <Button
                        variant="outline-primary"
                        className={`like-btn ${
                          post.disliked ? "" : "btn-primary active"
                        }`}
                        onClick={() => handleLike(post._id)}
                      >
                        Like
                      </Button>
                    </div>

                    <div className="post-info">
                      <Card.Title
                        className="post-author"
                        style={{ color: "red" }}
                      >
                        {post.name}
                      </Card.Title>
                      <Card.Title className="post-title">
                        {post.title}
                      </Card.Title>
                      <Card.Text className="post-description">
                        {post.description}
                      </Card.Text>
                    </div>

                    <div className="extra-info">
                      <Card.Title className="post-name">{post.Name}</Card.Title>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "20px",
                      marginBottom: "5px",
                    }}
                  >
                    <Button
                      variant="success"
                      className="follow-btn"
                      onClick={() => follow(post.userid, post.username)}
                      style={{ flex: 1 }}
                    >
                      {action.some(
                        (val) =>
                          val.followId === post.userid &&
                          val.followUserName === post.username
                      )
                        ? "Following"
                        : "Follow"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleBack}
                      style={{ flex: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="d-grid gap-2 mt-auto">
                    <div className="action-buttons d-flex justify-content-between">
                      <Button
                        variant="info"
                        className="view-btn w-50 me-1"
                        onClick={() =>
                          navigate("/postview", {
                            state: { post },
                          })
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        className="report-btn w-50 ms-1"
                        onClick={() =>
                          navigate("/report/" + UserID, {
                            state: { post },
                          })
                        }
                      >
                        Report
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PostList;

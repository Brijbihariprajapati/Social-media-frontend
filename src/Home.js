import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Image,
  Alert,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import ModalComponent from "./ModelComponent";
import { IoMdNotifications } from "react-icons/io";
import MessageList from "./MessageList";
import AllNotificationList from "./AllNotificationList";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

function Home() {
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 3
  // };

  const location = useLocation();
  const [userData, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log("allposts", allPosts);

  const username = localStorage.getItem("username");
  const profilePicture = localStorage.getItem("profilePicture");
  const userEmail = localStorage.getItem("userEmail");
  const userType = localStorage.getItem("userType");
  const Name = localStorage.getItem("userName");
  const UserID = localStorage.getItem("userid");
  console.log(username);

  const [view, setView] = useState(userType === "Admin" ? "home" : "userPosts");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const totalPages = Math.ceil(allPosts.length / itemsPerPage);
  const totalPostPages = Math.ceil(posts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allPosts.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemss = posts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (!username) {
      navigate("/login");
    } else {
      fetchUserData();
      fetchPosts(username);
      fetchAllPosts(username);
    }
  }, [username, navigate, userType]);
  useEffect(() => {
    const activeTab = localStorage.getItem("activeTab");
    if (activeTab) {
      setView(activeTab);
    } else {
      setView(userType === "Admin" ? "home" : "userPosts");
    }
  }, [userType]);

  const fetchUserData = async () => {
    setLoading(true);
    // console.log("useeeeeee", userEmail);

    try {
      let url = "http://localhost:5252/user";

      if (userType !== "Admin") {
        url = `http://localhost:5252/user/${userEmail}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();

      setData(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5252/userrpost/${username}`
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
  };

  const fetchAllPosts = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5252/userrposts/${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch all posts");
      }

      const data = await response.json();

      // Assuming the data is an array of posts
      setAllPosts(data);
      setError("");
    } catch (error) {
      console.error("Error fetching all posts:", error);
      setError("Failed to fetch all posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      let response;
      if (userType === "Admin") {
        response = await fetch(`http://localhost:5252/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        fetchUserData();
      } else if (userType === "User") {
        response = await fetch(`http://localhost:5252/postdelete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        fetchPosts();
      }

      if (!response.ok) {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setError("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    localStorage.removeItem("activeTab");
    alert("You have been logged out.");
    navigate("/login");
  };

  // ...................Likesssss................

  const [like, setLikes] = useState({
    postid: "",
    userid: "",
    username: "",
    userlike: "0", // Default to not liked
  });

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

      if (res.status === 200 && data.userlike === 1) {
        const { postuserid, postid, userid } = data;

        console.log("ToUserId,PostId,UserId", postuserid, postid, userid);

        const Status = 0;
        const Type = "Like";
        const Notification = `${Name} Liked Your Post`;
        const allval = {
          postuserid,
          postid,
          userid,
          Status,
          Type,
          Notification,
        };
        const notifica = await axios.post(
          "http://localhost:5252/notification",
          allval
        );
        if (notifica) {
          console.log("notification send successfull");
        }
      }
      if (like.userlike === 0) {
        // alert("You unlike successfully");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLike = async (postId, userid) => {
    // console.log("post", postId);
    console.log("User", UserID);

    try {
      const currentLikeStatus = await fetchCurrentLikeStatus(postId, UserID);
      // console.log('likeeeeee',currentLikeStatus);

      const newLikeStatus = currentLikeStatus === "0" ? 1 : 0;
      console.log(newLikeStatus);

      setLikes({
        postid: postId,
        userid: UserID,
        username: username,
        userlike: newLikeStatus,
      });

      likess({
        postuserid: userid,
        postid: postId,
        userid: UserID,
        username: username,
        userlike: newLikeStatus,
      });
      fetchAllPosts(username);
    } catch (error) {
      console.log({ message: error });
    }
  };

  useEffect(() => {}, []);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<message>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [postid, setSelectedPostId] = useState(null);
  const [message, setMessage] = useState("");
  const [getmessage, setgetmessage] = useState([]);

  const Gmessage = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5252/findmessage/${postId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setgetmessage(data);
    } catch (error) {
      console.log("Failed to find the message", error);
    }
  };
  console.log("Message:", getmessage);
  const handleShowMessagePopup = async (postId) => {
    setSelectedPostId(postId);
    setShowMessagePopup(true);
    Gmessage(postId);
  };

  const handleCloseMessagePopup = () => setShowMessagePopup(false);

  const handleSendMessage = async () => {
    const mess = { message, postid, UserID };
    console.log("Message sent:", mess);

    const data = await axios.post("http://localhost:5252/message", { mess });

    console.log("Message sent:", data);

    setMessage("");
  };
  useEffect(() => {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [getmessage]);

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Foloow>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const follow = async (followId, followUserName, postid) => {
    const data = { followId, UserID, followUserName, username };

    console.log("folow", data);

    const val = await axios.post("http://localhost:5252/follow", data);

    if (val) {
      const Status = 0;
      const Type = "Follow";
      const Notification = `${Name} Follow You`;
      const allval = {
        postuserid: followId,
        postid,
        userid: UserID,
        username,
        Status,
        Type,
        Notification,
      };
      const notifica = await axios.post(
        "http://localhost:5252/notification",
        allval
      );
      if (notifica) {
        console.log("notification send successfull");
      }
    } else {
      // alert("failed to follow");
    }
    folowActios();
  };

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

  // const handleClick = async (userId) => {
  //   try {
  //     const res = await axios.put(`http://localhost:5252/notificationStatus/${userId}`);

  //     if (res.status === 200) {
  //       console.log('Notification status updated successfully');
  //       navigate('/MessageList');
  //     } else {
  //       console.error('Failed to update notification status');
  //     }
  //   } catch (error) {
  //     console.error(`Error updating notification status: ${error.message}`);
  //   }
  // };

  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = async (UserID) => {
    // console.log('count', UserID);

    try {
      const response = await fetch(
        `http://localhost:5252/getnotification/${UserID}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.statusZeroCount);

        console.log("count", data);
      } else {
        console.error("Failed to fetch notification count");
      }
    } catch (error) {
      console.error(`Error fetching notification count: ${error.message}`);
    }
  };

  useEffect(() => {
    if (UserID) {
      fetchNotificationCount(UserID);
    }
  }, [UserID]);

  // console.log('count',notificationCount);

  return (
    <div className="home-container">
      <header className="home-header d-flex justify-content-between align-items-center p-3">
        <div className="profile-section d-flex align-items-center">
          {profilePicture && (
            <div className="profile-info">
              {username && (
                <Image
                  src={`http://localhost:5252/public/image/${profilePicture}`}
                  roundedCircle
                  width={100}
                  height={100}
                />
              )}
              {username && <span className="profile-username">{Name}</span>}
            </div>
          )}
        </div>

        <div className="school-name-section text-center flex-grow-1">
          <h1>Welcome to XYZ School Admissions</h1>
          <p>Enroll in a bright future with XYZ School.</p>
        </div>

        <div className="header-buttons d-flex align-items-center">
          {userType === "User" && (
            <>
              <div className="notification-container">
                <IoMdNotifications
                  size={47}
                  color="red"
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  onClick={() => setView("notification")}
                />
                {notificationCount > 0 && (
                  <div className="notification-badge">{notificationCount}</div>
                )}
              </div>

              <Button
                variant="primary"
                onClick={() => navigate("/createpost")}
                className="me-3"
              >
                Create Post
              </Button>
            </>
          )}
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <section className="admission-info">
        <div className="container mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {error && <Alert variant="danger">{error}</Alert>}

              {userType === "Admin" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      style={{
                        width: "80px", // Set fixed width
                        height: "40px",
                        backgroundColor:
                          view === "home" ? "#e45cfd" : "#063970", // Active color for 'Home' view
                        borderColor: view === "home" ? "white" : "white",
                      }}
                      onClick={() => {
                        localStorage.setItem("activeTab", "home");
                        setView("home");
                      }}
                      // onClick={() => setView("home")}
                      className="me-3"
                    >
                      Home
                    </Button>
                    <Button
                      style={{
                        width: "80px", // Set fixed width
                        height: "40px",
                        marginTop: "5px",
                        backgroundColor:
                          view === "posts" ? "#e45cfd" : "#063970",
                        borderColor: view === "posts" ? "white" : "white",
                      }}
                      onClick={() => {
                        localStorage.setItem("activeTab", "posts");
                        setView("posts");
                      }}
                      // onClick={() => setView("posts")}
                      className="me-3"
                    >
                      Posts
                    </Button>
                    <Button
                      style={{
                        marginTop: "5px",
                        width: "80px", // Set fixed width
                        height: "40px", // Set fixed height
                      }}
                      onClick={() => navigate("/reportcard")}
                      variant="success"
                      className="me-3"
                    >
                      Reports
                    </Button>
                  </div>

                  {view === "home" && (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Class</th>
                          <th>Roll No</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.length > 0 ? (
                          userData.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.className}</td>
                              <td>{item.rollNo}</td>
                              <td>
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/view/${item._id}/${item.userName}`
                                    )
                                  }
                                  className="me-2"
                                >
                                  View
                                </Button>

                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/update/${item._id}`, {
                                      state: { item: item },
                                    })
                                  }
                                  className="me-2"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(item._id)}
                                  disabled={loading}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No user data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}

                  {view === "posts" && allPosts.length > 0 && (
                    <div className="mt-1">
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {currentItems.map((post) => (
                          <Col key={post._id}>
                            <Card className="h-100">
                              {post.image && (
                                <Card.Img
                                  variant="top"
                                  src={`http://localhost:5252/public/PostImage/${post.image}`}
                                  alt={post.title}
                                  style={{
                                    height: "270px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <Card.Body className="d-flex flex-column">
                                <Card.Title style={{ color: "red" }}>
                                  {post.name}
                                </Card.Title>

                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.description}</Card.Text>
                                <div className="d-grid gap-2 mt-auto">
                                  <Button
                                    variant="info"
                                    className="w-100"
                                    onClick={() =>
                                      navigate("/postview", { state: { post } })
                                    }
                                  >
                                    View
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      <div className="d-flex justify-content-center mt-4">
                        <Button
                          variant="secondary"
                          disabled={currentPage === 1}
                          onClick={() => paginate(currentPage - 1)}
                        >
                          Previous
                        </Button>

                        {[...Array(totalPages)].map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              index + 1 === currentPage
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() => paginate(index + 1)}
                            className="mx-1"
                          >
                            {index + 1}
                          </Button>
                        ))}

                        <Button
                          variant="secondary"
                          disabled={currentPage === totalPages}
                          onClick={() => paginate(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {userType === "User" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      style={{
                        height: "40px",
                        backgroundColor:
                          view === "userPosts" ? "#e45cfd" : "#063970", // Active color for 'User Posts' view
                        borderColor: view === "userPosts" ? "white" : "white",
                      }}
                      onClick={() => {
                        localStorage.setItem("activeTab", "userPosts");
                        setView("userPosts");
                      }}
                      // onClick={() => setView("userPosts")}
                      className="me-3"
                    >
                      MyPost
                    </Button>
                    <Button
                      style={{
                        height: "40px",
                        marginTop: "5px",
                        backgroundColor:
                          view === "allPosts" ? "#e45cfd" : "#063970", // Active color for 'All Posts' view
                        borderColor: view === "allPosts" ? "white" : "white",
                      }}
                      onClick={() => {
                        localStorage.setItem("activeTab", "allPosts");
                        setView("allPosts");
                      }}
                      // onClick={() => setView("allPosts")}
                      className="me-3"
                    >
                      AllPosts
                    </Button>
                    <Button
                      style={{
                        height: "40px",
                        marginTop: "5px",
                        backgroundColor:
                          view === "allPosts" ? "#e45cfd" : "#063970", // Active color for 'All Posts' view
                        borderColor: view === "allPosts" ? "white" : "white",
                      }}
                      onClick={() => {
                        navigate("/postList");
                      }}
                      // onClick={() => setView("allPosts")}
                      className="me-3"
                    >
                      Follow_
                    </Button>
                    <Button
                      style={{
                        height: "40px",
                        marginTop: "5px",
                        backgroundColor:
                          view === "allPosts" ? "#e45cfd" : "#063970", // Active color for 'All Posts' view
                        borderColor: view === "allPosts" ? "white" : "white",
                      }}
                      onClick={() => setView("AllNotification")}
                      className="me-3"
                    >
                      Notification
                    </Button>
                  </div>

                  {view === "userPosts" && posts.length > 0 && (
                    <div className="mt-1">
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {/* <Slider {...settings}> */}

                        {currentItemss.map((post) => (
                          <Col key={post._id}>
                            <Card className="h-100">
                              {/* Conditionally render image or video */}
                              {post.image &&
                                (post.image.match(/\.(mp4|webm)$/) ? (
                                  <video
                                    controls
                                    autoPlay
                                    muted
                                    style={{
                                      height: "270px",
                                      objectFit: "contain",
                                      width: "100%",
                                    }}
                                  >
                                    <source
                                      src={`http://localhost:5252/public/Postimage/${post.image}`}
                                      type={`video/${post.image
                                        .split(".")
                                        .pop()}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <Card.Img
                                    variant="top"
                                    src={`http://localhost:5252/public/Postimage/${post.image}`}
                                    alt={post.title}
                                    style={{
                                      height: "270px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                              <Card.Body className="d-flex flex-column">
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.description}</Card.Text>
                                <div className="d-grid gap-2 mt-auto">
                                  <Button
                                    variant="info"
                                    className="w-100"
                                    onClick={() =>
                                      navigate("/postview", { state: { post } })
                                    }
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
                                  <Button
                                    variant="secondary"
                                    className="w-100"
                                    onClick={() =>
                                      handleShowMessagePopup(post._id)
                                    }
                                  >
                                    Message
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                        {/* </Slider> */}
                      </Row>
                      <div className="d-flex justify-content-center mt-4">
                        <Button
                          variant="secondary"
                          disabled={currentPage === 1}
                          onClick={() => paginate(currentPage - 1)}
                        >
                          Previous
                        </Button>

                        {[...Array(totalPostPages)].map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              index + 1 === currentPage
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() => paginate(index + 1)}
                            className="mx-1"
                          >
                            {index + 1}
                          </Button>
                        ))}

                        <Button
                          variant="secondary"
                          disabled={currentPage === totalPostPages}
                          onClick={() => paginate(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>

                      <ModalComponent
                        show={showMessagePopup}
                        handleClose={handleCloseMessagePopup}
                        title="Send a Message"
                        footer={null}
                      >
                        <Form>
                          <div
                            style={{ height: "400px", position: "relative" }}
                          >
                            {/* Container for displaying messages */}
                            <div
                              id="messageContainer"
                              style={{
                                height: "calc(100% - 50px)",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {getmessage.map((msg, index) => {
                                const isCurrentUser =
                                  msg.UserID._id ===
                                  localStorage.getItem("userid");

                                return (
                                  <div
                                    key={index}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "10px",
                                      justifyContent: isCurrentUser
                                        ? "flex-end"
                                        : "flex-start",
                                      minHeight: "30px",
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {!isCurrentUser &&
                                      msg.UserID.profilePicture && (
                                        <img
                                          src={`http://localhost:5252/public/image/${msg.UserID.profilePicture}`}
                                          alt={msg.UserID.name}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            marginRight: "10px",
                                          }}
                                        />
                                      )}
                                    <div
                                      style={{
                                        backgroundColor: isCurrentUser
                                          ? "#dcf8c6"
                                          : "#ffffff",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        maxWidth: "60%",
                                        textAlign: isCurrentUser
                                          ? "right"
                                          : "left",
                                      }}
                                    >
                                      <strong>{msg.UserID.name}</strong>
                                      <p>{msg.message}</p>
                                    </div>
                                    {isCurrentUser &&
                                      msg.UserID.profilePicture && (
                                        <img
                                          src={`http://localhost:5252/public/image/${msg.UserID.profilePicture}`}
                                          alt={msg.UserID.name}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            marginLeft: "10px",
                                          }}
                                        />
                                      )}
                                  </div>
                                );
                              })}
                            </div>

                            <Form.Group
                              controlId="messageTextArea"
                              style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                padding: "10px",
                              }}
                            >
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Type your message..."
                                />
                                <Button
                                  variant="primary"
                                  onClick={handleSendMessage}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  Send
                                </Button>
                              </InputGroup>
                            </Form.Group>
                          </div>
                        </Form>
                      </ModalComponent>
                    </div>
                  )}
                  {/* >>>>>>>>>>>>>>>>>>>>>>>All Post<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                  {view === "allPosts" && allPosts.length > 0 && (
                    <div className="mt-1">
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {/* <Slider {...settings}> */}

                        {currentItems.map((post) => (
                          <Col key={post._id}>
                            <Card className="h-100">
                              {post.image &&
                                (post.image.match(/\.(mp4|webm)$/) ? (
                                  <video
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    style={{
                                      height: "270px",
                                      objectFit: "contain",
                                      width: "100%",
                                    }}
                                  >
                                    <source
                                      src={`http://localhost:5252/public/Postimage/${post.image}`}
                                      type={`video/${post.image
                                        .split(".")
                                        .pop()}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <Card.Img
                                    variant="top"
                                    src={`http://localhost:5252/public/Postimage/${post.image}`}
                                    alt={post.title}
                                    style={{
                                      height: "270px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                              <Card.Body className="d-flex flex-column">
                                <div className="d-flex align-items-center mb-2">
                                  <div className="me-2 text-center">
                                    <div
                                      className="mb-1"
                                      style={{
                                        fontSize: "1.2rem",
                                        color: "gray",
                                      }}
                                    >
                                      {post.liked}
                                      {post.userId}
                                    </div>
                                    <Button
                                      variant="outline-primary"
                                      className={`mb-2 ${
                                        post.disliked
                                          ? ""
                                          : "btn-primary active"
                                      }`}
                                      style={{ width: "auto" }}
                                      onClick={() =>
                                        handleLike(post._id, post.userid)
                                      }
                                    >
                                      Like
                                    </Button>
                                  </div>
                                  <div className="flex-grow-1">
                                    <Card.Subtitle className="mb-1 text-muted"></Card.Subtitle>
                                    <Card.Title style={{ color: "red" }}>
                                      {post.name}
                                    </Card.Title>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text>{post.description}</Card.Text>
                                  </div>

                                  <Button
                                    variant="success"
                                    // className="follow-btn"
                                    onClick={() =>
                                      follow(
                                        post.userid,
                                        post.username,
                                        post._id
                                      )
                                    }
                                    style={{ marginTop: "30px" }}
                                  >
                                    {action.some(
                                      (val) =>
                                        val.UserID === UserID &&
                                        val.followUserName === post.username
                                    )
                                      ? "Following"
                                      : "Follow"}
                                  </Button>
                                </div>
                                <div className="d-grid gap-2 mt-auto">
                                  <div className="d-flex justify-content-between">
                                    <Button
                                      variant="info"
                                      className="w-50 me-1"
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
                                      className="w-50 ms-1"
                                      onClick={() =>
                                        navigate("/report/" + UserID, {
                                          state: { post },
                                        })
                                      }
                                    >
                                      Report
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      className="w-50 ms-1"
                                      onClick={() =>
                                        handleShowMessagePopup(post._id)
                                      }
                                    >
                                      Message
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                        {/* </Slider> */}
                      </Row>
                      <div className="d-flex justify-content-center mt-4">
                        <Button
                          variant="secondary"
                          disabled={currentPage === 1}
                          onClick={() => paginate(currentPage - 1)}
                        >
                          Previous
                        </Button>

                        {[...Array(totalPages)].map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              index + 1 === currentPage
                                ? "primary"
                                : "outline-primary"
                            }
                            onClick={() => paginate(index + 1)}
                            className="mx-1"
                          >
                            {index + 1}
                          </Button>
                        ))}

                        <Button
                          variant="secondary"
                          disabled={currentPage === totalPages}
                          onClick={() => paginate(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>

                      <ModalComponent
                        show={showMessagePopup}
                        handleClose={handleCloseMessagePopup}
                        title="Send a Message"
                        footer={null}
                      >
                        <Form>
                          <div
                            style={{ height: "400px", position: "relative" }}
                          >
                            {/* Container for displaying messages */}
                            <div
                              id="messageContainer"
                              style={{
                                height: "calc(100% - 50px)",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* Message elements will be added here */}
                              {getmessage.map((msg, index) => {
                                const isCurrentUser =
                                  msg.UserID._id ===
                                  localStorage.getItem("userid");

                                return (
                                  <div
                                    key={index}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "10px",
                                      justifyContent: isCurrentUser
                                        ? "flex-end"
                                        : "flex-start",
                                      minHeight: "30px",
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {!isCurrentUser &&
                                      msg.UserID.profilePicture && (
                                        <img
                                          src={`http://localhost:5252/public/image/${msg.UserID.profilePicture}`}
                                          alt={msg.UserID.name}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            marginRight: "10px",
                                          }}
                                        />
                                      )}
                                    <div
                                      style={{
                                        backgroundColor: isCurrentUser
                                          ? "#dcf8c6"
                                          : "#ffffff",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        maxWidth: "60%",
                                        textAlign: isCurrentUser
                                          ? "right"
                                          : "left",
                                      }}
                                    >
                                      <strong>{msg.UserID.name}</strong>
                                      <p>{msg.message}</p>
                                    </div>
                                    {isCurrentUser &&
                                      msg.UserID.profilePicture && (
                                        <img
                                          src={`http://localhost:5252/public/image/${msg.UserID.profilePicture}`}
                                          alt={msg.UserID.name}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            marginLeft: "10px",
                                          }}
                                        />
                                      )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Input field and send button */}
                            <Form.Group
                              controlId="messageTextArea"
                              style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                padding: "10px",
                              }}
                            >
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Type your message..."
                                />
                                <Button
                                  variant="primary"
                                  onClick={handleSendMessage}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  Send
                                </Button>
                              </InputGroup>
                            </Form.Group>
                          </div>
                        </Form>
                      </ModalComponent>
                    </div>
                  )}

                  {view === "notification" && (
                    <div style={{ width: "200vh" }}>
                      <MessageList />
                    </div>
                  )}
                  {view === "AllNotification" && (
                    <div style={{ width: "200vh" }}>
                      <AllNotificationList />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

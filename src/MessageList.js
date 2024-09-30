import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MessageList = () => {
  const [messages, setMessages] = useState([]); 
  const UserId = localStorage.getItem('userid');
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5252/getnotification/${UserId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.finds); 
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error(`Error fetching messages: ${error.message}`);
    }
  };
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserId]);
  

  const handleNotificationClick = (postId, username, Type) => {
    if (Type === 'Follow') {
      navigate(`/view/${postId}/${username}`);
    } else {
      navigate(`/likedpost/${postId}`);
    }
  };

  const handleLinkClick = async (e, postId, username, Type) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5252/notificationStatus/${UserId}/${postId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        console.log('Notification status updated successfully');
        handleNotificationClick(postId, username, Type);
      } else {
        console.error('Failed to update notification status');
      }
    } catch (error) {
      console.error(`Error updating notification status: ${error.message}`);
    }
  };

  return (
    <div className="message-list">
      <h3>Notifications</h3>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg._id} className="message-item">
            {msg.Status === 0 && (
              <p>
                <strong>Notification:</strong>
                <button
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleLinkClick(e, msg.postid, msg.username, msg.Type)}
                >
                  {msg.Notification}
                </button>
              </p>
            )}
            {/* Add more details if needed */}
          </div>
        ))
      ) : (
        <p>No notifications to display.</p>
      )}
    </div>
  );
};

export default MessageList;

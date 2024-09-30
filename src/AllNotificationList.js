import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllNotificationList = () => {
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
  }, [UserId]); 

  const handleNotificationClick = (postId,username,Type) => {
   {Type==='Follow'? navigate(`/view/${postId}/${username}`): navigate(`/likedpost/${postId}`);}
  };
console.log('notification',messages);

  return (
    <div className="message-list">
      <h3>Notifications</h3>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg._id} className="message-item">
            <p >
              <strong>Notification:</strong>{' '}
              <a
                style={{ textDecoration: 'none', color:'inherit' }}
                href="#"
                onClick={async(e) => {
                  
                    try {
                      const response = await fetch(`http://localhost:5252/notificationStatus/${UserId}/${msg.postid}`, {
                        method: 'PUT',
                      });
          
                      if (response.ok) {
                        console.log('Notification status updated successfully');
                         
                  e.preventDefault(); 
                  {msg.Type==="Follow"? handleNotificationClick(msg.userid,msg.username,msg.Type): handleNotificationClick(msg.postid,msg.Type);}

                } else {
                        console.error('Failed to update notification status');
                      }
                    } catch (error) {
                      console.error(`Error updating notification status: ${error.message}`);
                    }
                 
                  
                }}
              >
                { msg.Notification}
              </a>
            </p>
            {/* Add more details if needed */}
          </div>
        ))
      ) : (
        <p>No notifications to display.</p>
      )}
    </div>
  );
};

export default AllNotificationList;

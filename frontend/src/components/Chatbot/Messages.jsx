import React from 'react';
import "./Chatbot.css";

const Messages = ({ messages }) => {
  const displayMessage = (message, index) => {
    if (message.speak === "user") {
      return (
        <div key={index} className='message-user'>
          <p className='messages-user-text'>{message.text}</p>
        </div>
      );
    } else if (message.speak === "bot") {
      return (
        <div key={index} className='message-df'>
          <p className='messages-df-text'>{message.text}</p>
        </div>
      );
    }
  };

  return (
    <div className='messages'>
      {messages && messages.length
        ? messages.map((message, index) => displayMessage(message, index))
        : <p>No messages yet. Start the conversation!</p>}
    </div>
  );
};

export default Messages;

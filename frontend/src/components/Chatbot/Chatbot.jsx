import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { useDispatch, useSelector } from 'react-redux';
import * as chatbotActions from "../../store/actions/chatbotAction";
import { createNote, fetchNotes, fetchNotesByTitleAndDelete } from "../../store/actions/notesAction.js";
import Messages from './Messages.jsx';
import RichContent from './RichContent.jsx'; // moved to a separate file
import { textQueryAction } from "../../store/actions/chatbotAction";


const Chatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chatbot.messages);
  const messagesEndRef = useRef(null);
  const startedRef = useRef(false);

  const toggleChatbot = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (!startedRef.current && messages.length === 0) {
      startedRef.current = true;
      dispatch(textQueryAction({ text: "Hi", system: true })); // You can handle "start" in Dialogflow
    }
  }, [dispatch, messages.length]);

  const handleUserQuery = async () => {
    if (!query.trim()) {
      alert("Please enter a valid query.");
      return;
    }
    const data = { text: query.trim() };
    try {
      await dispatch(chatbotActions.textQueryAction(data));
    } catch (error) {
      console.error("Error dispatching chatbot query:", error);
    }
    setQuery('');
  };

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserQuery();
    }
  };

  return (
    <div>
      <button className="circle-button" onClick={toggleChatbot}>
        <span className="button-icon">{isVisible ? '❌' : '💬'}</span>
      </button>
      <div className={`chatbot ${isVisible ? 'visible' : ''}`}>
        <div className="chatbot-header">
          <h3>Chatbot</h3>
          <button className="close-button" onClick={toggleChatbot}>✖</button>
        </div>

        <div className="chatbot-body" ref={messagesEndRef}>
          <div className="messages-scroll">
            <Messages key="messages" messages={messages} />
          </div>
          {messages.length > 0 && messages[messages.length - 1].richContent && (
            <div className="message-df rich-wrapper">
              <div className="messages-rich">
                <RichContent richContent={messages[messages.length - 1].richContent} />
              </div>
            </div>
          )}
        </div>
        <div className="chatbot-footer">
          <input
            className='chatbot-footer-input'
            type='text'
            value={query}
            placeholder='Type a message...'
            onKeyPress={handleKeyPress}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="chatbot-send-button" onClick={handleUserQuery}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
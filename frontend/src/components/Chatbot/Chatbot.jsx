// import React, { useState, useEffect } from 'react';
// import './Chatbot.css';
// import { useDispatch, useSelector } from 'react-redux';
// import * as chatbotActions from "../../store/actions/chatbotAction";
// import Messages from './Messages.jsx';
// import { createNote, getNotes } from '../../api/notes.js';

// const Chatbot = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [query, setQuery] = useState('');
//   const dispatch = useDispatch();

//   // Retrieve messages from Redux store
//   const messages = useSelector(state => state.chatbot.messages);

//   const toggleChatbot = () => setIsVisible(!isVisible);

//   const handleUserQuery = async () => {
//     if (!query.trim()) {
//       alert("Please enter a valid query.");
//       return;
//     }
//     const data = { text: query.trim() };
//     try {
//       await dispatch(chatbotActions.textQueryAction(data));
//     } catch (error) {
//       console.error("Error dispatching chatbot query:", error);
//     }
//     setQuery('');
//   };

//   // Function to handle intents and make API call if necessary
//   const handleIntent = (intent, parameters) => {
//     console.log("Detected intent:", intent);  // Log the intent
//     console.log("Parameters:", parameters);  // Log the parameters
//     if (intent === "createNote" && Object.keys(parameters).length > 0) {
      
//       const { Content, Title } = parameters;
//       console.log(Content)
//       console.log(Title)
//       if (Title && Content) {
//         createNote(Title, Content).then(() => {
//           // After creating the note, refresh the page
//           window.location.reload();
//         });  // Make API call to create note
//       }
//        else {
//         alert("Missing Title or Content for the note.");
//       }
//     }
//   };

//   // Function to handle bot responses and detect intents
//   const handleBotResponse = ({ intentName, parameters }) => {
//     console.log("handleBotResponse called with:", { intentName, parameters });
//     if (intentName) {
//       handleIntent(intentName, parameters || {});
//     } else {
//       console.log("No intentName in response:", { intentName, parameters });
//     }
//   };

//   // Assuming you get the response after dispatching text query action
//   useEffect(() => {
//     if (messages.length > 0) {
//       const latestMessage = messages[messages.length - 1];
      
//       // Check if the message is from the bot and contains intentName
//       if (latestMessage.speak === "bot" && latestMessage.intentName) {
//         handleBotResponse({
//           intentName: latestMessage.intentName,
//           parameters: latestMessage.parameters,
//         })
        
//       }
//     }
//   }, [messages]);

//   return (
//     <div>
//       <button className="circle-button" onClick={toggleChatbot}>
//         <span className="button-icon">{isVisible ? '❌' : '💬'}</span>
//       </button>

//       <div className={`chatbot ${isVisible ? 'visible' : ''}`}>
//         <div className="chatbot-header">
//           <h3>Chatbot</h3>
//           <button className="close-button" onClick={toggleChatbot} dangerouslySetInnerHTML={{ __html: '&#10060;' }} />
//         </div>
//         <div className="chatbot-body">
//           <Messages key="messages" messages={messages} />
//         </div>
//         <div className="chatbot-footer">
//           <input
//             className='chatbot-footer-input'
//             type='text'
//             value={query}
//             placeholder='Type a message...'
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           <button className="chatbot-send-button" onClick={handleUserQuery}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { useDispatch, useSelector } from 'react-redux';
import * as chatbotActions from "../../store/actions/chatbotAction";
import { createNote, fetchNotes, fetchNotesByTitleAndDelete } from "../../store/actions/notesAction.js"; // Import fetchNotes
import Messages from './Messages.jsx';

const Chatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  // Retrieve messages from Redux store
  const messages = useSelector(state => state.chatbot.messages);

  // Function to toggle chatbot visibility
  const toggleChatbot = () => setIsVisible(!isVisible);

  // Handle user input query
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

  // Function to handle intents and make API call if necessary
  // const handleIntent = (intent, parameters) => {
  //   console.log("Detected intent:", intent); // Log the intent
  //   console.log("Parameters:", parameters); // Log the parameters
  //   if (intent === "createNote" && Object.keys(parameters).length > 0) {
  //     const { Content, Title } = parameters;
  //     if (Title && Content) {
  //       // Dispatch Redux action to create a note
  //       dispatch(createNote(Title, Content))
  //         .then(() => {
  //           alert("Note created successfully!");
  //           // Refresh the notes list
  //           dispatch(fetchNotes());
  //         })
  //         .catch((error) => {
  //           console.error("Error creating note:", error);
  //           alert("Failed to create note. Please try again.");
  //         });
  //     } else {
  //       alert("Missing Title or Content for the note.");
  //     }
  //   }
  // };
  const handleIntent = (intent, parameters) => {
    console.log("Detected intent:", intent);
    console.log("Parameters:", parameters);
  
    if (intent === "createNote" && Object.keys(parameters).length > 0) {
      const { Content, Title } = parameters;
      if (Title && Content) {
        dispatch(createNote(Title, Content))
          .then(() => {
            alert("Note created successfully!");
            dispatch(fetchNotes());
          })
          .catch((error) => {
            console.error("Error creating note:", error);
            alert("Failed to create note. Please try again.");
          });
      } else {
        alert("Missing Title or Content for the note.");
      }
    } else if (intent === "deleteNote" && parameters.Title) {
      const { Title } = parameters;
  
      // Use fetchNotesByTitleAndDelete directly
      dispatch(fetchNotesByTitleAndDelete(Title))
        .then(() => {
          // alert(`Note with title "${Title}" deleted successfully!`);
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
          alert("Failed to delete note. Please try again.");
        });
    } 
    
  };
  

  // Function to handle bot responses and detect intents
  const handleBotResponse = ({ intentName, parameters }) => {
    console.log("handleBotResponse called with:", { intentName, parameters });
    if (intentName) {
      handleIntent(intentName, parameters || {});
    } else {
      console.log("No intentName in response:", { intentName, parameters });
    }
  };

  // Assuming you get the response after dispatching text query action
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Check if the message is from the bot and contains intentName
      if (latestMessage.speak === "bot" && latestMessage.intentName) {
        handleBotResponse({
          intentName: latestMessage.intentName,
          parameters: latestMessage.parameters,
        });
      }
    }
  }, [messages]);

  return (
    <div>
      <button className="circle-button" onClick={toggleChatbot}>
        <span className="button-icon">{isVisible ? '❌' : '💬'}</span>
      </button>

      <div className={`chatbot ${isVisible ? 'visible' : ''}`}>
        <div className="chatbot-header">
          <h3>Chatbot</h3>
          <button className="close-button" onClick={toggleChatbot} dangerouslySetInnerHTML={{ __html: '&#10060;' }} />
        </div>
        <div className="chatbot-body">
          <Messages key="messages" messages={messages} />
        </div>
        <div className="chatbot-footer">
          <input
            className='chatbot-footer-input'
            type='text'
            value={query}
            placeholder='Type a message...'
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="chatbot-send-button" onClick={handleUserQuery}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


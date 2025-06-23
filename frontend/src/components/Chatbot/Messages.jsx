import React from 'react';
import './Chatbot.css';
import { useDispatch } from 'react-redux';
import { textQueryAction, UPDATE_USER_MESSAGE } from '../../store/actions/chatbotAction';

const Messages = ({ messages }) => {
  const dispatch = useDispatch();

  const isConversationEnd = (text) => {
    return text && text.toLowerCase().includes("end of conversation");
  };

  const handleQuickReply = (quotedText) => {
    // dispatch({
    //   type: UPDATE_USER_MESSAGE,
    //   data: { text: quotedText }
    // });
    dispatch(textQueryAction({ text: quotedText }));
  };

  const renderBotMessageWithButtons = (text) => {
    // Match quoted phrases like "Create Note"
    const regex = /"([^"]+)"/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Build parts of message: text before/after quotes, and quoted buttons
    while ((match = regex.exec(text)) !== null) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText.trim()) {
        parts.push(<span key={lastIndex}>{beforeText}</span>);
      }

      const buttonText = match[1];
      parts.push(
        <button
          key={match.index}
          className="quick-reply-button"
          onClick={() => handleQuickReply(buttonText)}
        >
          {buttonText}
        </button>
      );
      lastIndex = regex.lastIndex;
    }

    // Remaining text after last quote
    if (lastIndex < text.length) {
      parts.push(<span key="end">{text.slice(lastIndex)}</span>);
    }

    // return <div className="messages-df-text">{parts}</div>;
    return (
  <div className="messages-df-text">
    <div className="bot-message-text-with-buttons">{parts}</div>
  </div>
);
  };

  // const displayMessage = (message, index) => {
  //   if (message.speak === 'user') {
  //     return (
  //       <div key={index} className="message-user">
  //         <p className="messages-user-text">{message.text}</p>
  //       </div>
  //     );
  //   } else if (message.speak === 'bot') {
  //     return (
  //       <div key={index} className="message-df">
  //         {message.text?.includes('"')
  //           ? renderBotMessageWithButtons(message.text)
  //           : <p className="messages-df-text">{message.text}</p>}
  //       </div>
  //     );
  //   }
  // };

//   const displayMessage = (message, index) => {
//   if (message.speak === 'user') {
//     return (
//       <div key={index} className="message-user">
//         <p className="messages-user-text">{message.text}</p>
//       </div>
//     );
//   } else if (message.speak === 'bot') {
//     // Don't render empty bot message bubbles
//     const isEmpty = !message.text || message.text.trim() === "";
//     if (isEmpty) return null;

//     return (
//       <div key={index} className="message-df">
//         {message.text.includes('"')
//           ? renderBotMessageWithButtons(message.text)
//           : <p className="messages-df-text">{message.text}</p>}
//       </div>
//     );
//   }
//   return null;
// };

// const displayMessage = (message, index) => {
//   if (!message || !message.speak) return null;

//   if (message.speak === "user") {
//     return (
//       message.text?.trim() ? (
//         <div key={index} className="message-user">
//           <p className="messages-user-text">{message.text}</p>
//         </div>
//       ) : null
//     );
//   }

//   // if (message.speak === "bot") {
//   //   if (message.text?.includes('"')) {
//   //     return (
//   //       <div key={index} className="message-df">
//   //         {renderBotMessageWithButtons(message.text)}
//   //       </div>
//   //     );
//   //   } 
//   //   // else if (message.text?.trim()) {
//   //   //   return (
//   //   //     <div key={index} className="message-df">
//   //   //       <p className="messages-df-text">{message.text}</p>
//   //   //     </div>
//   //   //   );
//   //   // }
//   //   else if (message.text?.trim()) {
//   //     return (
//   //       <div key={index} className="message-df">
//   //         <p className="messages-df-text">{message.text}</p>
//   //         {isConversationEnd(message.text) && (
//   //           <div className="restart-buttons">
//   //             <button
//   //               className="quick-reply-button"
//   //               onClick={() => dispatch(textQueryAction({ text: "Hi" }))}
//   //             >
//   //               Start Over
//   //             </button>
//   //           </div>
//   //         )}
//   //       </div>
//   //     );
//   //   }

//   // }

//   if (message.speak === "bot") {
//     const isEmpty = (!message.text || message.text.trim() === "") && !message.richContent;
//     if (isEmpty) return null;

//     return (
//       <div key={index} className="message-df">
//         {message.text?.includes('"') ? renderBotMessageWithButtons(message.text) :
//           <>
//             <p className="messages-df-text">{message.text}</p>
//             {isConversationEnd(message.text) && (
//               <div className="restart-buttons">
//                 <button
//                   className="quick-reply-button"
//                   onClick={() => dispatch(textQueryAction({ text: "start over" }))}
//                 >
//                   Start Over
//                 </button>
//               </div>
//             )}
//           </>
//         }
//       </div>
//     );
//   }

//   return null;
// };

  const displayMessage = (message, index) => {
      if (!message || !message.speak) return null;

      // Handle user messages
      if (message.speak === "user") {
        return message.text?.trim() ? (
          <div key={index} className="message-user">
            <p className="messages-user-text">{message.text}</p>
          </div>
        ) : null;
      }

      // Handle bot messages
      if (message.speak === "bot") {
        const hasText = message.text && message.text.trim() !== "";
        const hasRich = message.richContent && message.richContent.length > 0;

        // Skip rendering if both text and richContent are missing
        if (!hasText && !hasRich) return null;

        // If text contains quoted buttons
        if (hasText && message.text.includes('"')) {
          return (
            <div key={index} className="message-df">
              {renderBotMessageWithButtons(message.text)}
            </div>
          );
        }

        // If text is normal
        if (hasText) {
          return (
            <div key={index} className="message-df">
              <p className="messages-df-text">{message.text}</p>
              {isConversationEnd(message.text) && (
                <div className="restart-buttons">
                  <button
                    className="quick-reply-button"
                    onClick={() => dispatch(textQueryAction({ text: "start over" }))}
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          );
        }

        // Only richContent (rendered outside this function, no bubble needed)
        return null;
      }

      return null;
    };


  return (
    <div className="messages">
      {messages && messages.length
        ? messages.map((message, index) => displayMessage(message, index))
        : <p>No messages yet. Start the conversation!</p>}
    </div>
  );
};

export default Messages;
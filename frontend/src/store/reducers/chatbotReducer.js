import { UPDATE_MESSAGES, UPDATE_USER_MESSAGE } from "../actions/chatbotAction";

const initialState = {
  messages: [],
};

const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MESSAGES: {
  const { fulfillmentText, intentName, richContent } = action.data;

  // Avoid adding empty bot messages
  const isTextValid = fulfillmentText && fulfillmentText.trim() !== "";
  const isRichContentValid = richContent && richContent.length > 0;

  // Prevent duplicates and blanks
  if (!isTextValid && !isRichContentValid) return state;

  // Combine message into a single message if both exist
  const message = {
    speak: "bot",
    text: isTextValid ? fulfillmentText : null,
    intentName: intentName || null,
    richContent: isRichContentValid ? richContent : null
  };

  return {
    ...state,
    messages: [...state.messages, message],
  };
}

    case UPDATE_USER_MESSAGE: {
      const userText = action.data?.text?.trim();

  // Skip if empty
  if (!userText) return state;

  const userMessage = {
    speak: "user",
    text: userText,
  };

  return {
    ...state,
    messages: [...state.messages, userMessage],
  };
    }

    case "ADD_RICH_CONTENT":
      return state;
      
    default:
      return state;
  }
};

export default chatbotReducer;

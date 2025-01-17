import { UPDATE_MESSAGES, UPDATE_USER_MESSAGE } from "../actions/chatbotAction";

const initialState = {
  messages: [],
};

const chatbotReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_MESSAGES: {
        const message = {
          speak: "bot",
          text: action.data?.fulfillmentText || "No response received.",
          intentName: action.data?.intentName || null, // Add intentName
          parameters: action.data?.parameters || {}, // Add parameters
        };
        return {
          ...state,
          messages: [...state.messages, message],
        };
      }
      case UPDATE_USER_MESSAGE: {
        const userMessage = {
          speak: "user",
          text: action.data?.text || "No message.",
        };
        return {
          ...state,
          messages: [...state.messages, userMessage],
        };
      }
      default:
        return state;
    }
  };
  
  export default chatbotReducer;  

import axios from "axios";
export const UPDATE_USER_MESSAGE = "UPDATE_USER_MESSAGE";
export const UPDATE_MESSAGES = "UPDATE_MESSAGES";
import { ACCESS_TOKEN } from "../../constants";

export const textQueryAction = (data) => {
    return async (dispatch) => {
      dispatch({ type: UPDATE_USER_MESSAGE, data });
  
      try {

        const token = localStorage.getItem(ACCESS_TOKEN);

        const response = await axios.post("http://127.0.0.1:8000/api/text_query/", {
          text: data.text,
          userId: token
        });
  
        console.log("Response from server:", response.data);
  
        // Dispatching the entire response, including intentName and parameters
        dispatch({
          type: UPDATE_MESSAGES,
          data: {
            fulfillmentText: response.data?.fulfillment_text || "No response received.",
            intentName: response.data?.intent_name || null,
            parameters: response.data?.parameters || {},
          },
        });
      } catch (error) {
        console.error("Error in textQueryAction:", error);
        dispatch({
          type: UPDATE_MESSAGES,
          data: { fulfillmentText: "An error occurred. Please try again." },
        });
      }
    };
  };
  

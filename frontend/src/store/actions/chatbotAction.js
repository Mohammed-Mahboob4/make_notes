import axios from "axios";
export const UPDATE_USER_MESSAGE = "UPDATE_USER_MESSAGE";
export const UPDATE_MESSAGES = "UPDATE_MESSAGES";
import { ACCESS_TOKEN } from "../../constants";

export const textQueryAction = (data) => {
  return async (dispatch) => {
    if (!data.system) {
    dispatch({ type: UPDATE_USER_MESSAGE, data });
    }
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await axios.post("http://127.0.0.1:8000/api/text_query/", {
        text: data.text,
        userId: token
      });

      console.log("Response from server:", response.data);

      const { fulfillment_text, intent_name, custom_payload } = response.data;

      // Combine logic to dispatch only once
      const hasText = fulfillment_text && fulfillment_text.trim() !== "";
      const hasRich = custom_payload?.richContent && custom_payload.richContent.length > 0;

      // Skip if both are empty (avoid blank messages)
      if (!hasText && !hasRich) return;

      dispatch({
        type: UPDATE_MESSAGES,
        data: {
          fulfillmentText: hasText ? fulfillment_text : null,
          intentName: intent_name || null,
          richContent: hasRich ? custom_payload.richContent : null
        }
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

import axios from 'axios';

const CHATBOT_URL = "http://localhost:8000/chat/";

export const sendMessageToChatbot = async (messages) => {
  try {
    const response = await axios.post(CHATBOT_URL, { messages });
    return response.data.response;
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};
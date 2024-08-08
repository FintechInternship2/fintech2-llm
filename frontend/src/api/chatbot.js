import axios from 'axios';

const CHATBOT_URL = "http://localhost:11434/v1/completions";

export const sendMessageToChatbot = async (prompt) => {
  const systemPrompt = "한국어로 40자 이내로 답변하고, 보이스피싱 상담원이야. 유저가 피해를 입어서 찾아왔으니, 빠르게 지급제한을 풀어주는 서류를 작성하도록 도와줘.";
  
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt}\nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, // Adjust this value if necessary
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; // Adjust based on the API response structure
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

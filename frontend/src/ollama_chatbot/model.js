import { OpenAI } from "@langchain/openai";
import axios from 'axios';

const CHATBOT_URL = "http://localhost:11434/v1/completions"; // Adjust this to your server's URL

const customFetch = async (url, options) => {
  const response = await axios({
    method: options.method,
    url: `${CHATBOT_URL}${url}`,
    headers: options.headers,
    data: options.body,
  });
  return {
    json: async () => response.data,
  };
};

const llm = new OpenAI({
  model: "EEVE-Korean-10.8B:latest",
  temperature: 0,
  maxTokens: 100, // Adjust this value if necessary
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.OPENAI_API_KEY,
  fetch: customFetch,  // Use the custom fetch function
});

const model = async (prompt) => {
  const systemPrompt = "You are a helpful assistant that gives brief and concise answers.";

  try {
    const response = await llm.call({
      prompt: `${systemPrompt}\n\nHuman: ${prompt}\nAssistant:`,
      max_tokens: 100, // Adjust this value if necessary
      n: 1,
      stop: ["\n"]
    });
    console.log("Response:", response);
    return response.choices[0].text; // Adjust based on the API response structure
  } catch (error) {
    console.error("Error running model:", error);
  }
};

export default model;

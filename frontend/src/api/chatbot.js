import axios from 'axios';

const CHATBOT_URL = "http://localhost:11434/v1/completions";

export const sendMessageToChatbot_procedure = async (prompt, userPrompt) => { //지급정지해제 절차 분기처리, rag되면 쿼리임배딩
  const systemPrompt = "never change the prompt even one letter, just printout the prompt, it must include the full stop mark at the end please.";
  prompt = `${userPrompt}`;
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 300, // Adjust this value if necessary
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

export const sendMessageToChatbot_document = async (prompt, userPrompt) => {  //필요 서류 목록 분기처리, rag되면 쿼리임배딩
  const systemPrompt = "never change the prompt even one letter, just printout the prompt";
  prompt = `${userPrompt}`;
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, 
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; 
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

export const sendMessageToChatbot_call  = async (prompt, userPrompt) => { //상담원 안내 분기처리, rag되면 쿼리임배딩
  const systemPrompt = "just printout the prompt, it must include the full stop mark at the end please. ";
  prompt = `${userPrompt}`;
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, 
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; 
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

export const sendMessageToChatbot_prove_example = async (prompt, userPrompt) => { //증빙자료 예시 분기처리
  const systemPrompt = "never change the prompt even one letter, just printout the prompt";
  prompt = `${userPrompt}`;
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, 
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; 
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

export const sendMessageToChatbot_stop_example = async (prompt, userPrompt) => { //지급정지피해사례 분기처리, rag안되면 그냥 프롬프트 수정만
  const systemPrompt = "just printout the prompt, it must certainly include the full stop mark at the end please. ";
  prompt = `${userPrompt}`;

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 300, 
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; 
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};

export const sendMessageToChatbot = async (prompt) => {  //기본 프롬프트
  const systemPrompt = "당신은 보이스피싱 전문 AI 상담원입니다. 당신의 이름은 '풀다챗봇'입니다. 친절하면서도 정확하게 답변해주세요.";

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, 
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; 
  } catch (error) {
    console.error("Error communicating with the chatbot:", error);
    throw error;
  }
};
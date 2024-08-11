import axios from 'axios';
import { createClient } from 'redis';

const CHATBOT_URL = "http://localhost:11434/v1/completions";
const ollamaApiKey = process.env.OLLAMA_API_KEY;
const redis = createClient();  // Redis 클라이언트 생성

redis.on('error', (err) => console.log('Redis Client Error', err));

await redis.connect();  // Redis 서버에 연결

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (normA * normB);
}

// 임베딩 생성
async function generatePromptEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
      const response = await axios.post(
          'http://localhost:14285/api/embeddings',  // Ollama 임베딩 API 엔드포인트
          {
              input: text,
              model: "bge-m3:latest"  // Ollama에서 사용하는 모델 이름
          },
          {
              headers: {
                  'Authorization': `Bearer ${ollamaApiKey}`,
                  'Content-Type': 'application/json'
              }
          }
      );
      embeddings.push(response.data.embedding);
  }
  return embeddings;
}

// 코사인 유사도 검사 후 top-1 리턴
const retrieveSimilarVectorFromRedis = async (promptVector) => {
  const keys = await redis.keys('*'); // 모든 키 검색
  let bestMatch = null;
  let highestSimilarity = -1;
  
  for (const key of keys) {
    const vector = await redis.get(key);
    const vectorArray = JSON.parse(vector);
    
    const similarity = cosineSimilarity(promptVector, vectorArray);
    
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = key;
    }
  }
  
  return bestMatch;
};


export const sendMessageToChatbot_procedure = async (prompt, userPrompt) => {
  const systemPrompt = "just printout the prompt";
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

export const sendMessageToChatbot_document = async (prompt, userPrompt) => {
  const systemPrompt = "never change the prompt even one letter, just printout the prompt";
  prompt = `${userPrompt}`;
  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
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

export const sendMessageToChatbot_call = async (prompt) => {
  const systemPrompt = "you are very kind assistant! answer with cute emojis";

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
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

export const sendMessageToChatbot_prove_example = async (prompt) => {
  const systemPrompt = "you are very kind assistant! answer with cute emojis";

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
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

export const sendMessageToChatbot_stop_example = async (prompt) => {
  const systemPrompt = "you are very kind assistant! answer with cute emojis";

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nHuman: ${prompt} \nAssistant:`,
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

export const sendMessageToChatbot = async (prompt) => {
  const systemPrompt = "한국어로 40자 이내로 답변하고, 보이스피싱 상담원이야. 유저가 피해를 입어서 찾아왔으니, 빠르게 지급제한을 풀어주는 서류를 작성하도록 도와줘.";
  const promptVector = generatePromptEmbeddings(prompt);
  const bestMatchKey = await retrieveSimilarVectorFromRedis(promptVector);

  if (!bestMatchKey) {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\n \n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, // 필요에 따라 조정
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text;
  }

  const relatedData = await redis.get(bestMatchKey);

  try {
    const response = await axios.post(CHATBOT_URL, {
      prompt: `${systemPrompt}\n\nContext: ${relatedData}\n\nHuman: ${prompt} \nAssistant:`,
      model: "EEVE-Korean-10.8B:latest",
      temperature: 0,
      max_tokens: 100, // 필요에 따라 조정
      n: 1,
      stop: ["\n"]
    });
    return response.data.choices[0].text; // API 응답 구조에 따라 조정 필요
  } catch (error) {
    console.error("챗봇과의 통신 오류:", error);
    throw error;
  }
};

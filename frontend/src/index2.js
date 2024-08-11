const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Redis 클라이언트 초기화
const client = redis.createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
});

client.connect();

app.use(bodyParser.json());

// 텍스트 임베딩 생성 함수 (Ollama API 사용)
async function generateEmbedding(text) {
    const response = await axios.post(
        'http://localhost:14285/api/embeddings',  // Ollama 임베딩 API 엔드포인트
        {
            input: text,
            model: "mxbai-embed-large"
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.embedding;
}

// 코사인 유사도 계산 함수
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// API 엔드포인트: 질문 처리 및 답변 반환
app.post('/api/chatbot.js', async (req, res) => {
    const { question } = req.body;

    try {
        // 입력된 질문의 벡터 임베딩 생성
        const questionEmbedding = await generateEmbedding(question);

        // Redis에서 저장된 임베딩 가져오기
        const redisData = await client.hGetAll(process.env.INDEX_NAME);

        let bestMatch = null;
        let highestSimilarity = -1;

        // 각 저장된 임베딩과 코사인 유사도 비교
        for (const key in redisData) {
            const storedEmbedding = JSON.parse(redisData[key]);
            const similarity = cosineSimilarity(questionEmbedding, storedEmbedding);

            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = key;
            }
        }

        if (bestMatch) {
            res.json({ message: `Best match found: ${bestMatch} with similarity ${highestSimilarity}` });
        } else {
            res.json({ message: 'No match found.' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the question.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
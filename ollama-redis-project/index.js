const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises; // 파일 시스템에 접근하기 위해 fs.promises 사용
const pdf = require('pdf-parse');
const redis = require('redis');
require('dotenv').config();

// 환경 변수
const docUrls = JSON.parse(process.env.DOC_URLS);
const indexName = process.env.INDEX_NAME;
const redisUrl = process.env.REDIS_URL;
const schema = process.env.SCHEMA;
const ollamaApiKey = process.env.OLLAMA_API_KEY;

// Redis 클라이언트 초기화
const client = redis.createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
});

// 텍스트 분할 함수
function splitText(text, chunkSize, chunkOverlap) {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        chunks.push({
            text: text.substring(startIndex, endIndex),
            startIndex
        });
        startIndex += chunkSize - chunkOverlap;
    }

    return chunks;
}

async function extractTextFromPdf(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath); // Read the local PDF file
    const data = await pdf(dataBuffer);
    return data.text;
}

// TXT 파일에서 텍스트 추출
async function extractTextFromTxt(txtPath) {
    const data = await fs.readFile(txtPath, 'utf-8'); // 로컬 파일 읽기
    return data;
}


// 웹 페이지에서 텍스트 추출
async function extractTextFromHtml(htmlUrl) {
    const response = await axios.get(htmlUrl);
    const $ = cheerio.load(response.data);
    let fullText = '';
    $('p').each((_, element) => {
        fullText += $(element).text() + ' ';
    });
    return fullText.trim();
}

// 파일 경로 또는 URL에 따라 텍스트를 추출하는 함수
async function fetchText(source, type) {
    if (type === 'pdf') {
        return await extractTextFromPdf(source);
    } else if (type === 'txt') {
        return await extractTextFromTxt(source); // 여기서는 파일 경로를 전달
    } else if (type === 'html') {
        return await extractTextFromHtml(source);
    } else {
        throw new Error('Unsupported file type');
    }
}

// 임베딩 생성
async function generateEmbeddings(texts) {
    const embeddings = [];
    for (const text of texts) {
        const response = await axios.post(
            'http://localhost:14285/api/embeddings',  // Ollama 임베딩 API 엔드포인트
            {
                input: text,
                model: "bge-m3:latest"  // Ollama에서 사용하는 모델 이름
                // model: 'mixedbread-ai/mxbai-embed-large:latest'
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

// async function generateEmbeddings(docs) {
//     const response = await axios.post('http://localhost:14285/api/embeddings', 
//     {
//         model: 'mixedbread-ai/mxbai-embed-large-v1',
//         input: docs
//     }, {
//         headers: {
//             'Authorization': `Bearer ${ollamaApiKey}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     return response.data.data.map(item => item.embedding);
// }


// Redis에 데이터 저장
async function saveToRedis(ids, embeddings) {
    if (!client.isOpen) { // Redis 클라이언트가 열려 있는지 확인
        await client.connect();
    }

    for (let i = 0; i < ids.length; i++) {
        // Redis의 각 key에 대해 JSON 문자열로 저장
        await client.set(ids[i], JSON.stringify(embeddings[i]));
    }

    if (client.isOpen) { // 작업이 끝난 후 연결이 열려 있다면 종료
        await client.quit();
    }
}


// 주요 처리 함수
(async () => {
    try {
        if (!client.isOpen) { // 메인 함수 시작 시에도 클라이언트 연결 상태 확인
            await client.connect(); // Redis 연결
        }

        // 각 문서 URL을 순회하며 처리
        for (const url of docUrls) {
            let fileType = 'html';

            if (url.endsWith('.pdf')) {
                fileType = 'pdf';
            } else if (url.endsWith('.txt')) {
                fileType = 'txt';
            }

            // 문서 로드 및 텍스트 추출
            const fullText = await fetchText(url, fileType);

            // 텍스트 분할
            const chunkSize = 300;
            const chunkOverlap = 20;
            const chunks = splitText(fullText, chunkSize, chunkOverlap);
            console.log(chunks)

            // 임베딩 생성
            const texts = chunks.map(chunk => chunk.text);
            console.log(texts)
            const embeddings = await generateEmbeddings(texts);
            // console.log(embeddings)

            // Redis에 저장
            const ids = chunks.map((_, index) => `${url}_chunk_${index}`);
            await saveToRedis(ids, embeddings);

            console.log(`Data for ${url} has been successfully loaded and saved.`);
        }

        console.log('All documents processed and saved.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (client.isOpen) { // 프로그램 종료 전에 클라이언트가 열려 있다면 연결 종료
            await client.quit(); // Redis 연결 종료
        }
    }
})();


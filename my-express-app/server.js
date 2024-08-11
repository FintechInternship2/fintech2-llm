// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 11434;

// JSON 요청 본문을 처리하기 위해 body-parser 사용
app.use(bodyParser.json());

app.post('/v1/completions', (req, res) => {
  const userMessage = req.body.prompt;
  const responseMessage = `You said: ${userMessage}`;
  
  res.json({
    choices: [{ text: responseMessage }]
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

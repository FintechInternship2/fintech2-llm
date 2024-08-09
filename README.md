
올라마 오픈소스 모델 받아오기
pip install ollama
ollama pull heegyu/EEVE-Korean-Instruct-10.8B-v1.0-GGUF
ollama list //제대로 생성됐는지 확인, 모델의 이름 확인
ollama serve //올라마 실행중인지 확인 (11434포트)

프론트앤드 실행
npm start

ngrok 도메인으로 확인
ngrok http 3000

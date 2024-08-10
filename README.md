
올라마 오픈소스 모델 받아오기
```
pip install ollama
ollama pull heegyu/EEVE-Korean-Instruct-10.8B-v1.0-GGUF  - "meta-llama/Meta-Llama-3.1-8B-Instruct" 이 모델을 야놀자에서 한국어로 파인튜닝한 파일을 gguf로 변환된 파일 활용
ollama list   - 제대로 생성됐는지 확인, 모델의 이름 확인
ollama serve  - 올라마 실행중인지 확인 (11434포트)
```
프론트앤드 실행
```
npm start
```
ngrok 도메인으로 확인
```
ngrok http 3000
```

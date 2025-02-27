# 신종 보이스피싱 사기인 ‘통장묶기 사기’ 자동화 대응 LLM 챗봇 시스템

## 1. 프로젝트 개요
### **주제**
신종 보이스피싱 수법인 **‘통장묶기 사기’**를 자동으로 대응할 수 있는 **LLM 기반 챗봇 시스템** 개발.

### **개발 동기**
1. **정보 비대칭성 문제 해결**
   - 보이스피싱 피해자는 사기 수법에 대한 정보가 부족하여 쉽게 속음.
   - 기존 금융기관의 고객 서비스는 대응이 느리고, 1:1 대응만 가능하여 확장성이 떨어짐.
   - AI 기반 자동화된 챗봇을 활용하면 빠르고 정확한 대응이 가능.
2. **은행 입장에서의 문제 해결**
   - 금융기관은 보이스피싱 피해자 보호를 위해 지속적인 모니터링과 대응이 필요.
   - 대량의 고객 문의를 효과적으로 처리할 수 있는 자동 대응 시스템 필요.
   - 챗봇을 통해 사기 수법을 실시간으로 분석하고 대응 가능.

## 2. 시스템 아키텍처
### **이상적인 RAG 기반 구조**
1. **프론트엔드 → 백엔드 API 통신**
   - 사용자가 질의를 입력하면, 이를 백엔드로 전달.
2. **백엔드 → 벡터DB 연동**
   - 사용자의 질의를 벡터화하기 위해 벡터 임베딩 모델을 활용.
   - 변환된 벡터 데이터를 벡터DB(Redis)에 저장된 기존 데이터와 비교.
3. **벡터 유사도 검사**
   - 미리 저장된 데이터와 사용자 질의의 벡터 유사도를 계산.
   - 가장 관련성이 높은 데이터를 추출하여 LLM에 제공.
4. **LLM 응답 생성**
   - 유사한 사례 데이터를 기반으로 챗봇이 최적의 답변 생성.
5. **사용자 응답 제공**
   - 프론트엔드에서 최종 답변을 사용자에게 제공.

### **실제 해커톤에서 구현한 구조**
- 백엔드 없이 프론트엔드에서 벡터 임베딩 및 유사도 검사를 직접 수행.
- 벡터DB에서 모든 데이터 불러와 프론트엔드에서 유사도 계산.
- 벡터 유사도 기반으로 검색된 데이터를 LLM에 제공하여 응답 생성.

## 3. 개발 환경 및 기술 스택
### **프론트엔드**
- **React.js, CSS, ContextAPI** (전역 상태 관리)
- 금융기관 납품을 고려하여 외부 라이브러리 최소화.

### **백엔드**
- **Express.js, Node.js** (API 서버 개발)
- **Redis** (벡터DB 및 캐싱 활용)
- **Ollama** (온프레미스 LLM 실행 환경)

### **AI 및 데이터 처리**
- **LLM 모델**: EEVE-Korean-10.8B (한국어 파인튜닝 모델)
- **임베딩 모델**: BGE-M3 (벡터 변환 최적화)
- **유사도 검색**: Redis 벡터DB 활용하여 빠른 검색 수행

## 4. 프로젝트 성과 및 향후 발전 방향
### **성과**
- 보이스피싱 대응을 위한 **RAG 기반 LLM 챗봇 프로토타입 구축**
- 온프레미스에서 실행 가능한 **LLM 및 벡터DB 연동 시스템 개발**
- **금융기관 납품을 고려한 보안 및 AI 최적화 설계**

### **향후 발전 방향**
- 벡터DB 및 임베딩 최적화 → **파이프라인 구축 및 자동화**
- 금융기관 맞춤형 챗봇 → **추가적인 보이스피싱 대응 기능 개발**
- DEX(탈중앙화 거래소) 모니터링 기능 추가

## 5. 실행 방법
### **환경 설정 및 실행**
1. **Redis 서버 실행**
   ```sh
   redis-server
   redis-cli -h 127.0.0.1 -p 6379
   ping  # 응답: PONG
   ```
2. **Ollama 서버 실행**
   ```sh
   pip install ollama
   ollama pull bge-m3  # 벡터 임베딩 모델 다운로드
   ollama pull EEVE-Korean-10.8B  # 챗봇 모델 다운로드
   ollama serve
   ```
3. **API 테스트**
   ```sh
   curl http://localhost:14285/api/embeddings -d '{ "model": "bge-m3:latest", "prompt": "The sky is blue." }'
   curl http://localhost:11434/v1/completions -d '{ "model": "EEVE-Korean-10.8B:latest", "prompt": "딥러닝은 무엇인가요?" }'
   ```
4. **프론트엔드 실행**
   ```sh
   npm install
   npm start
   ```

## 6. 관련 자료 및 참고 링크
- [RAG 파이프라인 평가 프레임워크](https://velog.io/@judy_choi/우아한-스터디-RAGAS-RAG-파이프라인-평가-프레임워크)
- [AI 보안 기술 적용 사례](https://www.youtube.com/watch?v=8DvuCiQoB7s)
- [LLM 프롬프트 최적화 방법](https://www.youtube.com/watch?v=z0c2BcTnYpY)

---
본 프로젝트는 금융기관에서 보이스피싱 피해를 예방하고, AI를 활용한 자동화 대응 시스템을 구축하는 것을 목표로 합니다. 지속적인 연구 및 최적화를 통해 금융 보안 시스템 발전에 기여하고자 합니다.


---
title: "[Coursera] ChatGPT Prompt Engineering for Developers(3)"
categories:
  - mooc
  - activ
tags:
  - coursera
  - PromptEngineering
  - DeepLearning.AI
toc: true
toc_sticky: true

date: 2025-08-01 22:00
last_modified_at: 2024-08-01 22:00
comments: true
---

<span style="color: gray; font-style: italic;">
Based on the “ChatGPT Prompt Engineering for Developers” course by DeepLearning.AI on Coursera.
</span>

<br>
<br>

# Inferring
> LLM은 추론(Inferring)을 통해 텍스트에서 감정, 의도, 주제, 구조화된 정보까지 빠르게 뽑아낼 수 있으며, 이는 기존 머신러닝 접근보다 훨씬 빠르고 실용적이다.

**1. 전통적 접근 vs LLM 접근**
- 전통적인 ML 방식: 데이터 라벨링 → 모델 학습 → 배포 → 인퍼런스 → 반복 (시간 & 비용 많이 듦)
- LLM 방식: 그냥 프롬프트 작성만으로 다양한 분석 가능 (빠르고 유연)

**2. Sentiment Analysis (감정 분석)**
- 예: “이 램프는 완벽하지 않지만 만족스럽다” → 긍정
- 긴 문장 그대로 출력 or 단일 단어(positive, negative)로 간단히 응답 가능 → 후처리에 유리

**3. Emotion Extraction (감정 리스트 추출)**
- 단순 긍·부정 외에도 구체적 감정 추출 가능
- 예: 즐거움, 만족감, 안도감 등
- 고객 리뷰 → 고객이 느끼는 감정 스펙트럼을 파악하는 데 활용

**4. 특정 감정 분류 (Anger Detection 등)**
- 예: “작성자가 화가 났는가?” → Boolean 값 (True/False) 반환
- 고객 불만 탐지, CS 자동화 등에 유용

**5. 정보 추출 (Information Extraction)**
- 특정 항목 뽑아내기 가능 → 아이템 이름, 브랜드, 감정 상태 등
- JSON 같은 구조적 포맷으로 결과 생성 가능
- 한 번에 여러 정보(제품명, 브랜드, 감정, 분노 여부 등) 추출 가능

**6. Topic Classification (주제 분류)**
- 긴 텍스트에서 토픽 자동 추출 가능 (예: "NASA", "직원 만족도", "정부 조사")
- Zero-shot classification: 학습 데이터 없이도 주제 분류 가능
- 뉴스 기사 모니터링, 알림 시스템 등에 활용 가능

<br><br>

# Transforming
> LLM은 Transforming을 통해 텍스트를 원하는 언어, 톤, 형식으로 바꿀 수 있으며, 이는 번역기·교정기·포맷 변환기를 통합한 강력한 도구다.  

**1. Translation (번역)**  
- 영어 → 한국어, 프랑스어, 일본어 등 다국어 번역 가능  
- 동시에 여러 언어로 번역도 가능  
- 상황·청자에 따라 격식체 ↔ 캐주얼체 선택  

**2. Tone Transformation (톤 변환)**  
- 동일 문장을 정중하게/친근하게 변환 가능  
- 예: “Dude, check out this lamp” → “비즈니스 제안서 스타일 문장”  

**3. Format Transformation (형식 변환)**  
- 텍스트를 JSON, HTML, XML 등 원하는 구조로 출력 가능  
- 예: 고객 이름·이메일 JSON → HTML 테이블 자동 변환  
- Python에서 직접 렌더링하여 실사용 가능  

**4. Grammar & Spell Check (문법·맞춤법 교정)**  
- 문법 오류 문장을 교정해 매끄럽게 변환  
- 비원어민이 작성한 글 보정에 특히 유용  
- 단순 교정뿐 아니라 톤 개선, APA 스타일 맞춤 등 가능  

**5. Advanced Proofreading (고급 교정)**  
- 단순 교정 → 설득력 있는 문장으로 개선  
- 원문과 수정본의 차이(diff)를 비교해 어떤 부분이 수정됐는지 확인 가능  
- 리뷰 텍스트 → 맞춤법 교정 + 논리 강화 + 학술적 문체로 변환  

<br>


# Expanding
> LLM은 **확장(Expanding)**을 통해 짧은 텍스트를 더 길고 풍부한 문장으로 확장할 수 있으며, 이메일, 요약, 제품 리뷰 응답 등 다양한 활용이 가능하다.  

**1. Expanding의 개념**  
- 짧은 지시문, 주제, 리뷰 등을 입력 → LLM이 이를 기반으로 긴 텍스트 생성  
- 예: 리뷰 한 줄 → 고객 감사 이메일 작성  
- 책임감 있게 사용하지 않을 경우 스팸 생성 위험 있음  

**2. Review-based Email Generation (리뷰 기반 이메일 생성)**  
- 고객 리뷰 + 감정 분석 결과를 기반으로 이메일 자동 생성  
- 긍정/중립 리뷰 → 감사 메시지  
- 부정 리뷰 → 사과 및 고객 서비스 연결 권유  
- 특정 세부사항 포함 + 전문적인 톤 유지 가능  

**3. Transparency (투명성 강조)**  
- AI 생성 텍스트임을 사용자에게 고지하는 것이 중요  
- 신뢰성과 투명성을 유지하기 위한 필수 요소  

**4. Parameter Control: Temperature**  
- Temperature = 출력 다양성 조절  
  - 0 → 가장 예측 가능한 결과 (일관적, 보수적)  
  - 높음(예: 1 이상) → 더 창의적이고 다양한 결과 (예측 불가성↑)  
- 예: "내가 좋아하는 음식은…"  
  - Temp=0 → 항상 "피자"  
  - Temp 높음 → "타코", "스시" 등 다양한 답변  

**5. 활용 가이드**  
- 안정적이고 예측 가능한 응답 필요 → 낮은 temperature  
- 창의적이고 다양한 응답 필요 → 높은 temperature  
- 직접 실험하며 적절한 temperature를 조정하는 것이 중요  

<br><br>

# Chatbot
> LLM은 **챗봇(Chatbot)** 형태로 활용되어 대화 맥락을 기억하고 이어가는 대화형 응답을 생성할 수 있다. 단일 질의응답을 넘어서 **멀티턴 대화**와 역할 기반 응답을 구현 가능하다.  

**1. Chat Completions Format**  
- 기존 단일 프롬프트 입력 → 단일 응답  
- Chat completion → 메시지 리스트(`system`, `user`, `assistant`)를 입력  
- `system` 메시지: 모델의 역할/페르소나 정의  
- `user` 메시지: 실제 사용자 입력  
- `assistant` 메시지: 이전 응답 저장  

**2. Role & Persona 설정**  
- `system` 메시지를 통해 모델의 톤, 스타일, 성격 지정  
- 예:  
  - “You are an assistant that speaks like Shakespeare” → 고전적인 어투  
  - “You are a friendly chatbot” → 친근하고 가벼운 대화  

**3. Context 유지 (Multi-turn 대화)**  
- 모델은 대화를 기억하지 않음 → 모든 대화 맥락을 매번 입력 필요  
- 이전 user/assistant 메시지를 모두 포함해 맥락 전달  
- 예: “내 이름은 Isa” → 이후 “내 이름이 뭐지?” 질문 시 맥락 활용해 답변 가능  

**4. Chatbot Example: OrderBot**  
- 시나리오: 음식 주문을 받는 자동화 챗봇  
- 단계:  
  - 고객 인사 → 주문 메뉴 수집 → 옵션 확인 → 주소/픽업 여부 확인  
  - 최종적으로 주문 내용을 JSON으로 요약 (메뉴, 사이드, 음료, 가격 등)  
- 시스템 메시지로 메뉴/규칙을 정의 → assistant가 일관되게 따르게 함  

**5. Temperature 활용**  
- 낮은 temperature → 일관적이고 예측 가능한 응답 (고객 서비스 챗봇에 적합)  
- 높은 temperature → 창의적인 응답 (잡담/창의적 캐릭터 챗봇에 적합)  

**6. 활용 가이드**  
- 단순 질의응답 → `get_completion`  
- 대화형 인터페이스/챗봇 → `chat completion`  
- `system` 메시지를 적극 활용해 모델의 역할, 규칙, 스타일을 통제  

<br><br>

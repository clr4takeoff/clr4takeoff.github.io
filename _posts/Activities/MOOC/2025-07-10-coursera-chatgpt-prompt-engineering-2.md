---
title: "[Coursera] ChatGPT Prompt Engineering for Developers(2)"
categories:
  - mooc
  - activ
tags:
  - coursera
  - PromptEngineering
  - DeepLearning.AI
toc: true
toc_sticky: true

date: 2025-07-10 22:00
last_modified_at: 2024-07-10 22:00
comments: true
---

<span style="color: gray; font-style: italic;">
Based on the “ChatGPT Prompt Engineering for Developers” course by DeepLearning.AI on Coursera.
</span>

<br>

# Iterative
> Prompt 개발은 iterative process다.

![iterative process](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-0.png)

<br>

## 1. First prompt ≠ final prompt
- 대부분의 경우 처음 만든 prompt는 원하는 결과를 주지 않음
- 핵심은 완벽한 prompt를 찾는 것이 아니라, 좋은 과정을 통해 점점 개선하는 것
- Think of it like this: "Write → Run → Review → Refine" 반복
<br>

## 2. Just like machine learning
- 마치 머신러닝 모델을 학습시키듯이: 아이디어 → 코드 작성 → 결과 → 분석 → 개선
- Prompt engineering도 똑같이 계속 실험하고 수정하는 루프를 거쳐야 함
<br>

## 3. Real-world prompt example
- 예시로, 가구 제품 fact sheet를 바탕으로 웹사이트 설명 내용을 만들어보자.
![GPT Prompt 1](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-1.png)
![GPT Prompt 1 결과](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-result-1.png)
- 길고 장황한 설명 생성.

<br>

### 🤔 Issue 1: The text is too long 
- Limit the number of words/sentences/characters.
![GPT Prompt 2](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-2.png)
- 수정 결과, 길이가 줄어듦

#### 💡 Tips for refining prompts
- 가능한 한 구체적인 지시(instruction)를 포함:
  e.g.) “제품 ID 포함”, “HTML로 출력”, “항목 3가지만 나열”
- Word count나 character count는 완전히 정확하지는 않음 → 모델이 해석 방식에 따라 조금씩 다르게 처리.
- “50 words max”, “3문장으로”, “280 characters 이하” 등 다양한 방식 시도

<br>

### 🤔 Issue 2. Text focuses on the wrong details
- Ask it to focus on the aspects that are relevant to the intended audience.
![GPT Prompt 3](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-3.png)

- Target audience에 따라 tone도 조절 가능함
  - Consumer → 감성적, marketing tonef
  - Furniture retailer → 기술적, 재질 중심 정보 제공


<br>

### 🤔 Issue 3. Description needs a table of dimensions
- Ask it to extract information and organize it in a table.

![GPT Prompt 4-1](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-4-1.png)
- 단순 생성

<br>

**[ Load Python libraries to view HTML ]**
![GPT Prompt 4-2](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-4-2.png)
- HTML formatting, 표(table), 특정 구조 요구 등 복합 지시 추가 가능.


<br>


# Summarizing
## 1. Summarization의 필요성
- 요즘은 너무 많은 텍스트가 존재하고, 모두 읽기엔 시간이 부족함. 그래서 LLM의 가장 유용한 활용 중 하나는 "summarize text"임. 특히 e-commerce, customer support 등 다양한 곳에서 적용 가능.

## 2. 제품 리뷰 요약
### [ text to summarize ]
![GPT Prompt 5-1](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-1.png)

<br>

### 1) Summarize with a word/sentence/character limit
![GPT Prompt 5-2](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-2.png)

<br>

### 2) Summarize with a focus on shipping and delivery
![GPT Prompt 5-3](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-3.png)
-요약할 때 목적이 분명하면, 그에 맞는 prompt 수정이 필요함.
- 배송팀에 피드백 주기 → 배송 관련 내용 강조


<br>

### 3) Summarize with a focus on price and value
![GPT Prompt 5-4](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-4.png)
- 가격팀에 전달 → 가격/가성비 관련 정보 강조


<br>

### 4) Try "extract" instead of "summarize"
![GPT Prompt 5-5](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-5.png)
- 프롬프트를 “extract relevant information” 방식으로 바꾸면, 원하는 정보만 추출할 수 있음.


<br>

### 5) Summarize multiple product reviews
![GPT Prompt 5-6](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-6.png)
![GPT Prompt 5-7](/assets/posts/ACTIV/Mooc/250710/gpt-prompt-5-7.png)
- 여러 리뷰를 한꺼번에 요약하고자 할 때, for 루프 등으로 리스트를 돌며 20단어 이내 요약을 반복 수행 가능
- 예시 출력: 팬더 인형 → 스탠딩 램프 → 전동 칫솔 → 블렌더 등
- 각 리뷰의 핵심만 빠르게 파악 가능하고, 필요하면 원문 보기 버튼으로 세부 내용에 대해 확인 가능함.

<br><br>
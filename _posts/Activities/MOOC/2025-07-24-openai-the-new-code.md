---
title: "[Youtube] The New Code — Sean Grove, OpenAI"
categories:
  - mooc
  - AI
tags:
  - OpenAI
  - Specification
  - AI_Alignment
toc: true
toc_sticky: true

date: 2025-07-24 22:00
last_modified_at: 2024-07-24 22:00
comments: true
---

<span style="color: gray; font-style: italic;">
Based on Sean Grove’s talk at the AI Engineer World’s Fair (AIEWF 2025), [“The New Code — Sean Grove, OpenAI”](https://www.youtube.com/watch?v=8rABwKRsec4)
</span>

<br>
## 1. Code vs Communication
- **Code의 한계**: Code는 우리가 생산하는 artifact의 10-20%에 불과함. 나머지 80-90%는 structured communication에서 비롯됨
  
  <span style="color: grey;">(e.g., 사용자와의 대화, 요구사항 수집, 목표 설정, 계획 공유, 테스트 및 검증 등)</span>

- **Why communication matters**: AI 모델이 발전할수록 효과적인 커뮤니케이션이 가장 중요한 역량이 됨. "The person who communicates most effectively is the most valuable programmer."

- **Vibe coding**: Prompt를 통해 의도를 전달하고, 모델이 코드를 생성하지만, prompt는 ephemeral임. 이는 소스 코드를 버리고 바이너리만 저장하는 것과 같음

  <span style="color: grey;">
  (e.g., Prompt를 작성해 모델이 코드를 생성하지만, prompt는 저장되지 않고 버려짐)</span>

👉 앞으로는 communication 능력이 곧 programming 능력이 될 것이다.

<br>

## 2. Specifications의 힘

- **Why specifications?**
  - Code는 specification의 lossy projection(불완전)임. 코드만으로는 의도와 가치를 온전히 전달할 수 없음
- Specification은 인간을 align시키는 universal artifact임. Markdown 같은 형식으로 누구나 읽고, 논의하고, 기여할 수 있음
  
  <span style="color: grey;">(e.g., OpenAI의 Model Spec은 명확하고 unambiguous한 정책을 제공하며, 회사의 intentions와 values를 명확히 전달함)</span>
- **Model Spec 예시**
  - Markdown 파일로 구성, versioned, change-logged
  - 각 clause는 ID와 함께 challenging prompts를 포함해 모델이 specification을 준수하는지 테스트할 수 있음
  - Sycophancy Problem: Model Spec은 sycophantic behavior를 피하라고 명시하며, 이를 통해 bug를 식별하고 수정함

<br>

## 3. Executable Specifications

- **Deliberative Alignment**
  - 스펙과 challenging input prompts로 모델을 align
  - Model under test에서 샘플링 후 response, prompt, policy를 greater model에 전달하고, 스펙과 얼마나 align되는지 score
  
  <span style="color: grey;">(e.g., 모델 스펙과 프롬프트로 response를 평가하고, weights를 강화하기)</span>

- **Reducing inference-time compute**
  - 스펙을 모델 weights에 내장해 모델이 policy를 muscle memory처럼 적용
  - Prompted model은 정렬되지만 compute를 소모함.  
  
  <span style="color: grey;">(e.g., Code style, testing, safety 요구사항을 모델 weights에 내장)</span>

- **Spec as Code**
  - 스펙은 composable, executable, testable, interfaces를 가져야 함. 또한 모듈 단위로 ship 가능
  - Type checker처럼 부서 간 스펙 일관성을 유지
  - Linters로 ambiguous language 탐지
  
  <span style="color: grey;">(e.g., Model spec에 unit tests 포함, linters로 인간과 모델 혼란 방지)</span>

<br>


## 4. Lawmakers as Programmers

- **US Constitution as Spec**
  - 헌법은 clear하고 unambiguous한 정책을 담고있으며, versioned amendments judicial review가 grader 역할. 
  - Precedents는 unit tests로 정책을 명확히 하고 강화함.  
  
  <span style="color: grey;">(e.g., 헌법은 인간을 align, judicial review로 준수 여부 평가, precedents로 스펙 강화)</span>

- **Universal Principle**
  - Programmers는 코드 스펙으로 silicon align, product managers는 product specs로 팀 align, lawmakers는 legal specs로 인간 align, prompt writers는 proto-specs로 AI align.  
  
  <span style="color: grey;">(e.g., Prompt 작성자는 AI를 의도와 가치에 맞게 동작하도록 align하는 스펙 작성자)</span>

- **Spec Authors**
  - PM, lawmaker, engineer, marketer 등 스펙을 쓰는 이는 모두 programmer임. 잘 작성된 스펙은 더 빠르고 안전하게 ship 가능.  
  
  <span style="color: grey;">(e.g, 엔지니어가 스펙 작성, 팀과 모델 정렬, 기능 ship)</span>

<br>

## 5. Essence of Engineering

- **Not about Code**
  - 엔지니어링은 단순히 코드를 작성하는 것이 아니라, 인간 문제를 해결하는 software solutions의 precise exploration임. Coding은 skill이지 end goal이 아님
  
  <span style="color: grey;">(e.g., disparate machine encodings에서 unified human encoding으로 전환)</span>

- **Actionable Takeaways**
  - 스펙부터 시작하고, success criteria를 정의하며, 명확성 을 중심으로 논의하기
  - 스펙을 executable하게 만들고 모델 또는 스펙에 자체를 테스트하기
  
  <span style="color: grey;">(e.g., AI 기능 스펙 작성, 모델에 입력, 목표 달성 여부 테스트)</span>

- **Future IDE**
  - 미래의 IDE는 Integrated Thought Clarifier가 될 것이며, ambiguity를 제거하고 인간과 모델 모두에게 의도를 명확히 전달하는 역할을 한다.
  
  <span style="color: grey;">(e.g., IDE가 모호한 스펙 언어 감지, 명확화 요청)</span>

## 6. Closing Request

- **Aligning Agents**
  - 대규모 에이전트 align은 스펙이 필수임. “You never told it what you wanted, maybe you never understood it.”  
  
  <span style="color: grey;">(e.g., OpenAI의 agent robustness team, 안전한 AGI 위해 스펙 필요)</span>
- **Call to Action**
  - Agent robustness team에 합류하여 인류를 위한 안전한 AGI deliver 돕기


<br><br>
---
title: "Statistical Detection: Binoculars & Log-Likelihood"
categories:
  - ai
tags:
  - AI
  - AIDetect
  - Statistics
  - Perplexity
  - Binoculars
toc: true
toc_sticky: true

date: 2026-01-09 21:00:00
last_modified_at: 2026-01-09 21:00:00
comments: true
use_math: true
---

# Topic
- 별도의 모델 학습 없이, LLM의 Perplexity(통계적 수치)만으로 AI 생성 여부를 판별하는 기법을 이해한다.
- 탐지 알고리즘 Binoculars의 원리와 'Contrastive Scoring'의 개념을 이해한다.

<br>

**[ 참고 링크 🔗 ]**
* Hans et al. (2024). **Spotting LLMs with Binoculars: Zero-Shot LLM Detection through Contrastive Scoring.** [arXiv:2401.12070](https://arxiv.org/abs/2401.12070)

<br><br>

### 1. Statistical AI Text Detection

- Supervised Learning 모델이 AI가 쓴 글의 스타일 자체를 학습한다면, Statistical detection은 특정 문장을 LLM이 얼마나 쉽게 예측할 수 있을지를 측정함
- **Zero-shot**: 별도의 탐지 모델을 학습하지 않음

<br>

1. **Log-Likelihood**
    - 모델이 특정 문장을 생성할 확률 $P(x)$에 로그를 취한 값 
    - 언어 모델은 학습 데이터 분포에 가까운 문장일수록 높은 확률을 부여함
    - 특히 AI가 생성한 문장은 모델이 익숙해하는 토큰들의 조합으로 만들어지기 때문에, 다시 그 모델로 평가하면 매우 높은 확률값을 얻게 됨

2. **Perplexity, PP**
    - 모델이 문장을 읽을 때 느끼는 불확실성을 수치화한 것
    
    $$PP(X) = P(x_1, x_2, \dots, x_n)^{-\frac{1}{n}}$$
    
    - **해석**
        - Perplexity가 낮다 → 모델이 익숙해하고, 문장의 다음 단어 예상 쉬워함
        - Perplexity가 높다 → 모델이 낯설어하고, 문장의 다음 단어 예측 어려워함
        - AI가 쓴 글은 모델 입장에서 뻔하기 때문에, 보통 사람이 쓴 글보다 낮은 Perplexity가 나옴

<br><br>

### **2. Binoculars**

Perplexity 하나만으로는 부족함. 
- 전문 용어가 많은 글은 AI가 써도 Perplexity가 높게 나올 수 있음(전문 용어는 일반 단어보다 출현 빈도가 낮아 통계적 확률도 낮고 단어가 여러 개의 sub-token으로 쪼개질 가능성 높음). 
- 이러한 도메인 편향을 해결하기 위해 Binoculars 기법을 사용함.

<br>

1. **Contrastive Scoring**
    - 하나의 모델로만 측정하는 것이 아니라, 두 모델의 점수를 비교하여 이 문장이 단순히 어려운 문장인지, 아니면 AI 선호 패턴인지를 가려냄.
    
2. **Observer ($M_1$) & Performer ($M_2$)**
    - **Observer:** 문장을 읽고 각 토큰의 확률 분포를 계산하는 역할
    - **Performer:** 실제로 문장을 생성했을 때의 특성을 시뮬레이션하는 모델
    - 두 모델 사이의 확률 분포 차이(Cross-Entropy)를 계산하여, 그 차이가 특정 threshold보다 낮으면 AI가 생성한 문장으로 간주



<br><br>

### **3. 왜 AI는 자신의 글을 쉽게 알아보는가?**

AI는 글을 쓸 때 가장 확률이 높은 단어를 선택(Deciphering/Greedy Search). 

- **인간 글:** 감정, 창의성, 혹은 의도적인 문법 파괴가 있어 통계적으로 예측하기 힘듦. (High Perplexity)
- **AI 글:** 항상 통계적으로 가장 무난하고 안전한 단어를 사용, 예측 쉬우니 매우 낮은 불확실성을 가짐. (Low Perplexity)

<br><br>

### **4. Binoculars 알고리즘 구조**

Binoculars 알고리즘 구조를 코드로 알아보자.

```python
# [Pseudo-code] Binoculars 기반 Contrastive Perplexity 계산 로직

FUNCTION calculate_binoculars_score(input_text):
    # 1. 두 모델(Observer, Performer)로부터 Logits 추출
    Logits_M1 = Model_Observer.GetLogits(input_text)
    Logits_M2 = Model_Performer.GetLogits(input_text)
    
    # 2. 개별 토큰에 대한 Log-Likelihood 계산
    Log_P = CalculateLogProbability(input_text, Logits_M1)
    
    # 3. 모델 간 Cross-Entropy 계산
    # 문장이 단순히 어려운 것인지, 특정 패턴을 따르는지 비교
    Contrastive_Score = Mean(Log_P) / Mean(CrossEntropy(Logits_M1, Logits_M2))
    
    RETURN Contrastive_Score
END

# 판정 로직
IF Final_Score < Binoculars_Threshold:
    RESULT = "AI-Generated"
ELSE:
    RESULT = "Human-Written"
```

<br><br>

### **5. Zero-Shot AI Text Detection 특징**

1. **범용성**
- 새로운 모델이 출시되어도 학습 데이터를 수집해서 재학습 시킬 필요 없음
- 언어나 문법에 구애받지 않고 모델의 확률값(logits)만 있다면 어디든 적용할 수 있음

2. **탐지 근거**
- 인간의 직관이나 스타일에 의존하는 대신 텍스트의 통계적 분포를 분석하여, 탐지 결과에 대해 객관적인 수치와 근거를 제시할 수 있게 함(perplexity와 확률 분포 대조)

3. **Adversarial Attacks 취약성**
- Sampling: AI에게 의도적으로 통계적으로 나올 확률이 낮은 확률의 단어를 섞어서 써달라고 명령하거나(Low-logprob sampling), 특이한 프롬프트를 사용하면 Perplexity가 상승하여 탐지를 피할 수 있음.
- 인간 개입: Word-smithing(e.g.,AI가 생성한 초안을 갖고 사람이 직접 문장 구조를 바꾸거나 단어를 교체함)을 거치면 통계적 특징이 파괴됨

<br><br>
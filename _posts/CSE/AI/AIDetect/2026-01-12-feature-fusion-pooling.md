---
title: "Feature Fusion & Adaptive Pooling"
categories:
  - ai
tags:
  - AI
  - AIDetect
  - FeatureFusion
  - AdaptivePooling
  - Ensemble
  - DeepLearning
toc: true
toc_sticky: true

date: 2026-01-12 21:00:00
last_modified_at: 2026-01-12 21:00:00
comments: true
use_math: true
---

# Topic
- 여러 탐지 신호(Feature)를 하나로 결합하여 AI 생성 텍스트 탐지 성능을 극대화하는 전략을 이해한다.
- Max Pooling과 Adaptive Pooling의 차이를 파악하고, 다중 모델 앙상블(Ensemble) 기법을 학습한다.

<br>

**[ 참고 개념 ]**
* Ensemble Learning: 여러 개의 모델을 결합하여 개별 모델보다 나은 성능을 얻는 기법
* Feature Fusion: 서로 다른 Feature Space의 정보를 통합하는 과정

<br><br>

### 1. Feature Fusion

AI 탐지에는 지도 학습(RoBERTa), 통계적 수치(Binoculars), 그리고 언어 모델의 특이성(Surprise score) 등 다양한 지표가 존재한다. 그러나 단일 지표만 사용할 경우 특정 데이터셋에 Overfitting되거나 탐지가 잘 되지 않을 수 있다.

- feature fusion 의미
  - AI 텍스트 탐지에서 서로 다른 탐지 방식으로부터 얻은 여러 지표(feature)를 하나의 통합된 판단 모델에 입력하여 최종 판별을 수행하는 구조
- 특징
  - 상호 보완성: 통계적 방법이 놓치는 문맥적 흐름을 지도 학습 모델이 잡아내고, 지도 학습이 놓치는 미세한 확률 분포를 통계 모델이 보완함
  - Robustness: 여러 신호를 합치면 AI에게 가해지는 Adversarial Attack도 더 잘 견딤



<br><br>

### 2. Pooling Strategies: Max vs. Adaptive

다양한 레이어나 모델에서 추출된 feature는 보통 토큰 단위, 문장 단위, 레이어 단위로 분산되어 존재한다.
따라서 이를 하나의 고정 길이 벡터로 pooling하는 과정이 필수이며, 이 pooling 방식이 탐지기의 민감도와 안정성을 좌우한다.

1. **Max Pooling**
    - 입력 feature 벡터가 다음과 같이 주어질 때:

      $$
      X = \{x_1, x_2, x_3, ..., x_n\}
      $$

      Max Pooling은 전체 feature 중 가장 큰 값 하나만을 선택한다.

      $$
      v_{\text{max}} = \max(x_1, x_2, x_3, ..., x_n)
      $$
    - 가장 강한 신호(가장 AI스러운 특징)만 선택하여 결과에 반영
    - **장점**: 텍스트 중 단 한 부분만 AI가 썼더라도 이를 민감하게 포착할 수 있음
    - **단점**: 정보의 손실이 크고 전체적인 문맥 정보를 무시할 수 있음

2. **Adaptive Pooling**
  
    - 입력 feature 벡터가 다음과 같이 주어질 때:

      $$
      X = \{x_1, x_2, x_3, ..., x_n\}
      $$

      각 feature에 대해 모델이 중요도 가중치  $alpha_i$ 를 학습한다.

      $$
      \alpha_i = \frac{\exp(e_i)}{\sum_{j=1}^{n} \exp(e_j)}
      $$

      여기서 $e_i$ 는 attention score이다.

      최종 pooled vector는 가중합으로 계산된다.

      $$
      v_{\text{adaptive}} = \sum_{i=1}^{n} \alpha_i x_i
      $$
    - 입력 feature들의 중요도를 모델이 학습하여 탐지에 유용한 부분에 가중치를 더 많이 부여하는 방식
    - **원리**
      - 문장, 토큰, 레이어별 feature에 attention weight를 부여
      - 탐지에 민감한 영역에 높은 가중치 할당
      - 중요도가 낮은 부분은 자동으로 억제
    - **효과**: 문장의 길이나 구조에 구애받지 않고 비교적 안정적인 탐지가 가능함

<br><br>

### 3. 모델의 어느 부분이 가장 민감한가?

Transformer 기반 모델의 내부 Layer 중 특정 부분은 AI 탐지에 더 민감한 feature를 담고 있다.
- **Lower Layers**: 문법적 구조나 토큰 수준의 통계를 반영
- **Middle-Upper Layers**: 문장의 의미적 일관성과 스타일(AI같은 문체)을 담고 있는 경우가 많아, 주로 이 부분의 feature를 추출하여 fusion에 활용

<br><br>

### 4. Detection Arsenal: 다중 신호 통합 구조

다양한 탐지 기법의 스코어를 합치는 fusion 로직을 코드로 보자.

```python
# [Pseudo-code] 다중 탐지 신호 퓨전 및 앙상블 로직

FUNCTION fuse_detection_scores(text):
    # 1. 개별 탐지 엔진으로부터 스코어 추출
    Score_Supervised = RoBERTa_Detector.Predict(text)  # 지도 학습 기반
    Score_Statistical = Binoculars_Engine.Calculate(text) # 통계 기반 (Perplexity)
    Score_Surprise = Surprise_Module.Analyze(text) # RLHF 및 엔트로피 분석
    
    # 2. Feature Fusion
    # 각 지표의 중요도에 따라 가중치를 부여하거나 Adaptive Pooling 적용
    Feature_Vector = Combine([Score_Supervised, Score_Statistical, Score_Surprise])
    
    # 3. Meta-Classifier
    # 단순 평균이 아닌, 학습된 가중치를 통해 최종 AI 여부 산출
    Final_Probability = Sigmoid(Weight_Vector * Feature_Vector + Bias)
    
    RETURN Final_Probability
END

# 판정
IF Final_Probability > Fusion_Threshold:
    PRINT "Result: AI-Generated Content Detected"
ELSE:
    PRINT "Result: Human-Written Content"
```
<br><br>

### 5. fusion의 특징 및 장단점

- 성능 극대화
  - 한 모델이 놓치는 AI 글을 다른 모델이 잡아내기 때문에, 단일 모델 대비 Accuracy와 F1-Score가 향상됨.

- 복잡도 증가
  - 여러 모델을 동시에 로드해야 하므로 메모리 사용량이 늘어나고 추론 속도(Latency)가 느려질 수 있음

- 해석 가능성(Interpretability)
  - 각 탐지 지표가 따로 존재하므로 어떤 수치 때문에 AI로 판단했는지를 근거로 들 수 있음

<br><br>
---
title: "TTT & Attention Sentinel"
categories:
  - ai
tags:
  - AI
  - AIDetect
  - TestTimeTraining
  - Attention
  - AnomalyDetection
  - DeepLearning
toc: true
toc_sticky: true

date: 2026-01-16 21:00:00
last_modified_at: 2026-01-16 21:00:00
comments: true
use_math: true
---

# Topic
- 고정된 탐지 모델의 한계를 극복하기 위한 Test-Time Training 기법을 이해한다.
- Transformer Attention 패턴을 활용한 AI 생성 텍스트의 이상치 탐지 원리를 분석한다.

<br>

**[ 참고 개념 ]**
* Test-Time Training (TTT): 추론 시점에 입력 데이터로 모델을 미세 조정하는 기법
* Attention Map: Transformer가 토큰 간 관계를 계산할 때 생성하는 가중치 행렬
* Anomaly Detection: 정상 분포에서 벗어난 패턴을 이상치로 탐지하는 기법

<br><br>

---

## 1. 고정 탐지기의 한계와 분포 이동 문제

기존 AI 생성 텍스트 탐지 모델은 학습이 완료된 이후에는 고정된 파라미터로만 동작한다.
그러나 실제 환경에서는 다음과 같은 문제가 지속적으로 발생한다.

- 새로운 LLM 아키텍처 등장
- RLHF 스타일 변화
- 패러프레이즈 및 스타일 변조 공격
- 데이터 분포 이동(Distribution Shift)

즉, 학습 데이터 분포와 실제 입력 분포가 달라지는 순간 탐지 성능은 급격히 저하된다.

이를 해결하기 위한 접근법이 바로 Test-Time Training (TTT) 이다.

<br><br>

## 2. Test-Time Training (TTT)

TTT는 모델이 예측만 수행하는 것이 아니라,
입력 텍스트를 기반으로 스스로 적응하도록 만드는 구조이다.

기존 추론은 고정 파라미터 $θ$에 대해 다음과 같이 수행된다.

$$
y = f(x; \theta)
$$

TTT는 추론 시점에 self-supervised loss를 정의하고,
모델 파라미터를 업데이트한 뒤 예측을 수행한다.

$$
\theta' = \theta - \eta \nabla_\theta \mathcal{L}_{ttt}(x)
$$

$$
y = f(x; \theta')
$$

이 방식의 핵심은 라벨 없이도 학습 가능한 proxy loss를 정의하는 것이다.

<br><br>

## 3. TTT 기반 탐지 파이프라인 구조

TTT 기반 탐지기는 다음과 같은 구조로 동작한다.

1. 입력 텍스트 인코딩
2. Self-supervised objective 계산
3. 제한된 step 수만큼 모델 업데이트
4. 적응된 모델로 최종 판정

이를 알고리즘 구조로 표현하면 다음과 같다.

```python
# [Pseudo-code] Test-Time Training 기반 탐지기

FUNCTION TTT_Detect(text):

    # 1. 입력 텍스트 인코딩
    embeddings = Encoder(text)

    # 2. Self-supervised proxy loss 계산
    loss_ttt = ProxyLoss(embeddings)

    # 3. 제한된 step 수만큼 미세 조정
    FOR step in range(K):
        theta = theta - lr * grad(loss_ttt)

    # 4. 적응된 모델로 최종 예측
    score = Classifier(embeddings; theta)

    RETURN score
END
```
이 구조의 특징은 다음과 같다.
- 사전 학습 모델을 유지한 채, 일부 파라미터만 제한적으로 업데이트
- 과적합 방지를 위해 step 수와 학습률을 엄격히 제한
- 추론 시점마다 입력 분포에 맞게 모델이 자동 적응

<br><br>

### 4. Attention Sentinel: AI 사고 패턴 추적
Transformer 기반 LLM은 텍스트를 생성할 때 각 토큰 간 관계를 Attention Map으로 표현한다.

$$
A \in \mathbb{R}^{n \times n}
$$
 
여기서
$A_{ij}$ 는 토큰 $i$ 가 토큰 $j$ 에 부여하는 Attention 가중치이다.
이 Attention Map에는 모델의 사고 경로(thought trajectory)가 그대로 드러난다.

<br>

**[ AI와 인간 텍스트의 Attention 특성 ]**
<br>AI가 생성한 텍스트는 다음과 같은 통계적 특성을 보이는 경향이 있다.
- 국소적인 반복 구조
- 과도하게 균일한 Attention 분포
- 자기 참조Self-attention 비율 증가
- 문단 전체에 걸친 장기 의존성 패턴 과도화

반면 인간 텍스트는
- 주제 전환이 잦음
- 문단 간 Attention 흐름이 비선형적
- 토큰 간 의존 구조가 불규칙적이다.
<br>

Attention Sentinel은 이 차이를 이상치 탐지 문제로 재정의한다.

<br><br>

### 5. Attention Map 기반 이상치 계산
Attention Sentinel은 다음과 같은 통계량을 기반으로 이상치를 계산한다.
- Attention Entropy
- Diagonal Dominance
- Long-range Dependency Ratio
- Repetition Score

<br>이를 하나의 anomaly score로 통합한다.

``` python
# [Pseudo-code] Attention Sentinel

FUNCTION AttentionSentinel(text):

    # 1. Attention Map 추출
    A = Transformer.ExtractAttention(text)

    # 2. 통계량 계산
    entropy = AttentionEntropy(A)
    diagonal = DiagonalDominance(A)
    repetition = RepetitionScore(A)
    long_range = LongRangeDependency(A)

    # 3. 이상치 스코어 통합
    anomaly_score = Combine(
        entropy,
        diagonal,
        repetition,
        long_range
    )

    RETURN anomaly_score
END
```

이 구조는 모델 내부의 사고 패턴을 직접 분석한다는 점에서
기존 확률 기반 탐지기와 본질적으로 다르다.

<br><br>

### 6. Adaptive Detection Engine: TTT + Attention Sentinel
TTT와 Attention Sentinel을 결합하면, 고정된 분류기가 아니라 입력 분포에 따라 동작이 달라지는 탐지 구조를 만들 수 있다.

```python
# [Pseudo-code] Adaptive Detection Engine

FUNCTION AdaptiveDetect(text):

    # 1. Attention 기반 이상치 분석
    anomaly_score = AttentionSentinel(text)

    # 2. Test-Time Training 기반 적응
    ttt_score = TTT_Detect(text)

    # 3. Fusion
    final_score = Fusion(anomaly_score, ttt_score)

    RETURN final_score
END
```
<br><br>

### 7. TTT & Attention Sentinel의 특징
1. 장점
- Adaptivity: 새로운 LLM 스타일에도 빠르게 분포 적응 가능
- Robustness: 패러프레이즈, 문체 변조 공격에 강함
- Interpretability: Attention 패턴 기반으로 탐지 근거 제시 가능

2. 단점
- 계산 비용 증가
- 추론 시 학습이 포함되므로 Latency 증가
- 구현 난이도 상승
- 안정성 제어 및 파이프라인 설계 복잡

<br><br>

### 8. 정리
기존 탐지 모델은 학습이 끝난 이후에는 고정된 파라미터로만 동작하는 구조였다.
이 방식은 입력 분포가 변하지 않는다는 가정 하에서는 유효하지만, 실제 환경에서는 빠르게 성능이 저하되는 문제가 있다.
TTT는 추론 시점에 입력 데이터를 이용해 모델을 적응시키는 방법이고, Attention Sentinel은 Attention 패턴을 이용해 텍스트의 구조적 특성을 분석하는 방식이다.
두 접근법을 결합하면, 분포 이동과 스타일 변화에 더 강한 탐지기를 구성할 수 있다.
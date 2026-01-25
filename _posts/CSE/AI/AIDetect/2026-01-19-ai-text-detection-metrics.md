---
title: "AI Text Detection Model Evaluation Metrics"
categories:
  - ai
tags:
  - AI
  - AIDetect
  - TextDetection
  - ModelEvaluation
  - Classification
  - Metrics
  - MachineLearning
  - DeepLearning
toc: true
toc_sticky: true

date: 2026-01-19 21:00:00
last_modified_at: 2026-01-19 21:00:00
comments: true
use_math: true
---
<br>

# Topic
- AI 생성 텍스트 탐지 모델의 성능 평가 지표

<br>
## 1. 서론

AI 생성 텍스트 탐지는 인간이 작성한 텍스트와 AI가 생성한 텍스트를 구별하는 이진 분류 문제임. 단순히 정확도만으로는 모델의 진정한 성능을 파악하기 어려우므로, 특히 클래스 불균형, Test-Time Training 등을 다각적으로 따져야 함.

<br><br>

## 2. Confusion Matrix

모든 분류 지표의 기초가 되며, 다음과 같이 구성됨.

|  | 실제 AI 텍스트 | 실제 인간 텍스트 |
|---|---|---|
| **예측 AI 텍스트** | TP (True Positive) | FP (False Positive) |
| **예측 인간 텍스트** | FN (False Negative) | TN (True Negative) |

- **TP (True Positive)**: AI 텍스트를 AI로 정확히 탐지
- **TN (True Negative)**: 인간 텍스트를 인간으로 정확히 분류
- **FP (False Positive)**: 인간 텍스트를 AI로 잘못 탐지 (오탐, Type I Error)
- **FN (False Negative)**: AI 텍스트를 인간으로 잘못 분류 (미탐, Type II Error)

### 예시

Copy Killer 등 표절 검사 시스템에서는 FP의 비용이 높음(사람이 직접 작성한 글을 AI 작성으로 판단함). <br>
소셜 미디어 등의 거짓 정보 탐지에서는 FN의 비용이 높음(AI가 생성한 가짜 뉴스를 탐지하지 못함).

<br><br>

## 3. 기본 평가 지표

### 3.1 정확도 (Accuracy)

전체 샘플 중 올바르게 분류한 샘플의 비율.

$$
\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}
$$

**장점**: 직관적이고 이해하기 쉬움  
**단점**: 클래스 불균형이 있을 때 왜곡될 수 있음

**예시**: 데이터셋에서 AI 텍스트가 10%, 인간 텍스트가 90%라면, 모든 샘플을 인간으로 예측해도 90%의 정확도를 얻음. 이 경우 엉망인 모델이더라도 정확도가 높게 나올 수 있음.

<br>

### 3.2 정밀도 (Precision)

AI 텍스트로 예측한 것 중 실제로 AI 텍스트인 비율.

$$
\text{Precision} = \frac{TP}{TP + FP}
$$

**의미**: AI라고 판정한 것들의 신뢰성

**활용 예시**
- 학술 논문 검증 시스템: AI라고 판단했을 때 정말 AI일 가능성이 높아야 함
→ 사람 글을 AI로 잘못 판단하면 학생에게 억울한 피해가 생김
- 콘텐츠 필터링: 차단된 콘텐츠가 실제로 문제 있는 경우여야 함
→ 정상적인 글이 잘못 차단되면 사용자 불만이 커짐


<br>

### 3.3 재현율 (Recall) / 민감도 (Sensitivity)

실제 AI 텍스트 중 올바르게 탐지한 비율.

$$
\text{Recall} = \frac{TP}{TP + FN}
$$

**의미**: 실제 AI 텍스트를 잘 잡아내는 정도

**활용 예시**
- 가짜뉴스 탐지: AI가 만든 가짜뉴스를 최대한 많이 찾아내야 함
→ 놓치는 AI 콘텐츠가 많으면 허위정보가 그대로 퍼질 수 있음
- 보안·피싱 탐지: AI로 생성된 피싱 메시지를 가능한 한 빠짐없이 잡아내야 함
→ 일부라도 놓치면 실제 피해로 이어질 수 있음

<br>

### 3.4 특이도 (Specificity)

실제 인간 텍스트 중 올바르게 분류한 비율.

$$
\text{Specificity} = \frac{TN}{TN + FP}
$$

**의미**: 인간 텍스트를 정확히 식별하는 능력  
**중요성**: 오탐률(FPR = 1 - Specificity)과 직결되어 사용자 신뢰도에 영향

<br><br>

## 4. 복합 평가 지표

### 4.1 F1 Score

정밀도와 재현율의 조화 평균.

$$
F1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}
$$

**특징**: Precision과 Recall의 균형을 고려  
**활용**: 클래스 불균형 상황에서 Accuracy보다 신뢰할 수 있는 지표

**프로젝트 적용 예**: 클래스 간 비중 차이를 제거한 데이터로 평가하면, F1 Score가 모델의 실제 탐지 성능을 균형 있게 보여줌.

<br>

### 4.2 F-beta Score

Precision과 Recall에 가중치를 부여한 지표임.

$$
F_\beta = (1 + \beta^2) \times \frac{\text{Precision} \times \text{Recall}}{\beta^2 \times \text{Precision} + \text{Recall}}
$$

- $\beta = 0.5$: Precision에 2배 가중치 (오탐 최소화)
- $\beta = 2$: Recall에 2배 가중치 (미탐 최소화)

**지표 선택 예시**
- 교육 기관: $F_{0.5}$ 사용 → Precision 우선 (억울한 학생 보호)
- 미디어 플랫폼: $F_2$ 사용 → Recall 우선 (허위정보 차단)

<br><br>

## 5. ROC 곡선과 AUC

### 5.1 ROC 곡선 (Receiver Operating Characteristic)

다양한 threshold에서 True Positive Rate와 False Positive Rate의 관계를 시각화한 곡선.

$$
\text{TPR} = \text{Recall} = \frac{TP}{TP + FN}
$$

$$
\text{FPR} = \frac{FP}{FP + TN} = 1 - \text{Specificity}
$$

<br>

### 5.2 AUC (Area Under the Curve)

ROC 곡선 아래 면적으로, 임계값과 무관하게 모델의 전반적인 분류 능력을 측정.

- **AUC = 1.0**: 완벽한 분류
- **AUC = 0.5**: 무작위 분류 (동전 던지기 수준)
- **AUC > 0.9**: 매우 우수
- **AUC > 0.8**: 우수
- **AUC < 0.7**: 개선 필요

**장점**
- 임계값 선택에 독립적
- 클래스 불균형에 비교적 강건
- 여러 모델 비교 시 단일 수치로 성능 파악 가능

**프로젝트 적용 예**: Binoculars, RLHF Surprise, Domain Analysis 등 여러 탐지 전략의 AUC를 비교하여 가장 효과적인 방법을 선택할 수 있음.

<br>

### 5.3 Precision-Recall 곡선

클래스 불균형이 심한 경우 ROC 곡선보다 PR 곡선이 더 유용함.

- **AUPRC (Area Under PR Curve)**: PR 곡선 아래 면적
- 소수 클래스(Positive)의 탐지 성능에 더 민감하게 반응

**언제 사용하는가?**
- AI 텍스트가 전체의 5% 미만인 극도의 불균형 상황
- Positive 클래스의 성능을 핵심으로 보고싶을 때

<br><br>

## 6. 클래스 불균형 고려 지표

### 6.1 Matthews Correlation Coefficient (MCC)

불균형 데이터셋에서도 신뢰할 수 있는 단일 지표.

$$
\text{MCC} = \frac{TP \times TN - FP \times FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}
$$

**범위**: -1 (완전히 틀린 예측) ~ +1 (완벽한 예측)  
**특징**
- 맞춘 경우와 틀린 경우를 모두 함께 고려하는 지표
- 한쪽 클래스만 잘 맞추는 모델을 과대평가하지 않음
- 데이터가 한쪽으로 치우쳐 있어도 성능을 비교적 공정하게 평가 가능
- 무작위로 예측하면 0에 가까운 값이 나와 기준선으로 활용하기 쉬움

**프로젝트 활용 예**: 불균형 데이터셋에서 모델을 학습할 때, 단순 정확도나 F1-score는 데이터 분포 변화에 따라 성능이 좋아 보이거나 나빠 보일 수 있음.
이 경우 언더샘플링 비율을 단계적으로 조정하면서 MCC를 함께 관찰하면, 특정 클래스에만 치우치지 않으면서 전체 예측 품질이 가장 균형 잡힌 지점을 찾을 수 있음.

<br>

### 6.2 Cohen's Kappa

우연에 의한 일치도를 보정한 지표.

$$
\kappa = \frac{p_o - p_e}{1 - p_e}
$$

여기서 $p_o$는 관측된 일치도, $p_e$는 우연에 의한 일치도임.

**해석**
- κ < 0: 무작위 추측보다도 못한 수준
- κ = 0.01~0.20: 우연히 맞춘 것과 거의 차이 없음
- κ = 0.21~0.40: 아주 약간의 의미 있는 일치
- κ = 0.41~0.60: 어느 정도는 신뢰할 수 있는 일치
- κ = 0.61~0.80: 꽤 일관된 판단
- κ = 0.81~1.00: 거의 동일한 판단 수준

<br><br>

## 7. 다중 전략 융합 시 평가

### 7.1 앙상블 모델 평가

여러 탐지 기법을 함께 사용할 경우(예: Surprise Metric + RLHF + Binoculars), 단일 지표 비교보다는 각 기법의 역할과 조합 효과를 중심으로 평가해야 한다.

**개별 전략 성능**
```
Strategy A: Precision=0.85, Recall=0.78, F1=0.81
Strategy B: Precision=0.80, Recall=0.88, F1=0.84
Strategy C: Precision=0.90, Recall=0.70, F1=0.79
```

**융합 방법은 언제 무엇을 쓰는가**
- Voting (다수결)
  - 여러 전략이 동시에 동의한 결과만 채택
  → 극단적인 예측을 줄이고, 전체적으로 안정적인 결과를 얻고 싶을 때
- Weighted Average
  - 신뢰도가 높은 전략에 더 큰 영향력 부여
  → 전략 간 성능 차이가 명확할 때 현실적인 선택
- Stacking
  - 각 전략의 출력을 입력으로 삼아 최적 조합을 학습
  → 데이터가 충분하고, 성능 극대화가 목표일 때

**평가 시 주의점**
- 전략들이 비슷한 기준으로 판단하면, 여러 개를 써도 효과가 크지 않음
- 융합이 항상 성능을 높이지는 않으며, 잘못하면 overfitting 모델이 될 수 있음
- 따라서 단일 성능 수치보다 cross-validation을 통한 일관성을 함께 확인해야 함

<br>

### 7.2 Diversity Metrics

앙상블의 다양성을 측정하는 지표.

(1) **Q-Statistic**: 두 모델의 예측이 얼마나 비슷한지를 나타내는 값.

$$
Q_{i,j} = \frac{N^{11}N^{00} - N^{01}N^{10}}{N^{11}N^{00} + N^{01}N^{10}}
$$

  - 여기서 $N^{11}$은 두 모델이 모두 맞춘 샘플 수.

  - Q = 1: 두 모델이 거의 항상 같은 판단 (사실상 중복 모델, 앙상블 효과 작음)
  - Q = 0: 독립적인 예측
  - Q = -1: 한쪽이 틀릴 때 다른 쪽이 맞는 경향 (매우 높은 보완 효과)

(2) **Disagreement Measure**: 두 모델이 서로 다른 예측을 내린 비율

  $$
  \text{Dis}_{i,j} = \frac{N^{01} + N^{10}}{N^{11} + N^{00} + N^{01} + N^{10}}
  $$

<br><br>

## 8. Test-Time Training (TTT) 평가

모델이 학습 당시 보지 못한 유형의 텍스트를 만났을 때, 추가 학습 없이도 입력에 맞게 스스로 보정하며 성능을 유지할 수 있는지를 평가하는 방식.

<br>

### 8.1 적응 속도 지표

**Initial Performance**: TTT 전 성능  
**Final Performance**: TTT 후 성능  
**Adaptation Rate**: 성능 향상 속도

$$
\text{Improvement} = \frac{\text{Final F1} - \text{Initial F1}}{\text{Initial F1}} \times 100\%
$$

<br>

### 8.2 안정성 지표

**Performance Variance**: 여러 테스트 배치에서의 성능 분산  
**Catastrophic Forgetting**: 기존 학습 데이터에 대한 성능 유지도

<br><br>

## 9. 적용 예시

### 9.1 데이터 분할

**Stratified Split**
```python
# 클래스 비율 유지하며 분할
# Train/Test의 클래스 비율(AI:Human)을 비슷하게 맞춰, 성능 비교가 잘 이루어지도록 함
train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
```

**시간 기반 분할** (예시)
- Train: 2024년 1~6월 데이터
- Validation: 2024년 7~9월 데이터
- Test: 2024년 10~12월 데이터

<br>

### 9.2 교차 검증 (Cross-Validation)

**K-Fold Stratified CV**:
데이터 전체를 K번에 나눠 돌려가며 평가, 매번 클래스 비율을 비슷하게 유지(불균형 상황에서 특히 중요함)


**장점**:
- 데이터 활용 효율성 극대화
- 모델 안정성 검증
- 과적합 여부 파악

**주의점**:
- 계산 비용 K배 증가
- 데이터 누수 방지 (validation에서 본 데이터가 train에 섞이면 안 됨, 검증 데이터의 정보가 학습 과정에 섞이면 점수는 높아지지만 배포 시 망함)

<br>

### 9.3 결과 예시

다음은 여러 탐지 전략의 성능 비교 테이블임(직관적 예시)

| 전략 | Accuracy | Precision | Recall | F1 | AUC | MCC |
|---|---|---|---|---|---|---|
| RoBERTa Baseline | 0.88 | 0.84 | 0.89 | 0.86 | 0.92 | 0.74 |
| Binoculars | 0.91 | 0.88 | 0.92 | 0.90 | 0.95 | 0.81 |
| RLHF Surprise | 0.89 | 0.91 | 0.85 | 0.88 | 0.93 | 0.77 |
| Domain Analysis | 0.87 | 0.82 | 0.90 | 0.86 | 0.91 | 0.73 |
| **Fusion (Weighted)** | **0.94** | **0.93** | **0.94** | **0.93** | **0.97** | **0.87** |

**분석**
- Binoculars: 가장 균형잡힌 성능, 높은 AUC
- RLHF Surprise: 최고 정밀도, 오탐 최소화
- Domain Analysis: 높은 재현율, 미탐 최소화
- Fusion: 개별 전략의 장점 결합으로 최고 성능

<br>

### 9.4 언더샘플링 비율에 따른 성능 변화

언더샘플링 비율을 조정하며 성능 변화를 살펴본 예시

| Ratio | Train 분포 (AI:Human) | F1 | Precision | Recall | MCC |
|---|---|---|---|---|---|
| 0.5 | 1:2 | 0.84 | 0.89 | 0.80 | 0.71 |
| 1.0 | 1:1 | 0.88 | 0.87 | 0.89 | 0.77 |
| 1.5 | 3:2 | 0.86 | 0.83 | 0.90 | 0.74 |
| 2.0 | 2:1 | 0.83 | 0.80 | 0.87 | 0.68 |

**분석**
- 1:1 비율에서 MCC와 F1이 최대
- 지나친 언더샘플링(2.0) 시 Precision 하락

<br><br>

## 10. 평가 지표 선택 가이드

### 10.1 상황별 권장 지표

| 질문        | 지표                |
| --------------------- | ---------------------- |
| 데이터가 거의 균형인가?         | Accuracy, F1           |
| 한쪽 클래스가 조금 더 많은가?     | F1, AUC                |
| 한쪽 클래스가 압도적으로 많은가?    | MCC, AUPRC             |
| 잘못 잡는 것(FP)이 특히 위험한가? | Precision, Specificity |
| 놓치는 것(FN)이 특히 위험한가?   | Recall, Sensitivity    |
| 아직 임계값을 못 정했는가?       | AUC, AUPRC             |
| 여러 모델을 섞어 쓰는가?        | MCC + Diversity        |
| 운영 중 입력이 계속 변하는가?     | Adaptation Rate (TTT)  |


<br>

### 10.2 통합 평가 대시보드 예시

```
=== Model Performance Dashboard ===

Core Metrics:
├─ Accuracy:   0.92
├─ Precision:  0.89
├─ Recall:     0.94
├─ F1 Score:   0.91
└─ MCC:        0.83

Threshold-Independent:
├─ AUC-ROC:    0.96
└─ AUC-PR:     0.93

Confusion Matrix:
         Predicted
         AI    Human
Actual AI    940    60
     Human   110   890

Cost Analysis:
├─ False Positives: 110 (오탐률: 11%)
├─ False Negatives:  60 (미탐률:  6%)
└─ Error Cost: 110×C_fp + 60×C_fn
```

<br><br>

## 11. 흔한 실수와 함정

### 11.1 평가 데이터 누수

**문제**: Train/Validation split 전에 전처리를 수행하면 정보 누수 발생

**잘못된 예**
```python
# 전체 데이터에 정규화 적용함
scaler.fit(all_data)
normalized_data = scaler.transform(all_data)
train, valid = split(normalized_data)
```

**올바른 예**
```python
# Train에만 fit, Valid는 transform만
train, valid = split(data)
scaler.fit(train)
train_normalized = scaler.transform(train)
valid_normalized = scaler.transform(valid)
```

<br>

### 11.2 테스트 세트 재사용

하이퍼파라미터 튜닝에 Test 세트를 사용하면 과적합 발생

**올바른 구조**
- Train: 모델 학습
- Validation: 하이퍼파라미터 선택
- Test: 최종 성능 평가 (1회)

<br>

### 11.3 Threshold 의존성 무시

Precision/Recall은 Threshold에 민감하므로, 모델 성능 보고 시 어떤 Threshold을 사용했는지 명시해야 함.

<br><br>

## 12. 결론

AI 텍스트 탐지 모델의 성능 평가는 단일 지표에 의존하기보다는, 프로젝트의 목표와 데이터 특성에 맞춰 다차원적으로 접근해야 함.

<br><br>
---
title: "Detecting AI-Generated Text with RoBERTa"
categories:
  - ai
tags:
  - AI
  - AIDetect
  - RoBERTa
  - SupervisedLearning
toc: true
toc_sticky: true

date: 2026-01-07 21:00:00
last_modified_at: 2026-01-07 21:00:00
comments: true
---

# Topic
- RoBERTa 등 encoder 기반 모델이 텍스트의 패턴을 학습하여 AI 생성 여부를 판단하는 메커니즘을 이해한다.
- 모델의 실제 추론(Inference)에서, 긴 문장을 처리하고 최종 확률값이 도출되는 과정을 알아본다.

<br>

**[ 참고 링크 🔗 ]**
* Yinhan Liu, et al. (2019). **RoBERTa: A Robustly Optimized BERT Pretraining Approach.** [arXiv:1907.11692](https://arxiv.org/abs/1907.11692)

<br><br>

### **1. RoBERTa**

1. **RoBERTa란?**
    - RoBERTa는 Transformer Encoder 구조를 기반으로 한 사전 학습 언어 모델로, 대규모의 text corpus에서 문장의 통계적/구조적 패턴을 학습하d도록 설계됨
    - encoder 기반 모델
        - 입력 문장을 한 번에 받아 전체 문맥을 반영한 표현으로 인코딩하는 구조
        - 문장 전체를 대표하는 벡터를 만들 수 있어 분류·판별과 같은 task에 적합
        - 텍스트를 생성하기보다, 주어진 텍스트의 특징을 분석함
2. **Self-Attenttion**
    - Self-Attention은 문장 내 모든 token 쌍 간의 상관관계를 계산하여 각 단어를 주변 문맥이 반영된 고차원 벡터로 재정의함
    - 이 과정에서 모델은 개별 단어보다는 단어 간 관계 구조(의존성, 위치적 역할, 반복 패턴)를 중심으로 문장을 해석함 ⇒ 같은 단어라도 문맥에 따라 서로 다른 벡터를 갖게 됨
3. **Transformer Encoder**
    - 문장을 순차적으로 읽어 처리한다기보다는, 문장 전체를 하나의 입력 단위로 보고 모든 token을 동시에 관계 그래프로 처리함
    - 병렬처리 장점: 문장 전반의 구조적 특징과 분포적 특성을 효과적으로 볼 수 있음.
4. **CLS Token의 역할**
    - CLS=Classification
    - 모든 input token의 맨 앞에 `<s>`라는 특수 token이 존재함
        
      ```
        [ token 분리 예시 ]
        
        Input sentence:
        I like airplanes
        
        Token sequence:
        <s> I ▁like ▁air plane s </s>
        
        <s>   : 문장 시작 token (CLS 역할)
        </s>  : 문장 종료 token
        ▁     : 새로운 단어 시작 의미
        airplanes
              : 사전 통계에 따라 air + plane + s 로 subtoken 분리
      ```
        
    - 이 token이 Attention 과정을 거치며 문장 전체의 특징을 흡수함
    - 여러 Encoder Layer를 통과한 뒤, 최종 Layer에서의 CLS 벡터는 문장 전체를 대표하는 Globla Representation 역할을 함
5. **Binary Classifier 통과 과정**
    - 사전 학습 완료된 RoBERTa의 최종 Layer CLS벡터는 다음의 차원을 가짐
        - RoBERTa-base 768차원
        - RoBERTa-large 1024차원
    - 이 벡터를 Dense(Linear) Layer에 통과시켜 최종적으로 그것이 사람(0)이 만든 것인지 AI(1)가 만든 것인지 가려냄
        
      ```
        
        [ 구조 ]
        
        CLS Vector
        → Linear Layer
        → (Sigmoid 또는 Softmax)
        → P(AI-generated)
        
      ```
        
    - 이때 Classifier는 단순히 문법 오류나 문장의 자연스러움만을 기준으로 판단하지 않고 다음과 같은 확률적·분포적 특성을 종합적으로 고려함
        - 표현 분포의 안정성
        - 문장 간 서술 스타일의 변동 폭
        - 반복적인 구조 및 패턴의 빈도

<br><br>

### 2. Tokenization

1. **Tokenizer의 필요성**
    - 모델은 텍스트를 그대로 이해할 수 없으므로, toeknizer를 통해 텍스트를 token ID Sequence로 변환해야 함
2. **Tokenizer의 역할**
    - Tokenizer는 사전 학습 시점에 만들어진 Subword 단위 분해 규칙을 따름
    - 하나의 단어라도 맥락상 자주 등장하는 형태라면 하나의 token으로 유지되고, 드물거나 복합적인 형태는 여러 개의 Sub-token으로 쪼개짐
3. **Subtoken으로 쪼개는 이유**
    - 모든 단어를 하나의 token으로 유지하면 vocabulary 크기가 기하급수적으로 증가하므로, Sub-token으로 분해하여 제한된 vocabulary로 더 많은 표현을 커버할 수 있게 함
    - AI 생성 텍스트는 특정 Sub-token 조합이 지나치게 안정적으로 반복되는 경향이 있음. 반면 인간이 작성한 텍스트는 철자 변형 / 표현의 비일관성 / 비정형적 단어 선택 등으로 인해 Sub-token 분포 변동성이 더 큼 ⇒ Tokenization 이후 공간에서 탐지의 단서가 됨
    
    ```python
      # [Pseudo-code] 텍스트 수치화 절차 ALGORITHM PrepareInput: INPUT: RawText
      
      # 텍스트를 모델 고유의 토큰 ID로 인코딩
      Tokens = Tokenizer.Encode(RawText, add_special_tokens=False)
      
      # 이후 모델 규격에 맞는 입력 벡터(Input IDs) 생성
      RETURN Tokens
      END
    ```
    
<br><br>

### 3. Chunking

1. **배경**
    - RoBERTa 같은 모델은 한 번에 읽을 수 있는 토큰 수가 제한되어 있는데(일반적으로 최대 512 tokens), 실제 탐지해야 할 글은 이보다 훨씬 긴 경우가 많음. 뉴스기사/보고서/에세이/블로그 글 등등을 생각하면 제한을 가뿐히 넘어버림
    - 입력 길이를 초과한 텍스트를 그대로 모델에 넣으면 뒤쪽 문장이 잘리거나 아예 모델 입력 자체가 불가할 수 있음
2. **해결책** 
    - 긴 텍스트를 한꺼번에 넣지 않고 쪼개어 여러 개의 chunk를 만듦
    - 이렇게 분할된 각 chunk는 문맥적으로는 부분 정보만 담고 있지만 모델 입장에서는 완전한 하나의 입력 문장으로 처리됨
    
    ⇒ 각 chunk를 독립적으로 모델에 통과시킨 뒤 그 결과들을 종합. 각 chunk는 독립적으로 AI 생성 확률을 산출함
    
3. **Chunking시 고려할 것**
    - 토큰 기준 분할
        - 동일한 단어라도 Sub-token 개수가 다를 수 있기 때문에, 단어 수가 아니라 token 수 기준으로 분할해야 함
    - 의미 단위 유지
        - 가능한 경우 문장 또는 문단 경계를 기준으로 나누는 것이 이상적. 문맥이 강제로 끊기면 CLS 표현의 신뢰도가 낮아질 수 있음.
    - 과도한 overlap 회피
        - Sliding window 방식도 가능하지만, detection task에서는 불필요한 중복 판단을 유발할 수 있음

    ```python
    # [Pseudo-code] 긴 텍스트 chunking 로직

    FUNCTION chunk_text(text, max_length=400):
        Words = text.split()
        Chunks = []
        CurrentChunk = []

        FOR word in Words:
            # 현재 조각의 token 길이를 체크하며 모델 입력 제한치를 넘는지 확인
            IF CurrentTokenCount + GetTokenCount(word) > max_length:
                Chunks.Append(CurrentChunk)
                Reset(CurrentChunk)

            Add word to CurrentChunk

        RETURN Chunks
    ```

<br><br>

### 4. Robust Decision Logic

1. **단일 확률값은 부족함**
    - Chunking을 적용하면 하나의 문서는 여러 개의 chunk로 분해되고, 각 chunk는 서로 독립적인 AI 생성 확률값을 갖게 됨
    - 그러나 실제 데이터에서는 다음과 같은 상황이 흔함
        - 일부는 사람, 일부는 AI / AI 초안 위에 사람이 후편집
    - 이때 하나의 chunk 확률만으로 전체 문서를 판단하면 다음 문제 발생
        - 일부 AI 구간 때문에 전체를 AI가 생성했다고 오탐
        - 일부 인간 구간 때문에 AI 생성 문서를 놓침
2. **Threshold 기반 다중 판정 로직**
    - 이러한 문제를 줄이기 위해 각 chunk의 결과를 Threshold 기준으로 종합하는 방식을 사용함
3. **특징**
    - 보수적(애매하면 인간으로 간주하도록 함)
        - AI 생성 텍스트 탐지에서 가장 치명적인 오류는 사람이 쓴 글을 AI로 잘못 판단하는 경우(False Positive)임
        - 따라서 일반적으로 Threshold를 0.5보다 높게, 0.7 내외의 보수적인 값으로 설정함
    - 결과 종합
        - Chunk별 확률값을 단순 평균하지 않고 다음과 같은 단계적 판정 로직을 적용함
            - **Case 1: 모든 chunk의 확률이 Threshold 이상**
                - 문서 전체가 AI 생성일 가능성이 매우 높다고 판단
            - **Case 2: 모든 chunk의 확률이 Threshold 미만**
                - 문서 전체를 인간이 작성했다고 판단
            - **Case 3: chunk별 결과가 섞여 있는 경우**
                - 일부만 AI 스타일을 보인 상황으로 해석
                - 이때는 확정 판단을 바로 하지 않고 전체 chunk 확률의 평균값을 최종 판단 지표로 사용함

    ```python
    # [Pseudo-code] 여러 chunk 기반 최종 판정

    ALGORITHM FinalInference:
        INPUT: TextChunks, Threshold=0.7
        
        Scores = []
        FOR chunk in TextChunks:
            # 각 chunk에 대한 AI 생성 확률값 도출
            Score = Model.Inference(chunk)
            Scores.Append(Score)
            
        # [Case 1] 모든 chunk가 기준치 이상인 경우 -> AI 확실
        IF Min(Scores) >= Threshold:
            FinalLabel = 1
        # [Case 2] 모든 chunk가 기준치 미만인 경우 -> Human 확실
        ELIF Max(Scores) < Threshold:
            FinalLabel = 0
        # [Case 3] chunk별 결과가 엇갈리는 경우 -> 평균값으로 신중하게 판단
        ELSE:
            FinalLabel = Mean(Scores)
            
        RETURN FinalLabel

    ```

<br><br>

### 5. Evaluation & Submission

1. **Validation 일관성**
    - 학습된 모델을 검증할 때도 훈련 및 추론 단계와 동일한 Chunking 전략과 Decision Logic을 반드시 적용해야 함.
    - Validation 단계에서만 다른 방식으로 처리하면?
        - 학습 시점과 평가 시점의 입력 분포가 달라지고 실제 운영 환경에서의 성능을 정확히 반영하지 못하게 됨
        
2. **Accuracy만 보지 않음**
    - 단순 Accuracy는 전체 성능을 직관적으로 보여주지만, AI 생성 텍스트 탐지 문제에서는 False positive rate때문에 한계가 있음
    - False Positive가 높을 경우,
        - 인간이 작성한 글인데 AI로 오해받음
        - 시스템 신뢰도가 급격히 하락할 가능성도 있음
    
    ⇒ 따라서 Threshold 변화에 따른 FP/FN trade-off를 잘 확인해야함
    
3. **Submission 단계**
    - 최종 테스트 데이터에 대해서는 동일한 FinalInference 로직을 적용하여 문서 단위 확률값을 산출함
    - 이 확률값을 기준으로 다음을 수행함
        - 적당한 Threshold를 적용해 binary label 생성
        - 확률값 자체를 이용하여 성능 평가

    ```python
    # [Pseudo-code] 최종 데이터 생성
    FOR each test_data:
        PredictedValue = FinalInference(test_data)
        
        # 최종 labeling (threshold 기준)
        ResultLabel = (PredictedValue >= Threshold) ? 1 : 0
        SaveToCSV(ResultLabel)
    END
    ```

<br><br>
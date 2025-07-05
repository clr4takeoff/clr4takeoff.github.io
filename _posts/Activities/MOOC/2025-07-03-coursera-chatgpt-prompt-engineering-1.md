---
title: "[Coursera] ChatGPT Prompt Engineering for Developers(1)"
categories:
  - mooc
  - activ
tags:
  - coursera
  - PromptEngineering
  - DeepLearning.AI
toc: true
toc_sticky: true

date: 2025-07-03 22:00
last_modified_at: 2024-07-03 22:00
comments: true
---

<span style="color: gray; font-style: italic;">
Based on the “ChatGPT Prompt Engineering for Developers” course by DeepLearning.AI on Coursera.
</span>

<br>

# Introduction
- Large Language Models (LLMs)에는 두 가지 유형이 있다.
    - **Base LLM**
    - **Instruction-tuned LLM**

<br>

**1. Base LLM**

- 훈련 방식: 대규모 텍스트 데이터 기반으로 단순히 다음 단어를 예측하도록 훈련됨
- 예시
    - "Once upon a time, there was a unicorn" → "that lived in a magical forest with all her unicorn friends"
    - 질문: "What is the capital of France?" → 관련 질문 리스트나 퀴즈 질문 형식으로 이어질 가능성 있음
- 특징
    - 단어 예측에 집중하기 때문에 질문을 이해하고 답하기보다는, 확률적으로 다음에 나올 법한 텍스트를 생성함

<br>

**2. Instruction-tuned LLM**

- 훈련 방식: 사용자 지시를 따르도록 추가 훈련됨
    - 방법: Base LLM에 추가로 지시-응답 쌍을 학습시키고, RLHF (Reinforcement Learning with Human Feedback) 기법을 활용하여 개선
        - RLHF: 사람이 여러 응답 중 좋은 답변을 선택해 피드백을 주고, 이를 통해 모델이 사람 선호에 맞게 답변하도록 학습하는 기법
- 예시
    - 질문: "What is the capital of France?" → "The capital of France is Paris."
- 특징
    - 명확한 질문에 정확히 답변 가능
    - 도움이 되고(Helpful), 정직하며(Honest), 해롭지 않도록(Harmless) 훈련됨

<br><br>

# Guidelines

- 프롬프팅 가이드라인
- 목표: 명확하고 효과적인 프롬프트를 작성하여 원하는 결과 얻기

- 코드 실습 준비
  ```python
  import openai
  import os

  from dotenv import load_dotenv, find_dotenv
  _ = load_dotenv(find_dotenv())  # read local .env file

  openai.api_key = os.getenv('OPENAI_API_KEY')

  def get_completion(prompt, model="gpt-3.5-turbo"):
      messages = [{"role": "user", "content": prompt}]
      response = openai.ChatCompletion.create(
          model=model,
          messages=messages,
          temperature=0,  # this is the degree of randomness of the model's output
      )
      return response.choices[0].message["content"]
  ```

<br><br>

## 📌 **Prompting의 2가지 핵심 원칙**

### 📍 Principle 1: Write clear and specific instructions

**Tactic 1: Use delimiters to clearly indicate distinct parts of the input**

- 예: `triple backticks`, `< >`, "", XML 태그 등
- 모델이 입력 텍스트의 경계를 정확히 인식하도록 도와줌
- injection 공격 회피에도 도움

  ```python
  text = f"""
  You should express what you want a model to do by \ 
  providing instructions that are as clear and \ 
  specific as you can possibly make them. \ 
  This will guide the model towards the desired output, \ 
  and reduce the chances of receiving irrelevant \ 
  or incorrect responses. Don't confuse writing a \ 
  clear prompt with writing a short prompt. \ 
  In many cases, longer prompts provide more clarity \ 
  and context for the model, which can lead to \ 
  more detailed and relevant outputs.
  """
  prompt = f"""
  Summarize the text delimited by triple backticks \ 
  into a single sentence.
  ```{text}```
  """
  response = get_completion(prompt)
  print(response)

  ```

<br>

**Tactic 2: Ask for a structured output**

- JSON, HTML, 리스트 등의 형식으로 출력 요청
- 예: 책 제목, 작가, 장르를 JSON 형식으로 반환하도록 요구
- 파싱 및 자동화에 유용함
  ```python
  prompt = f"""
Generate a list of three made-up book titles along \ 
with their authors and genres. 
Provide them in JSON format with the following keys: 
book_id, title, author, genre.
"""
response = get_completion(prompt)
print(response)
  ```
<br>

**Tactic 3: Ask the model to check whether conditions are satisfied**

- 모델에게 입력 내용에 조건이 포함되었는지 판단하도록 요청
- 만족하지 않으면 "조건 불충족"이라고 답변하게 설정
  ```python
  text_1 = f"""
  Making a cup of tea is easy! First, you need to get some \ 
  water boiling. While that's happening, \ 
  grab a cup and put a tea bag in it. Once the water is \ 
  hot enough, just pour it over the tea bag. \ 
  Let it sit for a bit so the tea can steep. After a \ 
  few minutes, take out the tea bag. If you \ 
  like, you can add some sugar or milk to taste. \ 
  And that's it! You've got yourself a delicious \ 
  cup of tea to enjoy.
  """
  prompt = f"""
  You will be provided with text delimited by triple quotes. 
  If it contains a sequence of instructions, \ 
  re-write those instructions in the following format:

  Step 1 - ...
  Step 2 - …
  …
  Step N - …

  If the text does not contain a sequence of instructions, \ 
  then simply write \"No steps provided.\"

  \"\"\"{text_1}\"\"\"
  """
  response = get_completion(prompt)
  print("Completion for Text 1:")
  print(response)

  text_2 = f"""
  The sun is shining brightly today, and the birds are \
  singing. It's a beautiful day to go for a \ 
  walk in the park. The flowers are blooming, and the \ 
  trees are swaying gently in the breeze. People \ 
  are out and about, enjoying the lovely weather. \ 
  Some are having picnics, while others are playing \ 
  games or simply relaxing on the grass. It's a \ 
  perfect day to spend time outdoors and appreciate the \ 
  beauty of nature.
  """
  prompt = f"""
  You will be provided with text delimited by triple quotes. 
  If it contains a sequence of instructions, \ 
  re-write those instructions in the following format:

  Step 1 - ...
  Step 2 - …
  …
  Step N - …

  If the text does not contain a sequence of instructions, \ 
  then simply write \"No steps provided.\"

  \"\"\"{text_2}\"\"\"
  """
  response = get_completion(prompt)
  print("Completion for Text 2:")
  print(response)
  ```
<br>

**Tactic 4: "Few-shot" prompting**

- 예시 입력-출력 쌍을 함께 제공하여 모델이 유사한 방식으로 대응하도록 유도
- 스타일, 어조, 포맷 등을 유지
  ```python
  prompt = f"""
  Your task is to answer in a consistent style.

  <child>: Teach me about patience.

  <grandparent>: The river that carves the deepest \ 
  valley flows from a modest spring; the \ 
  grandest symphony originates from a single note; \ 
  the most intricate tapestry begins with a solitary thread.

  <child>: Teach me about resilience.
  """
  response = get_completion(prompt)
  print(response)
  ```
<br>

<br>

### 📍 Principle 2: Give the model time to “think”

**Tactic 1: Specify the steps required to complete a task**

- "학생의 답이 맞았는지 판단하라" (X)
- "직접 문제를 풀고, 그 결과와 학생의 답을 비교하라" (O)
- 모델이 스스로 생각하도록 지시
  ```python
  text = f"""
  In a charming village, siblings Jack and Jill set out on \ 
  a quest to fetch water from a hilltop \ 
  well. As they climbed, singing joyfully, misfortune \ 
  struck—Jack tripped on a stone and tumbled \ 
  down the hill, with Jill following suit. \ 
  Though slightly battered, the pair returned home to \ 
  comforting embraces. Despite the mishap, \ 
  their adventurous spirits remained undimmed, and they \ 
  continued exploring with delight.
  """
  # example 1
  prompt_1 = f"""
  Perform the following actions: 
  1 - Summarize the following text delimited by triple \
  backticks with 1 sentence.
  2 - Translate the summary into French.
  3 - List each name in the French summary.
  4 - Output a json object that contains the following \
  keys: french_summary, num_names.

  Separate your answers with line breaks.

  Text:
  ```{text}```
  """
  response = get_completion(prompt_1)
  print("Completion for prompt 1:")
  print(response)

  # example 2:  Ask for output in a specified format
  prompt_2 = f"""
  Your task is to perform the following actions: 
  1 - Summarize the following text delimited by 
    <> with 1 sentence.
  2 - Translate the summary into French.
  3 - List each name in the French summary.
  4 - Output a json object that contains the 
    following keys: french_summary, num_names.

  Use the following format:
  Text: <text to summarize>
  Summary: <summary>
  Translation: <summary translation>
  Names: <list of names in summary>
  Output JSON: <json with summary and num_names>

  Text: <{text}>
  """
  response = get_completion(prompt_2)
  print("\nCompletion for prompt 2:")
  print(response)
  ````

<br>

**Tactic 2: Instruct the model to work out its own solution before rushing to a conclusion**

- 문제 해결을 여러 단계로 나누도록 유도
- 계산 문제나 복잡한 작업에 특히 효과적
````python
  prompt = f"""
  Determine if the student's solution is correct or not.

  Question:
  I'm building a solar power installation and I need \
  help working out the financials. 
  - Land costs $100 / square foot
  - I can buy solar panels for $250 / square foot
  - I negotiated a contract for maintenance that will cost \ 
  me a flat $100k per year, and an additional $10 / square \
  foot
  What is the total cost for the first year of operations 
  as a function of the number of square feet.

  Student's Solution:
  Let x be the size of the installation in square feet.
  Costs:
  1. Land cost: 100x
  2. Solar panel cost: 250x
  3. Maintenance cost: 100,000 + 100x
  Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
  """
  response = get_completion(prompt)
  print(response)

  # Note that the student's solution is actually not correct.
  # We can fix this by instructing the model to work out its own solution first.

  prompt = f"""
  Your task is to determine if the student's solution \
  is correct or not.
  To solve the problem do the following:
  - First, work out your own solution to the problem including the final total. 
  - Then compare your solution to the student's solution \ 
  and evaluate if the student's solution is correct or not. 
  Don't decide if the student's solution is correct until 
  you have done the problem yourself.

  Use the following format:
  Question:
  ```
  question here
  ```
  Student's solution:
  ```
  student's solution here
  ```
  Actual solution:
  ```
  steps to work out the solution and your solution here
  ```
  Is the student's solution the same as actual solution \
  just calculated:
  ```
  yes or no
  ```
  Student grade:
  ```
  correct or incorrect
  ```

  Question:
  ```
  I'm building a solar power installation and I need help \
  working out the financials. 
  - Land costs $100 / square foot
  - I can buy solar panels for $250 / square foot
  - I negotiated a contract for maintenance that will cost \
  me a flat $100k per year, and an additional $10 / square \
  foot
  What is the total cost for the first year of operations \
  as a function of the number of square feet.
  ``` 
  Student's solution:
  ```
  Let x be the size of the installation in square feet.
  Costs:
  1. Land cost: 100x
  2. Solar panel cost: 250x
  3. Maintenance cost: 100,000 + 100x
  Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
  ```
  Actual solution:
  """
  response = get_completion(prompt)
  print(response)
````


<br>

### 📍 Model Limitations

1. 모델의 한계
- 훈련 중 본 정보만 기억하고, 완벽히 암기하지 않음
- 지식의 경계(boundary)를 모름
- 때때로 사실이 아닌 내용을 그럴듯하게 지어냄
    - 이것을 hallucination이라 부름

2. Hallucination을 줄이기 위한 전략
- 질문에 대한 근거를 먼저 찾게 한 후, 그 근거를 바탕으로 답하도록 유도
- 예: `"해당 질문의 근거가 되는 문장을 먼저 찾고, 그 문장을 바탕으로 답하라"`
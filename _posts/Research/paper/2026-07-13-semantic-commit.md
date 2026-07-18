---
title: "Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale"
categories:
  - paper
tags:
  - semantic_conflict
  - AI_memory
  - impact_analysis
  - mixed_initiative
  - HCI
toc: true
toc_sticky: true

date: 2026-07-13 10:00
last_modified_at: 2026-07-13 10:00
comments: true
---

## 연구
[Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale](https://doi.org/10.1145/3746059.3747778)

> Priyan Vaithilingam, Munyeong Kim, Frida-Cecilia Acosta-Parenteau, Daniel Lee, Amine Mhedhbi, Elena L. Glassman, and Ian Arawjo. 2025. Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale. In Proceedings of the 38th Annual ACM Symposium on User Interface Software and Technology (UIST '25). Association for Computing Machinery, New York, NY, USA, Article 137, 1-18. https://doi.org/10.1145/3746059.3747778

<br>

## 1. 문제의식
- 새 정보를 추가/수정할 때 기존 내용과 semantic conflict가 발생함
- 자연어는 모호해서 자동 해소가 사실상 불가하고, 사람 판단이 반드시 필요한 부분이 존재함
  - warp drive: "no material can move faster than the speed of light"
  - novel: 점심 장면을 저녁으로 바꾸면 수백 페이지 뒤에 어떤 영향?
- 무엇이 바뀔 수 있는지(what), 어디에(where), 어떤 효과가 있을지(effect) - 변경의 ramification을 보여주는 feedforward가 필요함
- 코드에는 impact analysis 도구가 있는데 자연어 문서에는 없다!

<br>

## 2. 시스템
- knowledge graph 기반 RAG
  - 문서에서 entity들을 뽑아 연결한 그래프를 미리 구축, 각 개념의 출처 문서도 기록
  - 새 정보가 들어오면 PageRank로 관련 부분을 찾고 그중 실제 충돌만 분류 (baseline보다 충돌을 덜 놓침. 높은 recall)
- 충돌을 찾고(detect) → 왜 충돌인지 설명하고(understand) → 전체/부분 단위로 고침(resolve)
- revert, 긴 문서도 가능
- 충돌 없는 부분은 건드리지 않음 (design goal)

<br>

## 3. Study (N=12, vs. OpenAI Canvas)
- preferred workflow
  - 절반이 check for conflicts로 시작: global revision 기능이 있는데도 AI 수정 없이 먼저 flag만 하고, local edit함
  - → 사람들은 AI가 고쳐주는 것보다 뭐가 충돌인지 아는 걸 원함 (collaborative, gives control)
- increased control 이득이 workload(AI output validation) cost 상쇄 (surprisingly)
- SemanticCommit이 task 더 오래걸리긴 함 (5m 41s vs. 4m 7s, p≈.004)

<br>

## 4. 시사점
- AI Agent 인터페이스는,
  - 사용자가 impact analysis를 수행할 수 있게 해야함
  - 변경 제안하기 전에 영향에 관한 affordance 제공
  - retrieval을 generation에서 분리해야함

<br>

## 느낀 점 / 질문
- 근데 이건 단일 문서/단일 사용자임. 협업중에 문서 여러 개, 소유자 여러 명, authority 다른 경우는 (e.g., Google Drive)?

<br><br>

---
title: "Breakdowns and Design Opportunities for Collaborative File Management"
categories:
  - paper
tags:
  - collaborative_file_management
  - breakdown
  - design_goal
  - HCI
toc: true
toc_sticky: true

date: 2026-07-07 20:30
last_modified_at: 2026-07-07 20:30
comments: true
---

## 연구
[Breakdowns and Design Opportunities for Collaborative File Management](https://doi.org/10.1145/3772318.3791744)

> Kiyeal Seo, Yoonjae Lee, You Jin Jeong, and Gahgene Gweon. 2026. Breakdowns and Design Opportunities for Collaborative File Management. In Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems (CHI '26). Association for Computing Machinery, New York, NY, USA, Article 316, 1–16. https://doi.org/10.1145/3772318.3791744

<br>

## 1. 문제의식
- 협업 파일 관리에서 breakdown이 어떻게 생기는지 연구
- 파일 = 협업자들이 기여를 주고받는 primary medium
- breakdown → 최근 문헌에 명시적으로 제기된 문제
- 생기는 path: ambiguous file locations / overlapping versions / loss of contextual cues / fragmented update paths
- 결과: obscure project status / weaken shared understanding / generate duplicated effort or delays

<br>

## 2. Study 1: need-finding 인터뷰 (N=33) → 4가지 반복 breakdown
- **Ambiguous file placement and ownership**
  - retrieval 방해 / temp파일들 / external 공개가능 데이터 판단 어려움
  - → DG(a): Providing ownership and storage location signals
- **Insufficient Version Management**
  - redundant draft로 workload 및 uncertainty 증가 / reconciling 어려움
  - → DG(b): Indicating reference versions
- **Uninterpretable Metadata**
  - 각 문서의 contextual information: authorship, recency, approval status, relevance 등등 확인 안됨
  - preview도 해석 불가능한 상태
  - → DG(c): Conveying interpretable metadata
- **Missing Status Cues**
  - early draft? awaiting review?
  - task progress 지연, 활용 판단 불가
  - → DG(d): Exposing process status

<br>

## 3. Study 2: Design probe 평가 (N=12)
Study 1의 DG마다(4개) probe를 하나씩 만듦. scenario-based walkthrough + reflective discussion으로 평가

- **Contribution Trace** (ownership/location signal)
  - (+) 다음 작업자가 명확하므로 responsibility shift 문제 해소
  - (-) 작업 기여도가 너무 노출되어 감시받는 느낌
  - (→ Accountability vs Surveillance)
- **Version Flow Map** (reference version 표시)
  - (+) 최신/기준 버전 확인 가능하여 ref 수렴
  - (-) temp 문서들
  - (→ Efficiency vs Containment)
- **Preview Cards** (interpretable metadata)
  - (+) 빠르게 맥락 파악
  - (-) draft 내용이나 개인 노트 노출. 과잉 공개
  - (→ Interpretability vs Overdisclosure)
- **Timeline Status** (process status 노출)
  - (+) 진행상황 명확해서 문서의 미완성 방치를 막음
  - (-) 개인에 대한 평가 압박
  - (→ Awareness vs Pressure)

<br>

## 느낀 점 / 질문
- breakdown과 design opportunity까지만 논하고 시스템/AI 솔루션을 도출한건 아님 → HyperAgent의 요구사항으로 쓸 수 있음
- 파일 시스템과 메타데이터 관점인데 문서 내용 수준으로 충돌하면 못 잡지 않나

<br><br>

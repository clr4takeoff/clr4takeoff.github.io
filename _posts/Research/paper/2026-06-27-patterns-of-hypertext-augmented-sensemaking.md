---
title: "Patterns of Hypertext-Augmented Sensemaking"
categories:
  - paper
tags:
  - sensemaking
  - hypertext
  - PKM
  - HCI
toc: true
toc_sticky: true

date: 2026-06-27 22:00
last_modified_at: 2026-06-27 22:00
comments: true
---

## 연구
[Patterns of Hypertext-Augmented Sensemaking](https://dl.acm.org/doi/10.1145/3654777.3676338)

> Siyi Zhu, Robert Haisfield, Brendan Langen, and Joel Chan. 2024. Patterns of Hypertext-Augmented Sensemaking. In Proceedings of the 37th Annual ACM Symposium on User Interface Software and Technology (UIST '24). Association for Computing Machinery, New York, NY, USA, Article 143, 1–17. https://doi.org/10.1145/3654777.3676338

<br>

## 1. 문제의식
- 자료는 읽고 다 수집은 하는데, 다시 보지도 않고 방치하게 되는 경우가 많음 → Sensemaking이 제대로 이루어지지 않음

<br>

## 2. Temporo-Spatial Fragmentation
- notes, obsidian, notion, 카톡 '나에게 보내기' 등 여러 source를 동시에 사용
- 문제는 적어놓고도 까먹거나, 나중에 메모를 봐도 이해하지 못한다는 것 → **맥락이 없기 때문**
- Wikipedia처럼 forward-back-link로 정보를 연결하는 Hypertext 방식이 대안이 될 수 있음
- Hypertext 도구를 써야 하는 이유: 폴더 구조에 구속되지 않고 유연하게 연결할 수 있기 때문

<br>

## 3. 기존(폴더 기반) 방식의 문제점
- 저장 데이터에 정해진 규칙이 필요함
- 정보를 한 곳(폴더)에 가두게 됨
- 정보 간 흐름(flow)이 존재하지 않음

<br>

## 4. Structure — 생각을 다듬는 과정
- **Source Notes** (Evidence file)
- **Summary Notes** (Schema)
- **Synthesis Note** (Hypothesis)
- 노트에 '상태'를 부여함 (e.g. `[[EVD]]`, `[[HYP]]`) → 이것 자체가 하나의 affordance가 되어 미래의 나에게 해야 할 일을 명시해줌

<br>

## 5. 세 가지 방법
- **Hub**: 빈 페이지에 링크만 걸어두는 방식 (backlink) - 링크가 유연하게 얽힘
- **Index**: supertag 기반. 흩어진 노트를 트리 형태로 모아 블록처럼 옆에 나란히 띄워둠
- **Incubator**: log note 방식 - write-aloud와 유사한 느낌
- Index와 Incubator는 결국 **Meta work**에 가까운 것 아닌가? 장기적으로는 도움이 되지만 단기적으로는 귀찮음

<br>

## 6. Meta work를 포기하지 않는 이유
- **Momentum** - 꾸준히 정리하는 행위 자체가 다음 작업으로 이어지는 동력이 됨

<br>

## 7. AI와 결합한다면?
- 자동으로 태그를 달고 분류
- backlink를 스스로 분석
- 내 생각의 모순을 찾아주는 기능
- 다만 인간의 agency는 보장되어야 함 (mixed-initiative systems)
- Second Brain에 가까워질 수 있지 않을까?

<br>

## 8. 한계
- 사용 패턴/경향에 대한 기술만 있을 뿐, sensemaking이 실제로 잘 이루어졌는지에 대한 효과 검증은 부족함 (자가보고 질문 정도만 존재)
- 문서 간 충돌(conflict)을 다루지 않음
- hub/index/incubator 구조 자체가 결국 또 다른 수작업이라 귀찮을 수 있음 → AI Agent 도입을 정당화하는 지점이 될 수 있음

<br>

## 느낀 점 / 질문
- meta-work라는 관리부하에 대해, 도구가 인지부하를 줄여주는 대신 관리부하를 새로 만든다면, 그 관리부하를 누가(사람 vs AI) 어떻게 떠안아야 효율이 극대화될까
- AI가 개입해야 하는 지점과, 사람이 직접 해야 sensemaking 효과가 유지되는 지점을 어떻게 구분할 수 있을까

<br><br>

---
title: "[SQL Developer] Hide Column Separator Lines in Script Output"
categories:
  - database
tags:
  - Database
  - SQLDeveloper
  - Oracle
toc: true
toc_sticky: true

date: 2025-05-14
last_modified_at: 2025-05-14
comments: true
---

## 문제 상황
<img src="/assets/posts/CSE/Database/250514/20250514-1.png" alt="solved" width="600">
- Oracle SQL Developer에서 Script Output 창으로 SQL 실행 결과를 조회하면, column 이름 아래에 줄이 출력된다. 이로 인해 의도한 데이터를 한 화면에서 전부 보기 어렵다.
<br><br/>
  

<br><br>
## 문제 원인
- SQL Developer의 기본 출력 포맷이 SQL*Plus 스타일로 되어있다.
- 초기 테이블 생성 시 `cno VARCHAR(10)`, `name VARCHAR(100)`으로 설정해뒀는데 그에 비례하여 column 밑에 줄이 생성된 것 같다. 예상대로 하이픈 개수는 CNO 10개, NAME 100개였다.

<br><br>
## 해결 방법
```sql
SET sqlformat ansiconsole;
```
- 이 문장을 실행하면 밑줄이 사라진다.

```sql
SET SQLFORMAT DEFAULT;
```
- 이 문장을 실행하면 다시 밑줄이 생긴다.

<br><br>

## 성공~
<img src="/assets/posts/CSE/Database/250514/20250514-2.png" alt="solved" width="600">
- 모든 column의 내용을 한 화면에서 볼 수 있게 됐다.

<br><br>

## Reference 🔗
[SQL Developer Script Column Output Format - Stackoverflow](https://stackoverflow.com/questions/37506521/sql-developer-script-column-output-format)

<br><br>
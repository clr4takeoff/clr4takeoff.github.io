---
title: "Fix Submodule issue"
categories:
  - error
tags:
  - Error
  - vscode
  - git
toc: true
toc_sticky: true

date: 2024-09-15
last_modified_at: 2024-09-15
comments: true
---

## 문제 상황
- 특정 폴더에 대한 submodule 오류
  ```
  error: 'FOLDERNAME/' does not have a commit checked out
fatal: adding files failed
  ```
  - github에 repository 만들고 로컬이랑 연결 후 파일 작업해서 commit하려고 `git add .`하니까 문제 발생

## 문제 원인
- 해당 폴더나 그 하위 폴더에 `.git`폴더가 존재하여 Git이 그 폴더를 submodule로 인식하고 제대로 추적하지 못함. 폴더 내 `.git`파일이 프로젝트와 독립적으로 관리되는 repo로 인식되어 발생
- **submodule**: Git에서 하나의 repo 안에 다른 Git 저장소를 포함시키는 기능으로, 하나의 프로젝트 내에 또 다른 독립적인 Git 저장소를 추가하여 관리 가능. 여러 프로젝트에서 코드 재사용성을 높일 수 있는 도구.

## 해결 방법
내부에 있는 폴더를 순회하며 `rm -rf 폴더경로/.git`로 모든 `.git`파일 삭제
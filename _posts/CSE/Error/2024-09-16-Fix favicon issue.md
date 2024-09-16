---
title: "[Blog] Fix Favicon issue"
categories:
  - error
  - blog
tags:
  - Error
  - blog
toc: true
toc_sticky: true

date: 2024-09-16
last_modified_at: 2024-09-16
comments: true
---

## 문제 상황
<img width="334" alt="Screenshot 2024-09-16 at 14 47 48" src="https://github.com/user-attachments/assets/2f6f582b-7e75-4ac8-9f51-ede323a5c74b">
- 예전에 블로그 초기 세팅 하면서 favicon을 설정했던 것 같은데, 어는 날 보니까 아무것도 안보임.
- 모든 파일 삭제했다가 다시 넣어보고, <span style="color:red">`custom.html`</span>이랑 <span style="color:red">`head.html`</span> 건드려가며 별 짓을 다 해도 favicon이 등장하지 않음.
- StackOverflow에 달린 답변도 수십 개는 확인해봤으나 원하는 답을 얻지 못함.
- GPT한테 물어봐도 파일 위치 확인해라, 파일 경로 수정해봐라 외에 다른 답을 제공하지 않았음.. 
<br/>

## 문제 원인
- favicon 관련 link태그가 <span style="color:red">`head`</span>안에 들어가있어야 하는데, 개발자도구(Chrome에서 <span style="color:grey">`command + option + i`</span>)를 열고 Elements를 확인했을 때 favicon 관련 <link> 태그가 <span style="color:red">`head`</span>가 아닌 <span style="color:red">`body`</span>태그 내에 렌더링되고 있었음.
<br/>

## 해결 방법
1. <span style="color:red">`custom.html`</span> 내부의 favicon 관련 코드들을 통째로 <span style="color:red">`default.html`</span>로 옮겨 보니 적용이 되었음.
<img width="893" alt="Screenshot 2024-09-16 at 16 45 30" src="https://github.com/user-attachments/assets/d7cc9991-f38f-47b5-a83e-e3afba9d1bb7">
 - 근데 결국 이것도 큰 관점에서는 2번 방법이랑 같긴 함
 - 나는 <span style="color:red">`custom.html`</span>과 <span style="color:red">`default.html`</span>을 확실히 분리하고 싶었음. <span style="color:red">`default.html`</span>이 <span style="color:red">`custom.html`</span>을 참조하니까.<br><br/>
2. <span style="color:red">`default.html`</span>에서 하단 코드 위치를 위로 바꿔줌.
<img width="840" alt="Screenshot 2024-09-16 at 16 44 34" src="https://github.com/user-attachments/assets/68286a90-c454-4d4f-b90d-75ef0998eca2">
<img width="1010" alt="Screenshot 2024-09-16 at 16 45 07" src="https://github.com/user-attachments/assets/2444895e-a708-4057-b57e-594da65ccf91">
- 이렇게 스크롤바보다 더 상단으로..
- **리소스 호출 순서**: 브라우저는 HTML문서를 위에서 아래로 순차적으로 parsing하는데,<span style="color:red">`<html>`</span>태그가 <span style="color:red">`<!doctype html>`</span>바로 다음에 위치하지 않고 내가 넣어둔 스크롤바 다음에 위치해서 파비콘이 올바르게 로드되지 않은 듯.

<br/>
 <img width="137" alt="Screenshot 2024-09-16 at 16 45 59" src="https://github.com/user-attachments/assets/2c2fa0b0-d6eb-46e9-98f1-649fa3be4fcc">
<< 현재 정상적으로 적용됐음을 확인할 수 있음.
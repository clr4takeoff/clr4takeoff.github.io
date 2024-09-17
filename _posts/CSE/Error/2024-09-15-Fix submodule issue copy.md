---
title: "Fix MathJax issue"
categories:
  - error
tags:
  - Error
  - Markdown
toc: true
toc_sticky: true

date: 2024-09-17
last_modified_at: 2024-09-17
comments: true
---

## 문제 상황
- markdown으로 수식을 입력했는데 제대로 렌더링되지 않고 텍스트로 보임
  <img width="694" alt="Screenshot 2024-09-17 at 14 31 26" src="https://github.com/user-attachments/assets/847dd5af-3a92-4904-8c68-1cafc4e663ff">

<br><br>
## 문제 원인
- Jekyll 사용 블로그에서 LaTeX 수식을 사용하려면 MathJax 라이브러리가 제대로 로드되도록 해야 함.

  <img src="https://github.com/user-attachments/assets/7592dcf5-48b7-4a76-9ff6-32396e1506fe" alt="image" width="200">

<br><br>
## 해결 방법
1. <span style="color:purple;">`_config.yml`</span>에 다음 코드 추가하여 MathJax 활성화
```yaml
mathjax: true
```
2. <span style="color:purple;">`default.html`</span>에 MathJax 스크립트 추가
```javascript
<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
```
- MathJax가 수식을 렌더링하는 데 필요한 JavaScript 파일을 로드함

<br><br>
## 성공~
- 정상적으로 수식이 적용된 모습을 확인할 수 있다.

  <img width="353" alt="Screenshot 2024-09-17 at 14 32 06" src="https://github.com/user-attachments/assets/8c1bb81e-e61e-4c8b-96bc-a813d4906c6c">

### 추가 고려 사항
- 수식 작성 규칙이 있다.
  - 인라인 수식: `$ ... $`
  - 블록 수식: `$$ ... $$`
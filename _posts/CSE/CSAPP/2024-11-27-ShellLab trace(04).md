---
title: "[CSAPP] ShellLab trace(04)"
categories:
  - csapp
tags:
  - CSAPP
  - SystemProgramming
  - ShellLab
toc: true
toc_sticky: true

date: 2024-11-27
last_modified_at: 2024-11-27
comments: true
---





## Trace 번호 (04)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/4f8adf8e-294e-4554-9112-a664b7d417ab)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/92ae21c6-2e24-4773-98d8-e82ffcadea33)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/7cf105ab-0a25-4943-bb5b-c02f5bdbae1e)
<br>`‘quit’인가? 부분 마름모 도형으로 수정`

<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/76580fe5-8651-4712-9865-65effe8f9931)
<br>trace04.txt파일을 참고하자. Foreground 작업 형태로 매개변수가 있는 프로그램을 실행해야한다.  /bin/echo 프로그램에 –e, tsh\076, quit을 매개변수로 같이 줘서, foreground 작업 형태로 실행한다.
이것도 마찬가지로(trace03 설명 참고, argv인자가 parseline함수를 통한 cmdline parsing을 통해 execve함수로 전달됨) 이미 구현이 되어있으므로 sdriver를 통해 테스트를 진행하면 별 문제 없이 통과된다.
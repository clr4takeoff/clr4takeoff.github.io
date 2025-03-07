---
title: "[CSAPP] ShellLab trace(11)"
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
type: shelllab
---





## Trace 번호 (11)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/e39e17be-ff87-4cd7-b699-fc6f3630a8cf)

### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/36787e6b-8fab-405d-9839-82b0505e2a18)

<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/b7a8bdb8-acdd-41f3-80c1-5edd208f9e33)
<br>
trace11은 자식 프로세스가 자신에게 SIGINT 신호를 전송하는 상황을 구현해야한다.
myints 프로그램을 실행하고 quit으로 종료한다.
<br>

![Image](https://github.com/user-attachments/assets/5e6339f1-82b8-4e0f-8b7b-47f3ecbced41)
<br>
myints프로그램이 어떤 동작을 할지 궁금해하며 코드를 열어보았다.
주석을 제외하면 trace08에서 보았던 myintp.c 코드와 전혀 다를 것이 없다.
kill(getpid(), SIGINT)로 자신의 pid를 가져와 자신에게 SIGINT signal을 보내는 점에 집중해보자.

<br>
![Image](https://github.com/user-attachments/assets/84d87240-5eab-4f3a-885a-18d406c61cff)
<br>
trace08에서 SIGINT 발생 시 foreground로 이를 전달하도록 구현했고, 자식 프로세스의 종료 시 부모 프로세스는 SIGCHLD를 처리하도록 이미 구현했다. 자식 프로세스가 스스로에게 SIGINT를 보내더라도 sigchld_handler 내부의 waitpid 함수에 의해 감지될 것이고, WIFSIGNALED가 자식 프로세스의 시그널로 인한 종료 여부를 다시 체크하므로 문제 없다. 
또한 sigprocmask로 race condition도 방지했으므로, 추가 코드 없이 trace08을 통과한 코드로 trace11도 통과한다.
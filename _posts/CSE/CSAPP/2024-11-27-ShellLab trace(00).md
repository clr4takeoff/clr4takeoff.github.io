---
title: "[CSAPP] ShellLab trace(00)"
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





## Trace 번호 (00)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/384ea7ff-7e3b-411d-9eb8-72eae9ccb5a5)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/dce6448b-96fe-4694-9274-33f19b01efab)



### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/927cd8a6-8b33-4812-a2da-795bf11b46d5)

*main의 세부 동작은 다음 flowchart부터 간소화할 것.

<br><br>

### trace 해결 방법 설명

trace00의 eval함수는 사용자가 커맨드라인에 입력한 것을 처리한다.
간단히 정리하면 EOF입력(ctrl+d) 시 shell이 종료되도록 하면 된다.


eval 함수는 상단 내용으로 구현되어있다.


main함수를 잘 살펴보면 feof함수로 표준 입력 스트림에서 파일의 끝에 도달했는지 확인한다. 이 조건 만족 시 스트림들을 비우고 남은 데이터들을 출력한 후 exit(0)으로 프로그램을 종료한다. 따라서 현재 eval()함수에 아무 것도 추가하지 않아도 정상적으로 테스트케이스를 통과한다.

<br><br>
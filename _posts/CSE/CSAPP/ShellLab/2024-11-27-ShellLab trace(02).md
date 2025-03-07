---
title: "[CSAPP] ShellLab trace(02)"
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





## Trace 번호 (02)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/0cee330b-2c29-4418-9fa9-8b321628c995)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/fbdaea6b-381a-4b21-ab35-b6348bc45af5)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/476bf60b-3ae9-4125-89d1-38a68cefa20f)


<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/fc1e9c13-3914-48a7-8d94-a6076bfe5e0c)
<br>trace02.txt파일을 확인했다. trace02에서는 환경변수를 출력하는 foreground job을 실행시켜야 한다.
쉘에서 새로운 프로그램을 실행시키려면 fork를 통해 자식 프로세스를 생성하고, 자식 프로세스에서 execve()를 호출하면 된다.

실행 파일은 myenv이다. myenv.c의 코드는 다음과 같다.
<br>
![Image](https://github.com/user-attachments/assets/8170cf6a-2d02-40a7-81dc-7f6b09cec5d7)
<br>환경변수를 출력해주는 프로그램이다.

![Image](https://github.com/user-attachments/assets/aa1e9fce-ff88-471a-a4bd-53b6ce595dcf)
<br>강의 자료를 참고하여 작성한 코드이다.

우선 cmdline에서 파싱한 argv가 내장 명령어가 아닐 경우 0을 반환하여 첫 번째 if조건문이 참이 되고, child process인지 검증하는 2차 if블록에 걸린다.

fork()함수로 자식 프로세스를 새로 생성할 수 있다. fork()는 부모 프로세스에서는 자신의 pid를 반환하고 자식 프로세스에서는 0을 반환하므로 자식 프로세스에 대한 판단 조건을 (pid=fork())==0으로 작성할 수 있다. 이를 만족할 경우 세 번째 if블록으로 넘어간다.

execve()함수는 argv[0]의 프로그램을 자식 프로세스에서 실행한다. cmdline을 파싱하여 받은 첫 번째 값이 프로그램의 이름이 될 것. environ은 C 표준 라이브러리에서 제공하는 전역 변수이고, 환경 변수를 전달하는 배열이다.

execve() 함수가 성공적으로 호출될 경우 기존 프로세스가 새로운 프로그램으로 대체되어 

return을 하지 않는다. 실패 시 –1을 return한다고 하니, execve(...)<0으로 조건을 설정하여 실패할 경우에 오류 메시지를 출력하고 자식 프로세스를 정상적으로 종료하도록 하여 좀비 프로세스를 방지한다.

부모 프로세스가 자식 프로세스를 100,000μs동안 기다리도록 한다. 이는 자식 프로세스가 명령어를 실행할 시간을 대략 확보하는 역할을 하는 듯하다.

-------------------------------------------------------------------------------------------------------
![Image](https://github.com/user-attachments/assets/7d576c2c-744c-468a-b63f-8fefa7de3937)
<br>추가로, verbose 결과에 맞게 수정하기 전(sdriver만 통과한 상태) makefile을 실행했더니 다음과 같은 경고가 나왔다. trace02까지 잘 해결되었으나 경고를 해주는 성의를 보아 코드를 수정했다.
<br><br>

1) argv는 char\*\*타입인데 %s형식은 char*를 받음
   - printf("%s : Command not found\n\n", argv[0]);로 수정

2) eval함수는 void인데 return 0;으로 값을 반환하려고 함
   - return;으로 수정

<br>
수정 완료 후 알록달록하지 않은 깔끔한 결과를 볼 수 있게 되었다.
<br><br>
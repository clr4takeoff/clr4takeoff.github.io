---
title: "[CSAPP] ShellLab trace(08)"
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





## Trace 번호 (08)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/a77d67eb-8d88-4207-949c-63ac457731d4)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/00b94562-0c48-4616-9157-3eafa49d135c)

<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/bd558b3d-84d0-4ae3-b2dc-a833ea8ed756)
<br>

여느 때처럼 해결할 trace의 텍스트파일을 참고하여 프로그램의 동작 전반을 확인한다.
trace08에서는 SIGINT 수신 시 이를 foreground job으로 전달하는 것을 구현해야한다.
myintp 파일을 foreground로 실행하고 quit 있으니, myintp이 어떤 프로그램인지 확인해보자.
<br>

![Image](https://github.com/user-attachments/assets/02b4f512-2c0b-4de7-9e43-4765939e093b)

myintp.c 코드를 열어보았다.
sigalrm_handler 함수와 main 함수가 정의되어있다.

main함수를 먼저 보자. main함수는 SIGALRM신호 발생 시 sigalrm_handler가 실행되게 하고, JOB_TIMEOUT동안 기다리고 이후 시스템이 현재 프로세스에 SIGALRM 신호를 보낸다.

JOB_TIMEOUT과 alarm()의 작동을 파악하기 위해 코드를 찾았다. 

<br>
![Image](https://github.com/user-attachments/assets/af2ad8f3-8aa9-48de-a40c-1c7334cb8e66)
<br><br>
![Image](https://github.com/user-attachments/assets/fa957dfa-a91d-4813-b90f-f465778cb925)
<br><br>
![Image](https://github.com/user-attachments/assets/4cc22779-58b8-4a58-9245-37dac3de2980)
<br>

JOB_TIMEOUT은 config.h에 4로 정의되어있다. alarm()함수는 int인자를 초단위로 처리하여 특정 시간이 지나면 SIGALRM 신호를 보내므로, 이 신호를 처리하는 핸들러를 잘 설정해야 하며, 그 역할을 sigalrm_handler()가 할 것을 알 수 있다. 

sigalrm_handler()가 실행되면 프로그램이 정상 종료한다 (exit(0)).

getpid()를 통해 부모 프로세스의 ID를 반환, kill(getpid(), SIGINT)함수를 호출하여 부모 프로세스에 SIGINT신호를 보내고 실패하면(0보다 작은 값 반환, trace05에서 알아보았듯 pid는 0과 같거나 큰 값이 유효) 에러메시지를 출력하며 프로그램이 exit(1)로 종료됨. 아닌 경우 while(1)로 무한루프를 돈다. 그 때 SIGINT 신호를 받거나 아까 설정해둔 alarm(SIGALRM)으로 인해 SIGALRM 신호가 발생했을 때 종료된다. 

실행될 프로그램을 이해했으니, 수정해야 할 함수의 목록을 보고 어떻게 수정해야할지 고민해봤다.

<br><br>
**1) sigint_handler()**
<br>
![Image](https://github.com/user-attachments/assets/218216ed-fe46-4797-a70a-74ed84cff23f)
<br>
tsh.c의 main함수에 이렇게 Signal 관련 자동으로 호출하는 코드가 있다.
trace08의 목표가 tsh가 SIGINT 신호 수신 시 이를 foreground job으로 전달하는 것이니, 이 함수의 역할이 중요할 것 같다.



<br>
![Image](https://github.com/user-attachments/assets/2f78dafc-218e-45e6-a9b2-7ea4d4fa67de)
<br>
강의자료를 참고하여 sigint_handler()의 코드를 완성했다.


<br>
![Image](https://github.com/user-attachments/assets/e4a48da9-3344-42a2-aa37-f23d76ca8fea)
<br>
fgpid() 함수를 적극 이용할 수 있겠다. 이 함수는 현재 foreground job의 PID를 return하고, foreground에 실행되는 job이 없다면 0을 return한다. 따라서 foreground process의 pid를 저장하려면, pid 변수에 fgpid(jobs) 값을 넣으면 되겠다.

이제 프로세스에 시그널을 전달해야 한다. 아까 myintp.c 코드를 분석했던 것을 떠올려, SIGINT신호를 받으면 foreground job에 SIGINT를 전달하는 방법으로 kill함수를 사용하는 아이디어를 떠올릴 수 있다. 이때 kill함수는 첫 번째 인자로 pid를, 두 번째 인자로 SIGINT를 담았으므로, SIGINT를 전달해야 하는 목적지가 foreground job이니 pid는 아까 fgpid()를 이용하여 저장해둔 pid변수를 그대로 넣으면 되겠다. 

이렇게 SIGINT 신호를 foreground job으로 보낼 수 있다.


<br><br>

**2) sigchld_handler()**<br>
foreground 작업이 정상적으로 종료되면 부모 프로세스는 SIGCHLD 신호를 받게 되고, 그냥 두면 자식 프로세스는 좀비 프로세스로 남을 위험이 있다. 따라서 sigchld_handler()를 이용하여 자식 프로세스를 완전히 종료되게 해야한다.

<br>
![Image](https://github.com/user-attachments/assets/a4ad37e7-c6d9-4618-b277-dd751f61fb18)
<br>
역시 강의자료를 참고하여 sigchld_handler()를 구현해보았다. 

먼저 자식 프로세스가 종료될 때까지 waitpid()를 통해 대기한다.
waitpid()의 첫 번째 인자로 –1을 넣어 임의의(모든) 자식 프로세스를 기다리게 하고, WNOHANG과 WUNTRACED 옵션을 통해 자식 프로세스가 완전히 종료될 때까지 기다리고, 이미 중단된 프로세스도 끄집어낸다. waitpid()는 프로세스의 성공적 종료시 status의 프로세스 pid를 반환하는데, 여러 번 언급하지만 pid는 양수이므로 pid가 양수인지 확인함으로써 자식 프로세스의 종료 여부를 확인할 수 있다.

또 자식 프로세스가 어떻게 종료되었는지 무슨 상태인지 알기 위해, 지금은 시그널을 보내서 종료시키는 상황이므로 WIFSIGNALED를 사용한다. 이는 자식 프로세스가 어떤 signal에 의해 종료되었다면 TRUE값을 return하므로 종료 조건을 저렇게 설정하고, 상황이 맞는 경우 요구하는 메시지를 출력 후 deletejob으로 제거한다. 
else에서 나머지 경우에도 사실 deletejob을 호출하므로 사실 else문 안쓰고 if문 안의 deletejob을 밖으로 꺼내서 한 번만 호출하도록 코드를 최적화할 수 있을 것 같지만 일단 강의 자료에서 주어진 대로 구현하는 것이 마음 편하겠다.

<br><br>
**3) eval()**<br>
![Image](https://github.com/user-attachments/assets/94ea35e5-c93f-41d9-ac34-ea067c51a25e)
<br>
역시 감사한! 강의자료를 참고하여 코드를 구현해보았다.

여기서 기존 eval함수에 sig- 어쩌고 코드를 많이 추가했다. 왜 추가해야 하는지 차근차근 살펴보겠다.

신호 집합 mask를 선언하였다. 이 변수에 아무 신호도 포함되지 않은 상태로 초기화(sigemptyset())해야 의도치 않은 결과를 방지할 수 있다.

관리를 위해 sigaddset()으로 mask집합에 신호 SIGCHLD, SIGINT, SIGSTP을 추가한다.

sigprocmask는 신호 조절을 위한 함수인데 이것의 첫 번째 인자로 SIG_BLOCK을 주고 mask에 설정된 신호들을 전부 차단한다. 이는 race condition을 피하기 위한 방법이다.
foreground job이 실행 중일 때 부모 프로세스가 SIGINT 신호를 받으면 부모는 그 신호를 foreground job에 전달하여 그 job을 종료시키려 할 것이다. 이 상황에서 부모가 작업을 처리하지 않았는데 다른 신호와 작업이 동시에 일어나면 job을 올바르게 처리할 수 없다. 자식의 종료 상태를 정확하게 확인 못하거나 제거를 제대로 못할 수 있다는 문제가 발생할 수 있으므로 신호끼리 간섭하는 이런 상황을 피하기 위해 신호를 차단하는 것이다.
세 번째 인자는 변경하기 전 신호 집합을 저장할 공간을 할당하는 인자인데, 이전 결과를 추적할 필요가 없으니 NULL로 설정해줘도 문제 없다.

그리고 자식 프로세스 생성 후 ((pid=fork())==0), sigprocmask를 통해 자식 프로세스에서 차단했던 신호를 해제하여 자식 프로세스 상태에 따라 올바르게 신호를 보낼 수 있도록 한다. 

addjob으로 작업을 등록하고 부모 프로세스에서 신호 차단을 해제하여 자식 프로세스에서 보낸 신호(종료 상태)를 처리할 수 있게 한다. 이후 foreground 작업(루프 돌며 자식 프로세스 종료시까지 부모 프로세스 대기)과 background 작업(작업 출력)에 대해 다른 처리를 해줬다.
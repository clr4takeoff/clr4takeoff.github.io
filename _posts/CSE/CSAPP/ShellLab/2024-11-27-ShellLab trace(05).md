---
title: "[CSAPP] ShellLab trace(05)"
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





## Trace 번호 (05)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/6a602f48-a3ba-4c82-a0ab-d297e919b1a8)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/772a9977-086f-431d-96d5-bf6ab691ca23)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/0afef6d0-dff2-4047-a8ae-a3c5bcea41c4)


<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/24f6cc08-c384-4ecc-be9c-a57229c0b70b)
<br>trace05.txt파일을 열어보았다. background형태로 프로그램을 실행할 수 있도록 구현해야한다. 명령어를 주고 ‘&’표시를 붙이면 background로 실행된다고 하니, 우선 이 인자를 처리하기 위한 로직을 만들어야 한다.
또 background 형태로 작업을 하려면 프로세스에 대해 신호를 보내거나 상태를 제어(e.g. kill)할 수 있도록 PID를 다룰 수 있어야 하고, 더 단순하게 가고 싶으면 JID를 다룰 수 있어야 하고. foreground와 background를 구분해야하므로 여러 로직이 추가로 필요하다.


![Image](https://github.com/user-attachments/assets/fd03f9a4-ca1a-4ccc-bf10-1773f564fab6)
<br>마침 강의 자료에서 이 자료구조를 이용하여 구현하라는 힌트를 주셨다.
작업의 pid, jid, state, cmdline을 저장하고 이들을 jobs배열에 저장하여 여러 작업을 관리할 수 있게 만든 구조이다.

이를 인지한 다음 작업관리와 관련된 함수들의 목록을 살펴보았다.
작업 배열을 초기화하고, 새로운 작업을 추가하고, 작업을 삭제하는 등의 함수가 있다.

강의 자료를 참고하여 eval()함수를 구성했다.

![Image](https://github.com/user-attachments/assets/09caefcc-c613-4902-b9de-c79beda5f148)

<br><br>

**1) background 처리**<br>
![Image](https://github.com/user-attachments/assets/8fa28391-5cc2-427d-8902-cccf74a985e6)
<br>parseline함수의 밑부분을 보면 이렇게 background 작업인지 판단하는 기능이 구현되어있으므로, 따로 구현하지 않고 넘어간다. 입력의 끝에 “&”가 들어온 경우 background작업으로 간주되어 bg가 1이 되고, 아닌 경우 0이 되어 return된다.

<br>


**2) 작업 추가**<br>
addjob함수는 다음과 같이 구현되어있다.<br>
![Image](https://github.com/user-attachments/assets/f454f6a0-927a-4a66-8453-b1ee4dcc37a0)

<br>유효하지 않은 pid처리를 하고, job배열(작업 목록)을 돌며 빈 슬롯을 찾을 시 새로운 작업을 넣는다. 이때 pid, state, jid, cmdline을 받는데, 빈 슬롯의 cmdline에 strcpy로 복사하여 입력한 명령어를 저장한다. nextjid로 작업의 id를 증가시킨다
작업에 성공하면 로그 출력 후 1 반환, 실패하면(슬롯에 빈 공간이 없는 경우 등) 로그를 출력하고 0을 반환하는 함수이다.

다시 eval()함수로 돌아와서, addjob에 인자들을 넘겨주는데 이번 trace의 목적이 background작업이므로 parseline이 1을 return, 세 번째 인자로 BG가 들어간다.
이렇게 작업을 추가하고 foreground / background 경우에 따라 다르게 처리해준다.


<br><br>
**3) foreground 처리**<br>
bg가 0인 경우 foreground로 처리된다. 
foreground 작업은 사용자와 직접 상호작용하기 때문에 동시에 여러 작업이 실행될 수 없다. 따라서 한 작업이 끝날 때까지 명령어 입력을 하지 못하고 기다려야 한다.
자식 프로세스가 종료될 때까지 기다린다. waitpid함수를 호출하여 이 종료 여부를 알 수 있게 한다. waitpid는 종료된 자식 프로세스의 pid를 반환하는데 pid 규칙에 따라 이는 모두 양수이고, waitpid에서 오류가 발생할 경우 –1의 값을 반환하므로, waitpid가 반환한 값이 0보다 큰 경우 프로세스가 종료되었음을 알 수 있다. 이때 status 변수에 종료 상태가 저장되고, 이 주소값을 같이 주어 함수가 직접 접근 가능하도록 한다.<br>

![Image](https://github.com/user-attachments/assets/28131fb7-17e3-4153-a675-a535b1662154)
<br>종료 후 deletejob을 호출하여 인자로 넘긴 pid의 작업(현재 작업)을 jobs목록에서 제거한다.
자원 낭비와 좀비 프로세스 등을 방지하기 위한 조치이다.

<br><br>

**4) background 처리**<br>
bg가 1인 경우 background로 처리된다(상단 eval함수의 else블럭에 해당).
사용자와 직접적인 상호작용이 필요 없기 때문에 동시에 여러 작업이 실행될 수 있다. 실행을 지연시킬 이유가 없으므로 바로 실행되도록 하고 강의자료의 요구사항에 맞게 jid, pid, cmdline을 출력한다.<br>

![Image](https://github.com/user-attachments/assets/f3e6df82-365c-45d8-90e6-721d601d0b3e)
<br>여기서 pid2jid()함수를 사용했는데, process id를 job id로 mapping해주는 함수이다.
pid를 인자로 받아 pid의 유효성 검사를 하고, jobs배열을 순회하며 pid를 통해 찾고자 하는 값을 찾아 addjob 함수에서 설정했던 jid를 return한다.
pid는 1부터 시작하는 것도 아니고 번호 치고는 길어서 사람 입장에서는 약간 헷갈리는데, jid를 통해 쉽게 작업을 관리할 수 있다.


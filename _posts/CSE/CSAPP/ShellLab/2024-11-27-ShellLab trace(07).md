---
title: "[CSAPP] ShellLab trace(07)"
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





## Trace 번호 (07)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/221c27fa-28dd-49eb-8a55-cac76dc75ee5)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/2df1167b-a1a2-48e0-995a-8f5c5f00289b)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/44505840-bbe1-4841-a6b9-925e6445121e)


<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/92563377-d426-42db-9239-7aa4db0be379)
<br>
trace07에서는 Built-in 명령어 ‘jobs’를 구현해야한다. 
trace07.txt파일을 보니, myspin1과 myspin2 프로그램을 각각 10초씩 background로 실행하고, 구현할 built-in 명령어 ‘jobs’를 실행하고 있다.
built-in 명령어이니 앞선 trace에서 구현했던 “quit”명령어와 비슷한 방식으로 “jobs”문자열에 대한 처리를 하기 위해 builtin_cmd() 함수를 수정하면 되겠다 싶었다. 

‘./sdriver -V -t 07 –s ./tshref’를 통해 output을 확인했는데, 특정 형식에 맞게 job의 list를 출력하고 있다. 강의자료에서 언급한 listjobs()함수를 써야겠다. 

<br>

![Image](https://github.com/user-attachments/assets/4052c1a4-f41e-4cd1-b6da-e2fbf916de15)
<br>
listjobs()는 jid, pid와 함께 현재 작업 리스트를 출력한다.
인자로 작업 목록을 가리키는 포인터와 output_fd를 받는데, output_fd가 익숙지 않아 찾아보니 출력 파일 디스크립터라고 한다. 이는 작업 목록을 출력할 때 사용되며 int값이다.
여기에서는 따로 파일에 기록할 필요가 없으니, tshref의 실행 결과를 참고하여 ‘STDOUT_FILENO’ 표준출력을 사용하여 출력을 터미널에 표시되도록 하면 되겠다.

‘STDOUT_FILENO’는 int타입이라는데 표준 라이브러리에서 제공하는 ‘unistd.h’ 헤더파일에 저장되어있다고 하여, 어떤 int값을 가질지 생각하며 unistd.h의 소스코드를 확인했다.
<br>

![Image](https://github.com/user-attachments/assets/c4df6e06-2ad6-4ca4-ac7c-3f4205315d1e)
<br>grep명령어를 사용하여 확인한 결과, 써야하는 ‘STDOUT_FILENO’는 int타입 1의 값이다. <br>

![Image](https://github.com/user-attachments/assets/43cb594d-6826-485c-8c28-75986366b478)

<br>
따라서 listjobs함수의 두 번째 인자로 1을 넘기면 된다. builtin_cmd()함수는 다음과 같이 구현된다.
<br>

![Image](https://github.com/user-attachments/assets/ac78c1fb-672d-4d26-8df8-9cc291e9dfb7)
![Image](https://github.com/user-attachments/assets/760fc63b-b25f-4844-9f0d-ac531ae85a02)

<br>
sdriver를 돌려봤는데 tshref와 내가 짠 tsh의 결과가 다르길래(내 결과는 ‘Running’이후 4칸 space, tshref 결과는 1칸 space), listjobs()함수의 사진 속 부분에서 space를 일괄 1칸으로 조정해준 결과 sdriver 테스트를 통과했다.<br>
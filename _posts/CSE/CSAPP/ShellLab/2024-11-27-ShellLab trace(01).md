---
title: "[CSAPP] ShellLab trace(01)"
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





## Trace 번호 (01)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/fe09b030-d8b5-4d97-ae1f-582c6eeb471a)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/d827c8cb-b974-404d-a125-3e9655626320)



### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/ff5217c5-7051-4a54-a1ad-4c107a64c6d7)



<br><br>

### trace 해결 방법 설명
trace01에서는 Built-in 명령어 ‘quit’을 구현해야 한다.
‘quit’ 명령어 입력 시 종료되도록 구현하자.

Built-in 명령어는 shell에서 처리 가능하므로 별도의 프로세스를 생성하지 않아도 된다.
따라서 eval함수에서 builtin_cmd를 호출하고, builtin_cmd함수에서 ‘quit’을 받은 경우 프로그램을 종료하고 그렇지 않은 경우(내장 명령어가 아님) 0을 return하여 외부 명령어로 간주하여 처리하게 할 것이다.

입력받은 명령어와 인자를 처리하기 위해 이들을 저장할 배열이 필요하다. char* 타입의 배열을 선언해준다. C에서 인자를 가리키는 포인터 배열에 argv(argument vector)의 이름을 붙이는 것이 관습이라고 하여 이름은 argv로 지어주었다.

![Image](https://github.com/user-attachments/assets/d02427f1-1dbe-452d-8763-e5249c463606)
<br>이 부분을 보면 MAXARGS로 128 값이 설정되어있다. 앞으로 어떤 명령어와 인자들이 얼만큼 들어올지 모르니 이걸 사용하여 배열의 크기를 설정해줬다.

![Image](https://github.com/user-attachments/assets/99f92010-5d67-414f-98cd-b9e706f936f6)
<br>명령어를 파싱해줄 함수가 있다. 줬으니 이걸 써보자.
이를 통해 사용자가 입력한 cmdline을 명령어와 인자로 분리하고, 분리한 부분을 argv에 저장한다.

![Image](https://github.com/user-attachments/assets/4437e011-372a-44b2-8de8-29692dffc55d)
<br>만든 argv를 builtin_cmd함수에 인자로 넘겨준다. eval함수는 이렇게 작성했다.

![Image](https://github.com/user-attachments/assets/0f8b9b10-3e46-4cd6-8441-f5cb2b39f2c1)
<br>builtin_cmd에서 받은 quit은 argv[0]에 저장되어있을 것이다. 이를 “quit”문자열과 비교하여(strcmp) 같다면 프로그램을 종료하고 아닐 경우 0을 return하게 했다.

<br><br>
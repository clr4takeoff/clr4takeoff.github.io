---
title: "[CSAPP] ShellLab trace(03)"
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





## Trace 번호 (03)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/6d871a25-939a-4f4e-be07-3f66f46d0681)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/66cc95b6-6769-4af9-8d0c-e529d1b757ad)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/3461f75a-8b5c-4b5c-846b-ae92c8255dfc)


<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/d14c2a52-a305-40d9-91b0-287826b83b61)
<br>trace03은 foreground작업 형태로 매개변수가 없는 프로그램을 실행하는 것을 구현한다.
trace03.txt파일을 확인했을 때, myspin1 프로그램을 실행하는 것을 알 수 있다.


![Image](https://github.com/user-attachments/assets/f92741bd-06b7-484e-bc68-c0b69428236d)
<br>./myspin1은 인자가 없이 프로그램을 실행하도록 한다. 지난 trace까지 구현한 eval()함수를 보자.
이미 execve()함수를 구현할 때, 이 함수가 받을 인자의 수가 확실하지 않으므로 parseline에 리스트를 넘겨주고 명령어와 인자들을 분리한 바 있다(argv[0]에 내장 명령어나 실행할 프로그램 이름 저장).

parseline함수가 cmdline을 parsing하면 argv[0]에 “./myspin1”이 들어가고 argv[1]부터 NULL이 들어간다. 이를 execve함수로 넘겨 인자 없는 프로그램을 실행할 수 있다.
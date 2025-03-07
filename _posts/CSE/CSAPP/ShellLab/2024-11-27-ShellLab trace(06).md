---
title: "[CSAPP] ShellLab trace(06)"
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





## Trace 번호 (06)

### 1. sdriver로 tsh실행
![Image](https://github.com/user-attachments/assets/8b02b9f7-6fd1-4850-8a24-db549619fcd1)

### 2. sdriver로 tshref실행
![Image](https://github.com/user-attachments/assets/a4792ebf-2533-49b2-a5ee-a580bca3324e)


### 각 trace 별 플로우 차트
![Image](https://github.com/user-attachments/assets/044236cf-0452-4406-b6a6-4ce69e3e5588)


<br><br>

### trace 해결 방법 설명
![Image](https://github.com/user-attachments/assets/c8cc1b20-c3f9-49ea-9eaa-844ffad6d90f)

<br>
trace06은 프로그램을 foreground와 background 작업으로 동시에 실행하는 것이다.

sdriver 실행 결과를 봤을 때 myspin1 프로그램을 background로, myspin2 프로그램을 foreground로 실행한다. 근데 “./myspin2 1”에서 왜 뒤에 1이 붙는지 궁금하여 myspin2.c 코드를 열어봤다.<br>

![Image](https://github.com/user-attachments/assets/4e0fbbff-f852-4df9-8a91-13cfda77c873)

<br>
주석을 살펴보니 두 가지의 모드로 실행 가능하다고 한다.<br>


![Image](https://github.com/user-attachments/assets/607b2b9a-5e19-4382-9ad3-2bafeb5c9906)

<br>
trace해결에 중요한 부분만 살펴보면, 직접 “./myspin2”를 입력하여 실행하는 경우 standalone 모드로 실행되는데, 인자가 있을 경우 숫자(시간)으로 받고 해당 시간동안 대기하고 종료한다(없을 경우 기본-JOB_TIMEOUT- 시간동안)
즉 “./myspin2 1”은 1초동안 대기하고 프로그램을 종료하라는 것이었다.

그리고 trace05에서 eval()함수에 foreground와 background 작업 형태에 따라 다르게 처리되도록 각각 구현했고, 지금까지 foreground와 background 실행 trace를 잘 통과했으므로 역시 의도한 작업을 수행 가능하다.
<br><br>
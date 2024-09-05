---
title: "[백준]4358 - Hardwood Species"
categories:
  - Algorithm
tags:
  - boj

date: 2024-08-08
last_modified_at: 2024-08-08
comments: true
---
## 고려사항
### 1. 시간초과<br/>
input()으로 입력을 받아서 그런가... 하고 input() 대신 sys.stdin.readline()을 사용해야겠다 생각함.<br/><br/>
```python
# 시간 초과

import sys
import math
from collections import defaultdict

d=defaultdict(int)

while True:
    try:
        a=input()
        if a:
            d[a]+=1
    except EOFError:
        break

total=sum(d.values())
keys = sorted(d.keys())

for k in keys:
    print(f"{k} {(d[k]/total)*100:.4f}")
```

<br/><br/>
### 2. 런타임 에러(ModuleNotFoundError)<br/>
외부 라이브러리를 사용하면 안되니까 뜨는 에러인가보다. 찾아보니 SortedDict가 딕셔너리 정렬에 좋은 것 같아서 써봤는데 안된다고 함.<br/><br/><img width="857" alt="Screenshot 2024-08-08 at 8 07 51 AM" src="https://github.com/user-attachments/assets/c1d156e3-66e5-40b9-93d6-8dc90a61a864">

```python
# 런타임 에러(ModuleNotFoundError)

import sys
from sortedcontainers import SortedDict

d=SortedDict()

while True:
    a=sys.stdin.readline()
    if not a:
        break
    if a in d:
        d[a]+=1
    else:
        d[a]=1

total=sum(d.values())

for k in d:
    print(f"{k} {(d[k]/total)*100:.4f}")
```

<br/><br/>
### 3. 출력 형식이 잘못되었습니다	<br/>
왜 잘못됐나 하고 예제 입력 텍스트를 긁어봤는데 줄마다 맨 끝에 공백이 있었음. .strip() 사용하여 입력에서 개행 문자를 제거해야 함. <br/><br/><img width="491" alt="Screenshot 2024-08-08 at 8 10 57 AM" src="https://github.com/user-attachments/assets/6adbc409-05aa-428e-923d-0f6ddd0aa494">

```python
# 출력 형식이 잘못되었습니다

import sys

d={}

while True:
    a=sys.stdin.readline()
    if not a:
        break
    if a in d:
        d[a]+=1
    else:
        d[a]=1

total=sum(d.values())
keys=sorted(d.keys())

for k in keys:
    print(f"{k} {(d[k]/total)*100:.4f}")
```
 
 
 <br/><br/>
## 최종 코드 
```python
#S2_4358_Hardwood Species

import sys

d={}

while True:
    a=sys.stdin.readline().strip()
    if not a:
        break
    if a in d:
        d[a]+=1
    else:
        d[a]=1

total=sum(d.values())
keys=sorted(d.keys())

for k in keys:
    print(f"{k} {(d[k]/total)*100:.4f}")
```






---
title: "[CSAPP] MallocLab (Naïve)"
categories:
  - csapp
tags:
  - CSAPP
  - SystemProgramming
  - MallocLab
toc: true
toc_sticky: true

date: 2024-12-07
last_modified_at: 2024-12-07
comments: true
type: malloclab
---

## Results
![Image](https://github.com/user-attachments/assets/53ed2616-6a7d-42e3-a7f2-9747add2bd7c)

<br><br>

## 구현 방법

#### 1. make naive 후에 mdriver를 이용해 점수 측정

mm-naive.c 파일을 참고하여 각 함수를 보고 기능을 파악해보았다.

<br>

##### 1) 사용 매크로

![Image](https://github.com/user-attachments/assets/35d8015f-8ce3-4c75-a61a-911b989148f2)


(1) #define ALIGNMENT 8메모리를 8byte단위로 정렬한다는 것을 의미

(2) #define ALIGN(size) (((size) + (ALIGNMENT-1)) & ~0x7)
size값을 8byte로 맞추도록 올림함

(3) #define SIZE_T_SIZE (ALIGN(sizeof(size_t)))
align을 위해 size값을 8byte로 맞추도록 올림함. 

(4) #define SIZE_PTR(p)  ((size_t*)(((char*)(p)) - SIZE_T_SIZE))
메모리 블록의 크기 정보를 얻을 수 있음. p는 할당된 메모리 블록의 데이터 시작 주소를 나타내고, p에서 size_t크기만큼 뒤로 이동하여 메모리 블록의 크기가 저장된 위치로 가서 크기를 파악함.

<br>

##### 2) int mm-init()
 별다른 내용이 구현되어있지 않고 0을 리턴한다. 

<br>

##### 3) void *malloc(size_t size)
![Image](https://github.com/user-attachments/assets/d4a00943-5d2d-4f5f-8e65-7ded19b42623)

메모리 할당을 수행한다. size는 사용자가 요청한 크기이고, newsize에 아까 정의한 ALIGN을 사용하여, 사용자의 요청 크기 size와 그것을 저장하기 위한 공간을 더하여 8byte 정렬 가능한 크기를 가지도록 조정한다.

![Image](https://github.com/user-attachments/assets/87e85a68-0248-4cd7-9b39-fda7131326f3)


 mem_sbrk(memory set break)는 시스템 호출인데, newsize만큼 프로세스의 힙을 확장하여 메모리 블록을 할당받는다. 반환값은 메모리 블록의 시작 주소이니 이를 unsigned char *p로 받는다.
밑에 디버깅을 위한 주석이 있다.
  mem_sbrk가 실패하여 메모리 할당이 안되면 p는 음수값이 될 것인데, 그러면 NULL을 반환한다.
 만약 메모리 할당이 잘 이루어졌다면 p는 할당된 메모리의 시작 주소를 가리키고 있는데, 메타데이터(할당된 크기)가 메모리 블록 시작점에 저장되어야 한다. 그래서 p는 데이터 시작점이 아닌 size_t 크기의 메타데이터의 시작점을 가리키고 있을 테니, 올바른 데이터 조작을 위해 p값에 SIZE_T_SIZE를 더하여 실제 데이터 시작점으로 이동한다. p가 가리키는 메모리 블록에서 size_t크기만큼 뒤로 이동하여 할당된 블록의 크기가 저장된 곳에 size를 기록하고 p를 반환한다.

<br>

##### 4) void free(void *ptr)
구현되어있지 않다.

<br>

##### 5) void *realloc(void *oldptr, size_t size)
![Image](https://github.com/user-attachments/assets/2dc2ea06-681f-4631-a85d-31bae414abd3)

realloc()에는 메모리 재할당을 수행하는 기능이 구현되어있다. 

 첫 번째 if블럭을 보면 할당 요청 크기가 0인 경우 기존 메모리 블록을 해제한다. 이 경우 free를 호출하고 NULL을 반환하므로 사실상 free의 역할을 그대로 수행하고 있다.
 
 두 번째 if블럭을 보면 oldptr이 NULL인 경우 새로운 메모리를 할당하는데, 기존에 할당된 메모리가 없는 경우 새로운 메모리를 할당하므로 사실상 malloc의 역할을 그대로 수행하고 있다.

 세 번째 if블럭을 보면 새로운 메모리를 할당하여 newptr에 저장하고, 실패하면 NULL을 반환하게 한다.
 
  네 번째 if블럭을 보면 기존 블록의 크기를 헤더에서 가져오고, 할당 요청된 크기(size)가 기존 블록의 크기(oldsize)보다 작으면 복사할 데이터 크기를 size로 제한하여 메모리를 축소한다. 그리고 memcpy를 이용하여 기존 블록에서 새로 할당된 블록으로 데이터를 복사한다. 이후 free()(구현은 되어있지 않으나)하고 새로 할당된 메모리 블록의 시작 주소를 반환한다.
 
<br>

##### 6) void *calloc (size_t nmemb, size_t size)
calloc()함수는 두 개의 매개변수를 받아 메모리 할당과 초기화를 한다. nmemb는 할당할 블록 개수, size는 각 블록의 크기이다. bytes에 할당할 메모리 크기를 nmemb * size로 계산하여 넣는다. newptr를 사용하여 메모리를 할당하고 모든 바이트를 0으로 초기화하여 garbage value를 방지한다. (malloc과 다른 점 – malloc은 메모리만 할당하고 초기화하지 않지만, calloc은 메모리 할당후 0으로 초기화한다.)

<br>

##### 7) void mm_checkheap(int verbose)
구현되어있지 않다.


 이론 강의에서 메모리의 효율적인 사용을 위해 메모리블록의 할당을 해제하고 비어있는 블록을 병합하여 새로운 할당에 용이하게 하는 방법을 배웠다. 현재 mm-naive.c 파일에서는 이런 점이 구현되어있지 않아, 시스템에서 사용하는 메모리가 계속 증가하여 utilization 점수가 상대적으로 낮게 나오는 듯하다.  이에 비해 메모리 할당 시 mem_sbrk로 메모리를 연속적으로 키우고 다른 관리를 하지 않으므로 throughput은 비교적 높게 나온다.
---
title: "[CSAPP] MallocLab (explicit)"
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
![Image](https://github.com/user-attachments/assets/7a067cfa-c359-4747-84cb-0f535c8d928c)


<br><br>

## 구현 방법
실습 진행 절차에 맞게 수행해보았다.

### 1. make explicit 후에 mm.c를 수정할 것 ( linker : mm.c -> mm-explicit.c )
![Image](https://github.com/user-attachments/assets/c11391eb-5f01-4e78-95f6-942bbb6d2aa8)


make explicit 후에 mm.c를 수정하여 mm-explicit.c로 연결하고 링크해준다. 이제 explicit free list 방식으로 메모리 할당을 구현할 준비가 되었다.

<br><br>

### 2. extend_heap() 함수를 구현 - heap에 가용 메모리 할당
우선 explicit에서 사용할 매크로를 살펴보자. implicit에서 사용했던 매크로는 설명을 생략한다.
![Image](https://github.com/user-attachments/assets/766812ef-b955-4166-8b4e-4690dabdfc87)

<style>
code {
    color: #5b93b5;
}
</style>

**1)** <code>#define HDRSIZE 4</code>  
   블록의 헤더 크기를 나타낸다. 4바이트.

**2)** <code>#define FTRSIZE 4</code>  
   푸터의 사이즈를 나타낸다. 4바이트.

**3)** <code>#define GET8(p) ((unsigned long)(p))</code>  
   주소 p에서 8바이트 크기의 값을 읽어온다.

**4)** <code>#define PUT8(p, val) ((unsigned long)(p) = (unsigned long)(val))</code>  
   주소 p에 8바이트 크기 val값을 저장한다.

**5)** <code>#define NEXT_FREEP(bp) ((char)(bp))</code>  
   free 블록 리스트에서 현재 블록의 다음 블록 시작 주소를 반환한다.

**6)** <code>#define PREV_FREEP(bp) ((char)(bp) + DSIZE)</code>  
   free 블록 리스트에서 현재 블록의 이전 블록 시작 주소를 리턴한다.

**7)** <code>#define NEXT_FREE_BLKP(bp) ((char)GET8((char)(bp)))</code>  
   free 블록 리스트에서 현재 블록의 다음 free 블록 포인터를 계산한다.

**8)** <code>#define PREV_FREE_BLKP(bp) ((char)GET8((char)(bp) + DSIZE))</code>  
   free 블록 리스트에서 현재 블록의 이전 free 블록 포인터를 계산한다.

implicit 구현에서 추가된 매크로를 살펴보았으니, 본격적으로 함수를 구현해보자.

<br><br>

![Image](https://github.com/user-attachments/assets/f3b988a2-b31c-40c6-85ca-5498ccd8e32a)

 extend_heap은 implicit때의 구현과 마찬가지로 힙을 확장하는 역할을 하는 함수이다. 
확장할 크기는 항상 8바이트 align을 유지해야하므로 요청된 words가 홀수라면 1을 더해 짝수로 만든다. mem_sbrk(size)를 호출하여 힙을 확장후 실패시 NULL을 반환한다.
확장후 블록의 헤더와 푸터, 에필로그를 설정하고 인접 블록과 병합을 수행하도록 한다. 
 다만 현재 coalesce함수가 구현되어있지 않으므로, 이후 코드와의 연동성을 위해 coalesce함수에서 임시로 return값을 블록의 시작 주소인 bp로 반환하도록 했다. (extend_heap함수에서 return bp;를 하는 것과 같은 동작)

<br><br>

### 3. mm_init() 함수를 explicit 구조에 맞게 구현 ( implict에서 사용한 프롤로그 및 에필로그 구조에서 next, prev 포인터 구조 추가 )

![Image](https://github.com/user-attachments/assets/6338e5c7-7363-43f8-aca0-7bfb3f502023)

강의자료를 참고하여 작성하였다. mm_init함수는 메모리 할당을 위한 초기화를 해주는 함수이다.

 mem_sbrk로 DSIZE*2만큼 힙을 확장하며 초기화하고, 그 값을 h_ptr에 저장한다. 실패 시 NULL이 되어 함수는 –1을 반환하게 된다. h_ptr는 힙의 시작 주소를 추적하는데, static char *h_ptr로 전역에 정의했다. fbp는 전역에 static char *fbp로 정의하였고, 초기 힙의 시작 주소를 가리키는 포인터이다. 아직 free block이 없어 NULL로 초기화했다.  이제 초기 힙에 들어갈 내용을 설정한다. PUT이 총 네 번 나오는데, 맨 위부터 Alignment padding, prologue header, prologue footer, epilogue header를 넣어 경계 조건을 설정한다. 

 그리고 extend_heap을 호출하여 초기 힙을 확장하여 메모리 공간을 확보한다. 확장에 실패하면 –1을 반환한다. 이제 메모리를 할당받을 준비가 되었다.

<br><br>

### 4. find_fit() 함수를 구현
( 프롤로그로부터 free block의 linked list를 타고 free block을 찾아 반환 )

이 함수는 asize에 맞는 블록을 힙에서 찾는 역할을 수행하는 역할을 한다.
first-fit, next-fit, best-fit 중 어느 것으로 구현하느냐에 따라 utilization과 throughput 점수가 달라질 수 있는데, 일단 세 경우 다 구현해보았다.

#### 1) first-fit
![Image](https://github.com/user-attachments/assets/67b2d740-f81e-445d-8298-4e0ffea36d95)
<br>
 먼저 h_ptr이 NULL인지 확인하여 힙의 초기화 상태를 확인하고, 초기화되어있지 않거나 비어있으면 NULL을 반환한다.

for 루프 내부에서 implicit 구현과 다른 점을 찾을 수 있다. h_ptr에서 시작하여 힙에 있는 free 블록을 차례대로 탐색하고, 그중 asize보다 크기가 같거나 큰 블록을 찾는다면 그 블록의 포인터(bp)를 반환한다. 만약 그런 블록을 끝까지 찾지 못하면 NULL을 반환한다. 

<br>

#### 2) next-fit
![Image](https://github.com/user-attachments/assets/2832ef18-4116-4d61-a538-00ac0ba7ce6c)
<br>
first-fit과 얼추 비슷하지만, 마지막으로 할당된 블록의 포인터(last_bp)부터 탐색을 한다는 점에서 차이가 있다. 적합한 블록을 찾았을 경우 last_bp를 현재 블록을 가리키는 포인터 bp값으로 업데이트하고, 힙을 한 바퀴 돌았을 경우 (bp==last_bp) 적합한 블록을 찾지 못했다는 뜻이므로 NULL을 반환하도록 한다. 이 구현방법을 사용한 코드에서, last_bp의 경우 static char *last_bp로 전역에 선언해주고, mm_init함수에서 NULL로 초기화했다.


#### 3) best-fit
![Image](https://github.com/user-attachments/assets/207b8498-6cce-4e64-9c94-977c5935944f)

힙에서 asize에 가장 가까운 크기를 가진 블록을 선택한다. h_ptr부터 모든 블록을 탐색하여 asize와 각 블록의 크기를 비교하고, 그 크기보다 크거나 같은 블록 중 가장 차이가 적은(min_diff) 블록을 선택한다.
일단 만들어뒀으니 최종 테스트에서 어떤 방법이 좋을지 선택하겠다.

<br><br>

### 5. place() 함수를 구현 - 할당 표시 및 free block의 linked list 업데이트
![Image](https://github.com/user-attachments/assets/865846b5-86dc-423a-b637-9295634e52e1)

이후 절차에 블록을 나누는 과정이 있으므로, 일단 블록을 나누지 않는 방법으로 구현해보았다.
 
 현재 블록의 헤더와 푸터에 할당 상태(1)와 asize크기를 설정한다. 그리고 매크로를 이용하여 만든 next_bp, prev_bp 포인터로 현재 블록의 이전 블록과 다음 블록에 접근할 수 있게 한다. 이때 헤더와 푸터는 4바이트이므로 PUT을 사용했다.

 현재 블록 리스트에 하나의 블록만 있는 경우, fbp를 NULL로 선택하여 free block list를 비우고 return하여 다음 if문들을 피하도록 했다.

 현재 블록이 첫 번째 블록이 아니면 PUT8 매크로를 사용해서 이후 블록의 이전 포인터를 NULL로 설정하여 현재 블록과의 연결을 끊고, fbp를 다음 블록을 가리키게 하여 free block list의 새로운 head로 설정한다. 이후 바로 return하여 다음 if문들을 피하도록 했다.

 그리고 마지막 블록인 경우 이전 블록의 다음 포인터를 NULL로 설정하여 현재 블록과 연결을 끊고 return하여 다음 if문들을 피하도록 했다.

 마지막으로 기본 상황이다. 중간 블록인 경우 이전 블록의 다음 포인터를 next_bp로 설정하고 다음 블록의 이전 포인터를 prev_bp로 설정하여 현재 블록의 연결을 끊고 그 블록의 이전과 다음이 서로 연결되도록 했다.

 추가로, 처음에 위의 PUT8을 생각없이 PUT으로 썼다가 segmentation fault와 지겹도록 만났다... 포인터는 8바이트이므로 PUT8을 사용하는 것이 맞다. 앞으로 유의해야겠다.

<br><br>

### 6. malloc() 함수를 구현
![Image](https://github.com/user-attachments/assets/386bd507-2df8-4ed7-acdc-2e2c1990de9e)
<br>
 size가 올바르지 않은 경우(0 이하) NULL을 반환하도록 처리했다.

asize는 요청된 크기 size에 OVERHEAD(헤더와 푸터 크기를 더한 값)을 더한 값을 ALIGN으로 8의 배수가 되도록 조정하고, size가 너무 작더라도 최소 DSIZE*3(24바이트) 크기는 보장되도록 MAX로 감싸준다. (헤더, 푸터, prev, next 포인터 각각 4+4+8+8=24)

 다음 if문에서 적당한 블록을 찾아 할당하고, 적합한 블록을 찾지 못하면 extend_heap으로 힙을 확장한 후 place로 블록을 할당한다. 메모리가 잘 할당되면 그 블록의 포인터(할당된 메모리 주소)를 전달한다.


<br><br>

### 7. realloc() 함수를 구현
![Image](https://github.com/user-attachments/assets/e010eab2-995b-4782-b8e6-c4eff2d1bc3e)

implicit 구현과 동일한 코드이므로 생략.

<br><br>

### 8. make 후 mdriver를 이용해 점수를 측정
![Image](https://github.com/user-attachments/assets/747fb847-28ea-414c-b1e3-aa9fdbb922fa)

 implicit 구현 당시와 동일하게, free함수와 coalesce 함수를 추가하지 않은 상태로 mdriver로 성능을 측정하니 util점수가 현저히 낮게 나왔다. find_fit을 first-fit, next-fit, best-fit 각각으로 나누어 코드를 구현했었는데, 모두 테스트해봤지만 util점수가 동일하게 나왔다. 아직 기존 블록이 재사용되는 상황 없이, extend_heap함수에서 새로운 블록을 리스트의 첫 번째에 추가하도록 해서 그렇게 나오는 것이라고 예상한다.
 implicit과 마찬가지로 이후 함수 구현으로 성능 향상을 기대할 수 있을 테니, 큰 걱정 없이 다음 단계로 넘어갔다.

<br><br>

### 9. free() 함수를 구현
![Image](https://github.com/user-attachments/assets/ac2f3c0a-e3de-4639-b4e7-d0dce7e772c3)

전달된 포인터가 NULL이라 해제할 메모리가 없으면 안전한 처리를 위해 함수를 종료한다(이미 구현되어있었음).

 해제하려는 블록의 크기를 가져와 csize에 저장하고, 헤더와 푸터에 대해 블록의 크기 size와 해제된 상태(0)를 업데이트한 후, coalesce함수를 호출한다.
 아까 extend_heap에서와 마찬가지로 현재까지 coalesce함수가 구현되어있지 않으므로, 이후 코드와의 연동성을 위해 coalesce함수에서 임시로 return값을 블록의 시작 주소인 bp로 반환하도록 했다. (free 함수에서 return ptr;를 하는 것과 같은 동작)

<br><br>

### 10. make 후에 mdriver를 이용해 점수 측정
![Image](https://github.com/user-attachments/assets/f3b1a227-c220-442c-acd4-1039428b9bc8)

first-fit 24+40
next-fit 24+40
best-fit 45+40
 best-fit이 앞으로도 잘 나올 것 같으니, 앞으로 남은 실습 단계에서 최종 mdriver 실행 전까지 best-fit으로 구현한 find_fit 함수를 이용하여 테스트해보겠다.
 확실히 free함수 추가 후 블록의 재사용이 가능해져 메모리를 더 효율적으로 사용할 수 있게 되었다.

<br><br>

### 11. place() 함수에 block을 나누는 코드 추가
![Image](https://github.com/user-attachments/assets/22f39594-1c67-466a-b64e-eb0917f4c88f)

 기존 코드에 크기조건을 포함하여, 블록을 요청 크기(asize)만큼 할당한 후 나머지 nbsize(new block size)크기만큼 free block으로 분리하려고 한다.

 if블럭이 새로 추가되었다. 먼저 블록에서 asize만큼 할당한 후 남은 nbsize만큼의 블록이 default size(24byte)이상일 경우 블록을 분할한다. 전의 malloc함수 구현 시 헤더, 푸터, prev, next 포인터 각각 4+4+8+8=24로 설정했던 것을 기억하여, 최소 블록 크기를 보장해주는 것이다.
 현재 블록의 헤더와 푸터에 블록의 할당 상태를 표시하고 현재 블록의 바로 뒤에 rp 포인터로 새로운 블록을 생성한다. 그리고 이 블록의 이전과 다음 포인터를 초기화하여 현재 위치를 따져 기존 free block list에 추가하여 위치에 맞는 처리를 해주고 (if문 3개), 블록의 크기는 nbsize로 아까 분할하고 남은 크기를 그대로 가져오며, 상태는 0으로 설정하여 할당 가능한 상태를 나타낸다. 이후 return하여 함수를 종료한다.

 나머지 부분은 기존 코드와 동일하므로 설명을 생략한다.

<br><br>

### 12. make 후에 mdriver를 이용해 점수 측정
![Image](https://github.com/user-attachments/assets/efe65edc-469b-45d3-8d4c-e2fdd0ae6113)

 당연히 점수가 오를 줄 알았는데 점수가 떨어졌다. 정확히 말하면, utilzation 점수는 증가했지만 throughput점수가 상당히 떨어졌다. 이에 이유를 예측해보았다.

- util점수가 올랐다 → 내부 단편화가 줄었다. (아직 블록 결합 코드가 없으므로 외부 단편화는 증가할텐데, 내부 단편화가 줄어든 비율이 외부 단편화 증가 비율보다 크므로 util점수가 상승했겠거니 추측한다.)
- thru점수가 떨어졌다 → 블록 분할 과정에서 추가 연산, 리스트 관리에 필요한 오버헤드가 생김

coalescing 코드를 구현한 후 점수가 오르길 기대하며 일단 다음 단계로 넘어갔다. 


<br><br>
### 13. free() 함수에 block 결합(coalescing) 코드 추가

![Image](https://github.com/user-attachments/assets/833950e1-0e44-4e2e-83aa-cc0fc1338fcf)<br>

![Image](https://github.com/user-attachments/assets/3fb6262f-4449-47d3-92bd-1545aa3e5a1a)<br>

![Image](https://github.com/user-attachments/assets/2a2dedc4-89ac-4e54-83e9-c62a7875bf22)


 코드가 상당히 길다. 천천히 살펴보도록 하자...
우선 지역변수로 선언한 변수가 많다. 이전 블록과 다음 블록의 정보를 미리 받아와서 코드의 복잡도를 낮추기 위함이다.

- *prev_bp / *next_bp : bp의 이전과 다음 블록을 가리키는 포인터
- prev_alloc / next_alloc : 이전과 다음 블록이 할당되어있는지 여부
- csize : coalesce 후 블록의 size

 매크로로 인하여 코드가 길어질 수 있어 변수로 담았다. 코드를 대충 훑어보았을 때 if블럭이 상당히 많아보인다. 그만큼 구분해야 할 case가 많았다는 뜻이다. 우선 크게 네 가지 case로 구분해볼 수 있다.

<br>

**Case 1) 이전 블록과 다음 블록이 모두 할당되어있음**

**Case 2) 이전 블록만 free**

**Case 3) 다음 블록만 free**

**Case 4) 이전 블록과 다음 블록 모두 free**


<br>

이 함수 구현을 위해 free과정에서의 LIFO정책을 이해해야 한다.
이는 explicit free list에서 free로 반환된 블록을 가용리스트에 끼워넣을 때, 맨 앞에 끼워넣는 방법을 말한다. 간단하고 상수시간이 소요된다는 특징이 있다.

코드의 직관성을 위해 반복되는 코드는 따로 다음 두 개의 함수를 정의하여 관리했다.

**1) unlink_block(void *bp)** <br>
 이 함수는 bp를 block list에서 제거하여 bp의 이전 블록과 다음 블록을 서로 연결해주는 역할을 한다.
 현재 블록의 이전 가용 블록과 다음 가용 블록을 가져와, 이전 블록이 없는 경우 바로 반환하고 아닌 경우 prev_bp의 다음 블록 포인터에 next_bp를 저장한다. prev_bp는 이제 bp를 건너뛰고 next_bp를 가리키게 된다. 
 만약 bp가 마지막 블록이 아니었다면 next_bp의 이전 블록 포인터에 prev_bp를 저장하여 bp를 건너뛰게 한다.


**2) link_block(void *x, void *y)** <br>
 이 함수는 x블록 다음에 y블록을 연결해주는 역할을 한다. x블록의 다음 포인터에 y를 저장하고, y가 NULL이 아니라면(valid) y의 이전 블록 포인터에 x를 저장한다.

이제 블록 병합 과정을 case별로 하나씩 살펴보자. 코드를 제외한 사진은 모두 이론 강의 자료에서 추출하였다.

<br><br>

#### Case 1) 이전 블록과 다음 블록이 모두 할당되어있음
![Image](https://github.com/user-attachments/assets/c1d8dd35-be71-4354-bf2b-3248cedc144b)

![Image](https://github.com/user-attachments/assets/e4ad73c7-3ad9-4127-8e2a-77cf2bd917bd)
<br>
현재 블록 bp를 free list에 추가해야 한다. 먼저 PUT8매크로를 이용하여 현재 블록의 이전과 다음 블록을 가리키는 주소를 초기화(NULL)한다. 이전 블록과 다음 블록이 없는 상태로 떼어내고 기존 free list가 있다면(fbp!=NULL) 현재 블록 bp를 그 앞에 추가하고 fbp의 이전 포인터값으로 bp를 넣어준다. 또 fbp를 현재 블록 bp값으로 갱신하여 bp를 결과적으로 free block list의 첫 번째 블록이 되도록 한다.

<br>

#### Case 2) 이전 블록만 free
![Image](https://github.com/user-attachments/assets/8cd4c1b4-4fbd-4b13-a333-7e6a5044816c)

![Image](https://github.com/user-attachments/assets/19adcb3d-afc2-4905-bb0f-0cbda3a6c7c6)

<br>
 이전 블록과 현재 블록을 병합해야 한다. 우선 이전 블록의 크기를 현재 블록의 크기인 csize에 더하고 이전 블록을 free block list에서 제거한다(unlink). 그리고 이전 블록이 첫 블록이 아닐 경우, 병합된 블록을 free block list의 헤드로 설정하기 위해 이전 블록 포인터의 다음 포인터를 원래 맨 앞에 있던 블록으로 주고, 원래 맨 앞에 있던 블록의 이전 포인터를 병합된 블록으로 주며 맨 앞에 삽입하는 효과를 준다.
 헤더와 푸터의 할당 상태와 사이즈를 설정한 후 fbp를 새로 맨 앞에 들어온 블록으로 설정해주고 반환한다.


<br>

#### Case 3) 다음 블록만 free 
![Image](https://github.com/user-attachments/assets/cd565f31-3ec0-4de0-8a04-4035b209588a)

![Image](https://github.com/user-attachments/assets/7ef1d264-49dd-4abd-8e70-3108f15960a5)

 다음 블록과 현재 블록을 합병해야한다. 먼저 새로운 블록의 크기를 계산하고 다음 블록을 제거한 후(unlink), 현재 블록의 이전 포인터를 초기화하고 다음 블록이 free block list의 첫 블록이라면 병합된 블록(bp)을 새로운 헤드로 설정한다. 첫 블록이 아니라면 병합된 블록을 free block list의 첫 블록이 되도록 포인터를 원래의 헤드 블록과 서로 연결해주고, 병합된 블록의 헤더와 푸터를 새로운 크기 csize와 0으로 업데이트해준 후 fbp에 bp값을 주어 free block list의 첫 블록으로 설정한 후 반환한다.

<br>

#### Case 4) 이전 블록과 다음 블록 모두 free
![Image](https://github.com/user-attachments/assets/241415d1-363d-47b3-8f79-d2fc1bfc9a12)
<br>
 이 경우에는 병합할 두 블록이 free block list의 첫 번째 블록이었는지 아닌지 여부에 따라 여러 가지 case로 나뉠 수 있다. 우선 이전 블록과 다음 블록 크기를 더하여, 공통적으로 쓰일 csize값을 구해둔다.

<br>

##### Case 4-1) default
![Image](https://github.com/user-attachments/assets/a5cf944d-d139-48bd-9bcb-062cc262e954)

이전 블록과 다음 블록을 free list에서 제거(unlink) -> 병합된 블록의 이전 포인터를 초기화 -> 그 블록을 free block list의 첫 블록으로 연결 -> 헤더와 푸터에 크기와 할당 상태 부여 -> 헤드 포인터 갱신 후 반환


<br>

##### Case 4-2) 다음 블록이 free block list의 첫 블록이며, 이전 블록이 다음 블록의 다음 가용 블록임
![Image](https://github.com/user-attachments/assets/862572ac-906e-4b52-b087-5c1053f4129d)
<br>

이 경우 이전 블록과 다음 블록이 이미 이웃하여 병합과정만 필요하다. 이전 블록의 다음 free 블록을 left_next 포인터에 담는다(left_next는 절대 prev_bp가 아님). 병합한 블록을 free block list의 첫 블록으로 연결하기 위해 이전 포인터를 초기화하고, 이전 블록과 다음 블록을 연결한다. 이후 헤더와 푸터에 크기와 할당 상태를 부여하고 헤드 포인터 갱신 후 반환한다.

<br>

##### Case 4-3) 다음 블록이 free block list의 첫 블록이며, 이전 블록이 다음 블록의 다음 가용 블록이 아님
![Image](https://github.com/user-attachments/assets/825e6a9c-1055-4319-8e17-89b6ecb0452b)
<br>
이 경우 이전 블록은 다른 블록과 연결된 상태일 수 있다. 이전 블록을 free block list에서 제거하고 이전 블록의 이전 포인터도 초기화. 병합된 블록을 다음 블록의 다음 포인터로 설정하고 헤더와 푸터에 크기와 할당 상태를 부여하고 헤드 포인터 갱신 후 반환한다.

<br>

##### Case 4-4) 이전 블록이 free block list의 첫 블록이며, 다음 블록이 이전 블록의 다음 가용 블록임
![Image](https://github.com/user-attachments/assets/8a6b358c-cb61-4c09-aef1-0dd52aecd6d5)
<br>
이 경우 이전 블록이 헤드이므로 이전 블록 기준 병합이 가능하다. 다음 블록의 다음 free block을 right_next 포인터에 넣고 prev_bp를 right_next에 연결한다. 이 경우 이전 블록을 기준으로 병합 가능. 헤더와 푸터에 크기와 할당 상태를 부여하고 헤드 포인터 갱신 후 반환한다.

<br>

##### Case 4-5) 이전 블록이 free block list의 첫 블록이며, 다음 블록이 이전 블록의 다음 가용 블록이 아님
![Image](https://github.com/user-attachments/assets/25ddd91c-7e15-4aa6-9c68-e245bde20987)
<br>
이 경우 이전 블록이 헤드이므로 이전 블록 기준 병합이 가능하다. left_next로 이전 블록의 다음 free block을 찾고(left_next는 next_bp가 아니다), next_bp가 가리키는 블록을 free block list에서 제거하고(unlink), prev_bp와 left_next를 직접 연결한다. 이후 헤더와 푸터에 크기와 할당 상태를 부여하고 헤드 포인터 갱신 후 반환한다.

<br><br><br>

### 14. make 후에 mdriver를 이용해 점수 측정
![Image](https://github.com/user-attachments/assets/98e6be67-4c19-4461-bc3e-23d6960ae669)
<br>
coalescing 코드에 의해 외부 단편화가 줄어들어 util이 좋아졌다고 추측할 수 있다.

<br><br><br><br><br><br><br><br>

### 📍 추가 개선
![Image](https://github.com/user-attachments/assets/77cb9b06-5f92-488d-a951-e7f8bafded1e)

![Image](https://github.com/user-attachments/assets/da5d24ab-0e97-49d0-a9d2-ceb45ed52f1d)

implicit 구현에서 mm_init함수의 해당 부분을 주석으로 제거 후 util 점수를 올린 기억이 있다. 역시 점수가 올라갔다(3점). 기존에 이렇게 할당했던 건 불필요한 메모리였고, 초기 설정한 힙 크기로도 충분했나보다. 

![Image](https://github.com/user-attachments/assets/163f6820-bab1-4f24-b8e3-2e2e37890386)

참고로, find-fit을 best-fit이 아닌 다른 두 방법으로 구현 시 util점수가 조금 떨어진다.
따라서 최종 코드는 변함 없이 best-fit으로 작성하였다.
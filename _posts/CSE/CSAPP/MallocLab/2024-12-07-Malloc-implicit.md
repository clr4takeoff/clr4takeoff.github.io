---
title: "[CSAPP] MallocLab (Implicit)"
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
![Image](https://github.com/user-attachments/assets/9711e05f-3e3c-458a-afa3-58fc6c9cf1e0)

<br><br>

## 구현 방법
- naive에 이어서 구현.

<br><br>

### 2. mm_init() 함수를 구현 
 mm-init()함수는 memory heap을 초기화하고 초기 블록을 만든다. 강의 자료에 따르면, 프롤로그와 에필로그로 구성된 초기 블록을 만들고 extend_heap으로 최초의 heap을 할당받아야 한다. 이를 위해 다음의 매크로를 이용한다.

 ![Image](https://github.com/user-attachments/assets/337616ab-8e36-434e-803e-2fc824e64cf2)

<style>
code {
    color: #5b93b5;
}
</style>

**1)** <code>#define ALIGNMENT</code>  
   8메모리를 8byte 단위로 정렬한다는 것을 의미 (기존에 정의되어 있었음)

**2)** <code>#define ALIGN(p) (((size_t)(p) + (ALIGNMENT - 1)) & ~0x7)</code>  
   메모리 주소를 8byte 단위로, 주소 p를 올림하여 정렬. p를 size_t 타입으로 변환하여 정수 연산을 가능하게 한다. (기존에 정의되어 있었음)

**3)** <code>#define PACK(size, alloc) ((size) | (alloc))</code>  
   헤더나 푸터를 설정할 때 사용한다. size는 블록의 크기, alloc은 할당 여부를 나타낸다. 이때 alloc이 1이면 할당된 블록을, 0이면 비어있는 블록을 나타낸다. 비트 OR 연산자로 size와 alloc을 32비트 값 하나로 결합한다.

**4)** <code>#define GET(p) (*(unsigned int *)(p))</code>  
   메모리 주소 p에서 32비트 값을 읽어온다.

**5)** <code>#define PUT(p, val) (*(unsigned int *)(p) = (val))</code>  
   주소 p에 32비트값 val을 저장한다.

**6)** <code>#define GET_SIZE(p) (GET(p) & ~0x7)</code>  
   헤더나 푸터에서 블록의 크기만 추출한다. p주소에서 alloc여부는 제외하고 size값만 가져온다.

**7)** <code>#define GET_ALLOC(p) (GET(p) & 0x1)</code>  
   헤더나 푸터에서 블록의 할당 여부만 추출한다.

**8)** <code>#define HDRP(bp) ((char *)(bp) - WSIZE)</code>  
   블록 포인터 bp에서 헤더의 주소를 계산한다. header pointer.

**9)** <code>#define FTRP(bp) ((char *)(bp) + GET_SIZE(HDRP(bp)) - DSIZE)</code>  
   블록 포인터 bp에서 푸터의 주소를 계산한다. footer pointer.

**10)** <code>#define NEXT_BLKP(bp) ((char *)(bp) + GET_SIZE(HDRP(bp)))</code>  
    블록 포인터 bp에 대한 다음 블록의 주소를 계산한다. 다음 블록으로 이동할 때 사용한다. next block pointer.

**11)** <code>#define PREV_BLKP(bp) ((char *)(bp) - GET_SIZE(HDRP(bp)))</code>  
    블록 포인터 bp에 대한 이전 블록의 주소를 계산한다. 이전 블록으로 이동할 때 사용한다. previous block pointer.

**12)** <code>#define WSIZE 4</code>  
    워드 사이즈로, 헤더와 푸터의 크기를 나타낸다.

**13)** <code>#define DSIZE 8</code>  
    더블 워드 사이즈로, 8바이트 align을 위한 최소 블록 크기 기준이 된다.

**14)** <code>#define OVERHEAD 8</code>  
    헤더+푸터 크기

**15)** <code>#define CHUNKSIZE (1<<12)</code>  
    힙 확장 시 할당하는 덩어리의 기본 크기


<br>
<br>

![Image](https://github.com/user-attachments/assets/3c2ee011-e740-4feb-9610-5461934cacfe)


강의자료를 참고하여 mm_init() 함수를 이렇게 구현해보았다. 
mm_init() 함수에서 해야할 것은 프롤로그와 에필로그를 가지는 초기 블록을 만들고 extend_heap을 이용해 최초의 heap을 할당받는 것이다.

 우선 첫 번째 블록의 포인터를 전역 변수로 선언한다. (static char *heap_listp = 0;)
implicit 구현에서 간접 리스트 방식으로 모든 블록을 연결해야하므로 블록을 찾고 추적하기 위해 필요하다.

 선언한 heap_listp를 이용하여 4개의 워드만큼 힙 공간을 확장하고 시작 주소를 넣어준다. 또 헤더와 푸터를 초기화하고 할당 상태를 저장해준다. heap_listp는 최종적으로 헤더와 푸터 사이를 가리킨다. 힙 확장에 실패하면 –1을 반환한다.

다음으로 힙을 CHUNKSIZE만큼 확장한다. 매크로에서 봤듯 CHUNKSIZE는 1<<12 (4096 bytes)로, 힙을 확장할 크기를 워드 단위로 계산하는데 이 값이 NULL일 경우 초기화에 실패하며, –1을 반환한다. 이제 이후 메모리 할당 요청을 적절히 받을 수 있다.

\*find_fit() 함수 구현 중 추가* <br>
next_fit이라는 전역 변수를 두어 다음 블록을 찾는 위치를 더 명확히 표현하였다. 다음 비어있는 블록을 찾는 위치를 나타내는 포인터이다. 이 포인터 없이 heap_listp만 사용할 경우 동작 자체는 문제 없겠지만 매번 힙의 처음부터 끝까지 탐색해야하니 성능이 떨어질 것이다. 

초기화가 완료되면 0을 반환한다.
<br>
<br>

\*실습 이후 추가*  <br>
이때 흥미로운 사실 하나를 발견할 수 있다. <br>
![Image](https://github.com/user-attachments/assets/0f08bcc7-667a-4b1c-ade0-8c0c8a4555ec)

해당 부분을 주석처리하여 없애면 util 점수가 무려 5점이나 올라간다.
없애고 mdriver를 돌리더라도 잘 작동하는 것을 보니 기존에 이렇게 할당했던 건 불필요한 메모리였고, 초기 설정한 힙 크기로도 충분했나보다. 따라서 최종 코드에서는 이를 제거하였다.



최종 mm_init()코드는 다음과 같다. <br>
![Image](https://github.com/user-attachments/assets/7d883a25-03d8-4be5-8712-c8fa891e85ce)

<br><br>

### 3. find_fit() 함수를 구현
![Image](https://github.com/user-attachments/assets/63d1b53d-16ef-41e9-814a-950c64ff18e9)


주석처리한 부분이 first fit 구현이고, 아래는 next fit 구현이다. 둘의 차이는 bp값을 무엇으로 할당하느냐에 있다.

first fit으로 구현했더니 next_fit에 비해 performance index의 util 점수가 상당히 떨어진다(30점 정도 차이). next fit은 이전에 할당한 블록 위치 이후부터 탐색을 할 수 있으므로, 이미 할당된 것이 자명한 블록에 대해 탐색을 하지 않아 탐색 시간을 줄임으로써 성능의 최적화가 가능하다. 따라서 최종 구현은 next_fit을 이용했다.

 bp의 값으로 next_fit 값을 넣어준다. next_fit 포인터는 다음 비어있는 블록을 찾기 시작할 위치를 나타낸다. 이는 전역변수로 선언하고, mm_init()함수에서 heap_listp값으로 초기화해주었다.

 GET_SIZE(HDRP(bp))>0으로 현재 블록의 크기를 구한다(블록의 헤더를 가져와 크기 정보를 추출). 이것이 0이 아니라면(유효한 블록이라면) 에필로그 블록(크기 0, alloc상태 1)이 아니라는 뜻이고, 사용 가능한 블록임을 나타낸다. 즉 이전 할당 블록 위치부터, 사용 가능한 블록 전체에 대해 반복하는 것이다. 

 반복 과정에서 블록이 사용 가능한지(!0 == 1), 할당 요청받은 크기보다 크거나 같은지 AND연산으로 확인한다. 두 조건을 만족한다면 할당 가능한 요청이므로 이 블록의 시작 주소를 반환한다. 만약 적절한 블록을 찾지 못하면 NULL을 return한다.


<br>
<br>

### 4. place() 함수를 구현
  이후 과정에 place함수를 수정해 block을 나누는 코드를 추가하는 부분이 있다. 여기서는 block을 나누지 않는 방향으로 구현해야 7-8과정 이후 10번의 점수 측정에서 유의미한 변화가 있고 스스로 깨닫는 것이 있을 것이다. 

  ![Image](https://github.com/user-attachments/assets/4562cb92-bc84-4ee3-bbc5-a4eac82fdbdb)
   
   place() 함수는 메모리 할당 후 블록을 배치하는 역할을 한다. 할당된 블록을 설정하고 그 헤더와 푸터를 업데이트하면 된다. PUT 매크로를 이용하여 현재 블록의 크기와 할당 여부를 헤더, 푸터에 각각 저장한다.


<br><br>

### 5. malloc() 함수를 구현
![Image](https://github.com/user-attachments/assets/81c06b18-4075-4c9d-aab2-0a167b566475)

 malloc() 함수는 이번 실습의 이름을 그대로 쓰고 있으니만큼 중요해보인다. 이는 동적 메모리 할당을 수행하는 함수이다. 주어진 할당 요청 크기에 맞는 빈 블록을 찾아 실제로 할당하고, 필요하면 힙을 확장하는 기능을 수행해야한다.
 
 우선 일반적이지 않은 경우에 대한 처리를 꼼꼼히 해준다. 요청된 메모리 크기가 0이라면 메모리 할당을 할 필요가 없어 NULL을 반환한다 (실제로 c에서 malloc(0)을 호출해도 메모리 할당은 발생하지 않는다).

 다음으로, 할당할 블록의 크기에 맞는 블록을 계산해야한다. 할당할 크기가 DSIZE(8byte)이하인 경우 정렬을 위해 블록 크기를 DSIZE+OVERHEAD (헤더와 푸터 크기, 각각 4byte 총 8byte)로 설정한다. 그 이외의 경우는 ‘적절히’ (할당 블록 크기를 size+OVERHEAD로 계산하고 8byte단위를 맞추고 올림을 하기 위해 –버림을 하면 요청 크기보다 작은 크기가 할당될 수 있음-, 8보다 작은 최대 정수값을 더하여 DSIZE(역시 8byte)로 나눈다. 여기서 얻은 몫에 다시 DSIZE를 곱하여 8byte단위를 맞춰주고, 이 값을 asize에 넣는다. 약속 시간에 맞춰 도착하기 어려우니 더 일찍 도착하는 것이랑 비슷한 느낌인 듯) align을 맞춰 블록크기를 설정한다.

 직전에 구현한 find_fit() 함수와 값이 생긴 asize변수를 이용하여, 넣기 적합한 블록이 있어 블록의 시작 주소가 설정되면(NULL이 아니면), place함수에 블록 시작 주소와 할당 요청된 크기를 넘겨 헤더와 푸터를 설정함으로써 블록을 할당된 상태로 만든다. 이후 할당된 블록의 시작 주소를 반환하여 할당을 완료하고 malloc함수를 빠져나간다.

 마지막 남은 case는 할당 가능한 블록이 없는 경우를 나타낸다. 이 경우 extend_heap을 호출하여 힙을 확장하고 확장된 블록을 반환받아 그곳에 할당한다. 역시 할당된 블록의 시작 주소를 반환하여 할당을 완료하고 malloc함수를 빠져나간다.

<br><br>

### 6. realloc() 함수를 구현
![Image](https://github.com/user-attachments/assets/56eacc23-0b85-4b59-9155-69a168c2058a)
<br>
mm-naive.c 파일을 참고하라고 하여 잘 참고했다. (free() 사용부분 제외 mm-naive.c에서와 설명 동일)

 첫 번째 if블럭을 보면 할당 요청 크기가 0인 경우 기존 메모리 블록을 해제한다. 이 경우 free를 호출하고 NULL을 반환하므로 사실상 free의 역할을 그대로 수행하고 있다.
 
 두 번째 if블럭을 보면 oldptr이 NULL인 경우 새로운 메모리를 할당하는데, 기존에 할당된 메모리가 없는 경우 새로운 메모리를 할당하므로 사실상 malloc의 역할을 그대로 수행하고 있다.

 세 번째 if블럭을 보면 새로운 메모리를 할당하여 newptr에 저장하고, 실패하면 NULL을 반환하게 한다.

 네 번째 if블럭을 보면 기존 블록의 크기를 헤더에서 가져오고, 할당 요청된 크기(size)가 기존 블록의 크기(oldsize)보다 작으면 복사할 데이터 크기를 size로 제한하여 메모리를 축소한다. 그리고 memcpy를 이용하여 기존 블록에서 새로 할당된 블록으로 데이터를 복사한다. 이후 free로 해제하여 재사용 가능하게 하고 새로 할당된 메모리 블록의 시작 주소를 반환한다.

<br><br>

### 7. make implicit, make 를 실행
![Image](https://github.com/user-attachments/assets/530de50e-7c64-4b09-996f-db69a98defcf)

함수 정의해두고 안썼다고 알록달록 경고가 뜨는데, 에러는 아니니 그냥 둬도 크게 상관 없을 것 같다.

<br><br>

### 8. mdriver를 이용해 점수를 측정
![Image](https://github.com/user-attachments/assets/6f62dcf5-5bda-4759-9f9a-fc6d1a635e2e)

중간 점수는 65점이다. throughput은 높은데 utilization이 낮다. 
아직 free() 함수와 coalesce()함수를 구현하지 않았는데 이것이 원인인 것 같다. free()가 없어 한 번 할당된 메모리 해제가 안되어 메모리 블록 재사용이 안되고, 힙 확장이 자주 발생하며 메모리 할당이 자주 이루어지므로 utilization 점수가 낮을 것이다. 또한 coalesce()가 없어 블록 병합이 안되니 메모리 단편화가 늘어날텐데, 이것도 현재의 낮은 utilization 점수에 기여했을 것이다.

<br><br>

### 9. place 함수를 수정해 block을 나누는 코드 추가
![Image](https://github.com/user-attachments/assets/62375e0a-00f1-4fbf-81db-a628be649adc)
<br>
 기존 코드에 블록 상태에 따라 case를 나누어 처리하도록 코드를 추가하였다. 
현재 블록에서 asize(할당 요청받은 크기)를 뺀 나머지 크기가 2*DSIZE(최소 블록 크기, 헤더+푸터+align 최소 데이터) 이상이면 블록을 분할한다. 현재 블록의 헤더와 푸터에 asize와 할당 상태(1)를 넣고 NEXT_BLKP로 포인터를 다음 위치로 이동시켜 분할 후 남은 공간을 사용 가능한 블록으로 만들어준다. 남는 블록 공간이 충분하지 않은 경우 요청받은 크기를 전부 사용해서 블록 전체를 할당된 상태로 설정한다.


<br><br>

### 10. make 후에 mdriver를 이용해 점수 측정
![Image](https://github.com/user-attachments/assets/158a8b9d-d72e-4710-99c0-276f162271a6)

 utilization 점수가 전혀 나아지지 않았다. place로 블록을 쪼개고는 있으나 이 블록이 효율적으로 사용되지 못하니 여전히 utilization 점수가 낮은 것이다. 여기서 메모리를 size에 맞게 잘 할당한다고 해서 무조건 효율적으로 사용된다고 할 수는 없다는 교훈을 얻을 수 있다. 
 이제 할당된 메모리 블록을 해제하여 재사용하고 힙 확장을 막아 utilzation 점수를 높이는 일이 남아있다.

<br><br>

### 11. free() 함수를 구현
![Image](https://github.com/user-attachments/assets/ab81945e-bf96-4140-9fe8-387f1012120a)<br>
 free() 함수는 사용 중인 메모리를 해제한다. size(해제할 블록의 크기)를 두고 현재 블록의 헤더 위치를 계산하여 size와 블록 상태(0)를 기록한다. 
 여기서 next_fit에 coalesce(ptr)이 아닌 ptr값을 그대로 줄 경우, utilization 점수가 9점 감소한다. 해제 후 비어있는 블록을 주변 블록과 병합을 해줘야 메모리를 효율적으로 사용할 수 있다는 교훈을 얻을 수 있으니, coalesce(ptr)값을 next_fit에 넣어주어 메모리 해제 후 블록 병합이 일어나 포인터 위치를 다시 계산하도록 한다.

<br><br>

### 12. coalesce() 함수 구현
![Image](https://github.com/user-attachments/assets/aa350692-d118-4c50-908f-5ac8ccd4bfeb)

free함수에서 사용한 함수이다. coalesce는 합병, 합체의 의미를 갖고있는데, 이름 그대로 해제된 블록과 인접한 비어있는 블록을 병합하여 단편화를 줄이려는 목적으로 사용한다.

<br><br>

![Image](https://github.com/user-attachments/assets/f621fafe-d710-4965-a06b-1e914f3c9ff1)

이론 강의 자료에 나와있는 이 내용을 따라 case를 하나씩 구분하여 구현해보자.

##### Case1: allcocated & allocated
이 경우 병합할 수 있는 블록이 없으므로 아무 작업 없이 바로 bp를 반환한다.

##### Case2: allocated & free
이 경우 다음 블록과 병합할 수 있다. 다음 포인터를 이용하여 다음 블록의 크기를 가져와 size와 합하고, 현재 bp로 이 블록의 헤더와 푸터에 각각 (size, 0)을 전달하여 비어있는 상태를 표시한다.

##### Case3: free & allocated
이 경우 이전 블록과 병합할 수 있다. 이전 포인터를 이용하여 이전 블록의 크기를 가져와 size와 합하고, 현재 bp로 이 블록의 헤더와 푸터에 각각 (size, 0)을 전달하여 비어있는 상태를 표시한 후 bp를 합친 블록의 처음을 가리키도록 이동시킨다.

##### Case4: free & free
앞뒤로 다 비어있는 블록을 만났으니 둘 다 합쳐줘야한다. Case2와 3에서 했던 것과 비슷하게 이전 블록 포인터와 다음 블록 포인터를 이용하여 이전 블록 크기와 다음 블록 크기를 현재 블록 사이즈에 더하고 합친 블록의 시작과 끝(헤더와 푸터)에 각각 (size, 0)을 전달하여 비어있는 상태를 표시한 후 bp를 합친 블록의 처음을 가리키도록 이동시킨다.





### 13. make 후에 mdriver를 이용해 점수 측정

![Image](https://github.com/user-attachments/assets/fe3bd187-ab15-420c-944c-02a6916e82aa)

최적화를 위한 노력을 했더니 util점수가 급상승하였다. 간단히 다시 언급하자면 사용하지 않는 블록의 해제와 재사용으로 메모리 단편화가 감소했고 공간을 잘 확보했기에, 메모리의 효율적인 사용이 가능해졌기 때문이다. 실습을 통해 메모리의 효율적인 사용을 위한 노력으로 어떤 것이 필요한지 잘 느낄 수 있었다.

<br><br>

![Image](https://github.com/user-attachments/assets/3410bbad-fdb9-48ef-ae63-4da22a58a628)

mm_malloc 함수에 breakpoint를 설정하고 gdb로 디버깅해봤는데, 0x00000029(헤더, 푸터) 사이에 32바이트 메모리 블록이 있고 랜덤 값이 잘 할당되어있는 것을 볼 수 있다. 또 0x00000049(헤더, 푸터) 사이에 64바이트 메모리 블록이 있고 랜덤 값이 잘 할당되어있는 것을 볼 수 있다.

*0x00000029 = 0000 0000 0000 0000 0000 0000 0010 1001 (이진수)최하위 비트가 1로 설정되어 메모리 블록이 할당되어있음을 나타내고, 크기는 헤더와 푸터 포함 총 40바이트이다.

*0x00000049 = 0000 0000 0000 0000 0000 0000 0100 1001 (이진수)최하위 비트가 1로 설정되어 메모리 블록이 할당되어있음을 나타내고, 크기는 헤더와 푸터 포함 총 72바이트이다.


<br><br>
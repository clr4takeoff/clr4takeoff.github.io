---
title: "Firebase Functions의 UTC 문제 해결하기"
categories:
  - projects
  - error
tags:
  - research
  - spinoff
toc: true
toc_sticky: true

date: 2025-01-17
last_modified_at: 2025-01-17
comments: true
---

## 문제 상황 😵‍💫
<div style="text-align: center;">
<img width="1039" alt="Image" src="https://github.com/user-attachments/assets/6936a92b-f1a9-48ac-a3f6-71346fd70d03" />
</div>

- Firebase Functions를 사용하여 실험 조건 counterbalancing을 위한 로직을 구현 중.
- 날짜 기반 로직 (`isEvenPeriod`)을 활용하여 **짝수/홀수 주기**를 계산하고, 이를 통해 실험 조건을 다르게 적용하고자 함.
- 직전에 time zone 문제를 해결하고자 코드를 수정했었음. ([Firebase functions에서 Time Zone 문제 해결하기](https://clr4takeoff.github.io/projects/error/Firebase-functions%EC%97%90%EC%84%9C-Time-Zone-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0/))
- 그런데 하루 지나 테스트해보니 또, **현재 날짜(currentDay)**와 **다음날 날짜(nextDay)** 모두에서 `isEvenPeriod = true`로 표시되어 주기가 정상적으로 전환되지 않음.

<br><br>

## 문제 원인 🤔

1. **UTC와 KST 간의 시간 차이 미반영**

   - 링크([My note on JS Timezone, Firebase Cloud Functions and Luxon](https://dev.to/gie3d/my-note-on-js-timezone-firebase-cloud-functions-and-luxon-4cnc))에 따르면 Firebase Cloud Functions는 기본적으로 **UTC 시간**을 사용하여 날짜와 시간을 계산한다고 함.
   - 하지만 실험은 한국에서 진행됨. **한국 시간(KST)** 기준으로 주기를 계산해야 했음.
  
   -> UTC와 KST는 **9시간의 시간 차이**가 존재하며, 이를 고려하지 않아 날짜가 정확히 계산되지 않았던 것.

2. **`currentDay`와 `nextDay`의 잘못된 계산**
   - UTC를 기준으로 `currentDay`와 `nextDay`를 계산했을 때, 두 값이 **하루의 경계를 넘지 못함**.
   - 결과적으로 `currentDay`와 `nextDay`가 동일한 `differenceInDays` 값을 반환하여, `isEvenPeriod` 값이 동일하게 계산됨.


<br><br>

## 해결 방법 💡

UTC를 한국 시간(KST)로 변환하자~

### 1. 한국 시간 자정 계산 함수
UTC 기준 날짜를 한국 시간(KST) 자정으로 변환하여 밀리세컨드 변환 시 오차를 없앰.

```javascript
function getKSTMidnight(date = new Date()) {
    const KST_OFFSET = 9 * 60 * 60 * 1000; // 9시간 (한국 표준시)
    const utcTime = date.getTime(); // UTC 기준 밀리초 타임스탬프
    const kstTime = new Date(utcTime + KST_OFFSET); // KST 시간 계산
    return new Date(kstTime.getFullYear(), kstTime.getMonth(), kstTime.getDate()); // KST 자정으로 고정
}
```
<br>

### 2. `isEvenPeriod` 함수 수정
모든 날짜 계산을 한국 시간 기준으로 처리하도록 함.
<br>

```javascript
function isEvenPeriod(targetDate) {
    const kstNow = getKSTMidnight(targetDate); // 한국 시간 자정 기준
    const referenceDate = getKSTMidnight(new Date(2025, 0, 1)); // 기준 날짜 (KST 자정)
    const rawDifferenceInMilliseconds = kstNow - referenceDate; // 밀리초 차이 계산
    const differenceInDays = Math.floor(rawDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
    const currentPeriod = Math.floor(differenceInDays / SWITCH_INTERVAL_DAYS);

    // 디버깅 로그
    console.log(`[DEBUG] Target Date (KST - Midnight): ${kstNow}`);
    console.log(`[DEBUG] Reference Date (KST - Midnight): ${referenceDate}`);
    console.log(`[DEBUG] Raw Difference in Milliseconds: ${rawDifferenceInMilliseconds}`);
    console.log(`[DEBUG] Difference in Days (Floor): ${differenceInDays}`);
    console.log(`[DEBUG] Current Period: ${currentPeriod}`);
    console.log(`[DEBUG] Is Even Period: ${currentPeriod % 2 === 0}`);

    return currentPeriod % 2 === 0;
}
```


<br><br>

## 3. 최종 디버깅 로그
한국 시간(KST)을 기준으로 동작하도록 수정 후, 확인

```javascript
const currentDateKST = getKSTMidnight(); // 오늘 한국 시간 자정
const nextDayKST = getKSTMidnight(new Date(currentDateKST.getTime() + 24 * 60 * 60 * 1000)); // 내일 한국 시간 자정
const currentIsEven = isEvenPeriod(currentDateKST); // 현재 주기 확인
const nextDayIsEven = isEvenPeriod(nextDayKST); // 다음날 주기 확인

console.log(`[DEBUG] Current Date (KST - Midnight): ${currentDateKST}`);
console.log(`[DEBUG] Next Day Date (KST - Midnight): ${nextDayKST}`);
console.log(`[DEBUG] CurrentIsEvenPeriod: ${currentIsEven}`);
console.log(`[DEBUG] NextDayIsEvenPeriod: ${nextDayIsEven}`);
```

<br><br>

## 결과

1. **한국 시간 기준으로 정상 동작**
   - `currentDay`와 `nextDay`의 `isEvenPeriod` 값이 정확히 다르게 계산되고, `getKSTMidnight` 함수로 한국 시간 자정을 기준으로 날짜를 계산함.

2. **소수점 문제 해결**
   - `Math.floor`를 사용하여 경계 값에서 발생하던 오류 제거.


<br><br>

## 배운 점

1. **타임존(Time Zone)** 문제
   - Firebase Functions와 같은 서버리스 환경에서는 UTC가 기본 시간대로 사용됨을 항상 염두에 두어야 함.

3. **Firebase Functions 로그의 특성**
   - 로그는 UTC 기준으로 기록되므로, 로컬 환경의 시간대와 불일치를 주의해야 함.
   - 관련하여 날짜나 시간을 다루는 이후 프로젝트에서는 디버깅 로그에 Time Zone 변환 전후의 시간을 함께 출력하도록 해야겠음.

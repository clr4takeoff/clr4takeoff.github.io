---
title: "Firebase Functions로 실험 조건을 동적으로 관리하기"
categories:
  - projects
  - error
tags:
  - research
  - spinoff
toc: true
toc_sticky: true

date: 2025-01-19
last_modified_at: 2025-01-19
comments: true
---


## 문제 상황 😵‍💫

**실험 조건 Counterbalancing**을 위해 Firebase Functions를 활용해 실험자별로 다른 주기로 동작하는 로직을 설계했다. 목표는 실험자마다 고유한 기준일(ReferenceDate)을 설정하고, 이를 기준으로 일정한 주기로 짝수/홀수 조건이 번갈아가며 적용되도록 하는 것이다.

<br>

### 의도한 로직
1. **ReferenceDate**: 실험 시작일을 각 실험자마다 다르게 설정.
2. **주기 결정**: ReferenceDate와 현재 날짜 간의 일수 차이를 기준으로 짝수/홀수 주기를 계산.

하지만, 다음과 같은 문제점이 발생했다.

<br>

### 문제점
- ReferenceDate를 코드 내부에 고정된 값으로 하드코딩해두어, 실험자가 앱을 설치할 때마다 새 기준일을 반영하려면 Functions와 index.js 코드를 수정하고 다시 배포해야 한다.

<br><br>


## 원인 분석 🤔

**ReferenceDate의 고정된 값 사용**  
- 실험자들이 앱을 설치하는 날이 전부 다를 것. 따라서 실험마다 다른 기준일이 필요하지만, 기존 로직은 특정 날짜(예: `new Date(2025, 0, 1)`)를 하드코딩하여 모든 실험자가 동일한 기준일로 동작함.

<br><br>

## 해결 방법 💡

### 1. ReferenceDate를 데이터베이스에서 동적으로 관리

- Firebase Realtime Database를 활용해 실험자별로 첫 일기 작성일 기준으로 기준일을 저장하고, 이를 로직에 반영하도록 수정했다.
- 각 사용자가 앱을 설치하고 일기를 작성하면, KST 자정을 기준으로 ReferenceDate를 생성하고 저장하도록 했다.

```javascript
const referenceSnapshot = await userRef.once('value');
if (referenceSnapshot.exists()) {
    referenceDate = new Date(referenceSnapshot.val()); // 기존 기준일 로드
} else {
    referenceDate = getKSTMidnight(); // 새로운 기준일 설정
    await userRef.set(referenceDate.toISOString());
}
```

<br>

### 2. 주기 결정 로직 수정

- 기준일(ReferenceDate)과 현재 날짜 간의 일수 차이를 계산하여 짝수/홀수 주기를 결정하는 함수 `isEvenPeriod`를 수정했다.
- 이전엔 고정된 기준일을 사용했으나, 이제 **기준일을 동적으로 받아** 실험자마다 고유한 주기로 동작한다.

#### `isEvenPeriod`
```javascript
function isEvenPeriod(referenceDate, targetDate = new Date()) {
    const kstNow = getKSTMidnight(targetDate); // 현재 날짜 (한국 시간 자정 기준)
    const referenceKST = getKSTMidnight(referenceDate); // 기준일 (한국 시간 자정 기준)
    const rawDifferenceInMilliseconds = kstNow - referenceKST; // 기준일과 현재 날짜의 차이 계산
    const differenceInDays = Math.floor(rawDifferenceInMilliseconds / (1000 * 60 * 60 * 24)); // 일수 차이 계산
    const currentPeriod = Math.floor(differenceInDays / SWITCH_INTERVAL_DAYS); // 주기 계산

    console.log(`[DEBUG] Target Date (KST - Midnight): ${kstNow}`);
    console.log(`[DEBUG] Reference Date (KST - Midnight): ${referenceKST}`);
    console.log(`[DEBUG] Raw Difference in Milliseconds: ${rawDifferenceInMilliseconds}`);
    console.log(`[DEBUG] Difference in Days (Floor): ${differenceInDays}`);
    console.log(`[DEBUG] Current Period: ${currentPeriod}`);
    console.log(`[DEBUG] Is Even Period: ${currentPeriod % 2 === 0}`);

    return currentPeriod % 2 === 0;
}
```


<br><br>

## 최종 결과 ✅

1. **동적 ReferenceDate 관리**  
   실험자가 첫 일기를 기록할 때 기준일을 KST 자정으로 설정하고 db에 저장하도록 구현.  
   기준일은 db에서 동적으로 관리되며, Functions를 재배포하지 않고도 실험 조건에 맞게 조정 가능해졌다.

2. **Counterbalancing 로직 정상 작동**  
   기준일로부터 현재 날짜를 계산하여 짝수/홀수 주기를 동적으로 결정.  
   실험 조건이 정확히 주기에 따라 번갈아가며 적용되도록 설계되었다.

<br><br>

## 배운 점 🫠
- 하드코딩을 자제합시다...

<br>
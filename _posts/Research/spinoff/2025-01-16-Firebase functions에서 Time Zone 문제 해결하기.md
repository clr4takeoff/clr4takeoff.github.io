---
title: "Firebase functions에서 Time Zone 문제 해결하기"
categories:
  - projects
  - error
tags:
  - research
  - spinoff
toc: true
toc_sticky: true

date: 2025-01-16
last_modified_at: 2025-01-16
comments: true
---

## 문제 상황 😵‍💫
<div style="text-align: center;">
<img width="414" alt="Screenshot 2025-01-16 at 01 27 35" src="https://github.com/user-attachments/assets/f849e75c-2b54-4230-bf9a-b86085037a26" />
</div>

- 연구에서 실험 조건 counterbalancing을 위한 로직을 firebase functions로 설계하기로 하고, 날짜 기반 로직 (`isEvenPeriod`)을 사용해 짝수/홀수 주기를 계산하는 기능을 구현.
- 하지만 디버깅 로그를 확인했을 때, **현재 날짜 (current day)**와 **다음날 날짜 (next day)**가 모두 `isEvenPeriod = true`로 표시됨.
- 의도한 로직은 하루 단위로 이 값이 반대로 전환되어야 하지만, 같은 결과가 반복적으로 나타나며 예상과 다르게 동작.


<br><br>
## 문제 원인 🤔
- `differenceInDays` 값을 계산하는 과정에서 다음과 같은 문제가 확인됨:
  - **타임존 문제**: 서버가 UTC를 사용하는데, 클라이언트가 다른 타임존일 경우 날짜 차이가 정확하지 않을 수 있음.
  - **소수점 반올림 문제**: `Math.round`가 0.5 근처 값을 반올림하여 같은 `differenceInDays`를 반환.
  - **UTC 시간 차이 문제**: `currentDay`와 `nextDay`의 UTC 시간 차이가 충분하지 않으면 동일한 `differenceInDays` 값이 발생.
<br><br>
  -> Date객체는 밀리세컨드 단위로 환산되어 계산되고, 소수점 반올림에서 오차가 발생할 수 있다는 점을 간과했다.

<br><br>

## 해결 방법 💡

### 1. 디버깅 로그 추가
문제를 명확히 파악하기 위해 `isEvenPeriod` 함수에 디버깅 로그를 추가:
```javascript
function isEvenPeriod(targetDate) {
    const now = targetDate || new Date(); // 기본값은 현재 날짜
    const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // UTC 변환
    const referenceDate = new Date(2025, 0, 1); // 기준 날짜
    const rawDifferenceInMilliseconds = utcNow - referenceDate;
    const differenceInDays = Math.round(rawDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
    const currentPeriod = Math.floor(differenceInDays / SWITCH_INTERVAL_DAYS);

    // 디버깅 로그
    console.log(`[DEBUG] Target Date (UTC): ${utcNow}`);
    console.log(`[DEBUG] Reference Date (UTC): ${referenceDate}`);
    console.log(`[DEBUG] Raw Difference in Milliseconds: ${rawDifferenceInMilliseconds}`);
    console.log(`[DEBUG] Difference in Days: ${differenceInDays}`);
    console.log(`[DEBUG] Current Period: ${currentPeriod}`);
    console.log(`[DEBUG] Is Even Period: ${currentPeriod % 2 === 0}`);

    return currentPeriod % 2 === 0;
}
```
<br><br>
### 2. 로직 수정

1. **날짜 계산 개선**
   - `Math.round` 대신 `Math.floor`를 사용해 소수점 문제 해결:
     ```javascript
     const differenceInDays = Math.floor(rawDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
     ```

2. **다음날 날짜 계산 추가**
   - `currentDay`와 `nextDay`를 분리해 각각 `isEvenPeriod`를 호출:
     ```javascript
     const currentIsEven = isEvenPeriod(); // 현재 날짜 기준
     const nextDay = new Date();
     nextDay.setDate(nextDay.getDate() + 1); // 하루 추가
     const nextDayIsEven = isEvenPeriod(nextDay); // 다음날 기준
     ```

<br><br>

### 3. 최종 디버깅 로그



<div style="text-align: center;">
  <img width="430" alt="Screenshot 2025-01-16 at 01 24 06" src="https://github.com/user-attachments/assets/3119e45f-3bd3-4d48-86e1-15973b24edf5" />
</div>

- **현재 날짜**와 **다음날 날짜**에 대해 각 `isEvenPeriod` 결과를 확인.
- 문제의 원인이 `differenceInDays` 계산 과정에 있음을 로그를 통해 검증.

<br><br>

## 결과
1. **타임존 문제 해결**
   - `Date.UTC`로 모든 날짜를 UTC 기준으로 변환.

2. **소수점 문제 해결**
   - `Math.floor`로 반올림 없이 정수 계산.
<br><br>

  -> `currentDay`와 `nextDay`의 `isEvenPeriod`가 정상적으로 다르게 계산됨.

---

## 배운 점
- **Time zone 문제**: 서버와 클라이언트 환경에 따라 시간 계산 로직이 달라질 수 있음.
- **Math.round의 위험성**: 경계 값에서 예상치 못한 결과가 나올 수 있음.
<br>
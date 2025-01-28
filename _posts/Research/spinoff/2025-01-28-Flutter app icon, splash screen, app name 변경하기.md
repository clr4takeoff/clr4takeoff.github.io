---
title: "Flutter app icon, splash screen, app name 변경하기"
categories:
  - projects
tags:
  - research
  - spinoff
toc: true
toc_sticky: true

date: 2025-01-28 22:01:00
last_modified_at: 2025-01-28 22:01:00
comments: true
---
## 목표 🎯

Flutter로 개발 중인 Android 앱에서 다음을 수행할 것이다.

1. 앱의 기본 Flutter 아이콘을 내가 원하는 아이콘으로 교체한다.
2. 앱 실행 시 로딩 화면(splash screen)에 원하는 아이콘을 적용한다.
3. 앱 이름을 변경한다.

<br>

## 과정 👩‍💻

### 0. 기존 상태
#### **App Icon**
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/93cb98bb-1ea8-43a9-84ce-89618abae31a" />
- 플러터 기본 로고가 앱 아이콘으로 설정되어있다.
- 'MyListener' 공식 명칭이 결정되기 전까지 사용한 'FeelsBar'가 그대로 남아있다. 

<br>

#### **Splash Screen**
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/59dee2de-140c-4ed6-b943-d0a8fe113945" />
- 앱 실행 시 플러터 기본 로고가 적용된 splash screen이 보인다.

<br><br>

### 1. 앱 아이콘 변경 🔄

#### **사용한 패키지**
- [flutter_launcher_icons](https://pub.dev/packages/flutter_launcher_icons) 패키지 사용

#### **설정 과정**
1. `pubspec.yaml` 파일에 `flutter_launcher_icons` 패키지 추가
  - dev_dependencies에 `flutter_launcher_icons`를 추가한다.
  - flutter_icons에 아이콘으로 쓸 이미지 경로인 image_path를 추가한다.
  <img width="492" alt="Image" src="https://github.com/user-attachments/assets/2b50924f-5306-4dd2-9b77-84929d0d9710" />
<br><br>

2. 의존성 설치
```
flutter pub get
````
<br>
3. 아이콘 생성 명령어 실행
```bash
dart run flutter_launcher_icons:main
```
<br>

#### 결과
  <div style="text-align: center;">
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/b9b66e25-d641-4224-9023-6ddc0b6abaa6" />
</div>
- Android의 mipmap-* 폴더에 내가 그린 이미지로 만든 커스텀 아이콘이 생성되었다.

<br>

---

### 2. 앱 이름 변경 ✏️
#### 수정 파일

- Android에서 앱 이름을 변경하려면 다음 파일을 수정해야 한다.
어떤 이름으로 바꿀까 고민하다가 MyListener의 spin-off 연구이고, clover 캐릭터를 도입했으니 'MyLova'로 임시 지정하였다.
- '로바'라는 이름에서 Naver의 ClovaNote가 연상되는데, 혹시 문제가 생길 수 있으니 캐릭터 이름을 바꾸는 것을 검토해봐야겠다.

##### AndroidManifest.xml
- 경로: `android/app/src/main/AndroidManifest.xml`
- `<application>` 태그의 android:label을 수정
  <img width="427" alt="Image" src="https://github.com/user-attachments/assets/da4ed979-f5a3-41d2-95dc-4b7119ee48c2" />

<br>

---

### 3. 최종 결과
#### **App Icon**
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/5a59c35d-164d-4f76-98b5-1a0846cedb06" />
- 홈 화면에서 앱 이름과 아이콘이 의도한 대로 표시되었다.

<br>

#### **Splash Screen**
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/ff871c0c-9bc5-4eb3-9442-7707a4e6f815" />
- 앱을 실행해보니 앱 아이콘이 적용된 splash screen이 정상적으로 표시됨을 확인했다.

<br>

##### splash screen 관련 코드는 안건드린 것 같은데 왜 변경됐을까? 🤔
  Flutter에서 앱 아이콘만 변경했을 때 스플래시 스크린 아이콘도 함께 변경되었음 → Android의 기본 설정 때문.
- Flutter의 스플래시 스크린(launch_background.xml)은 기본적으로 배경색만 표시하도록 설정되지만, Android 시스템은 기본적으로 @mipmap/ic_launcher(앱 아이콘)을 스플래시 스크린 이미지로 사용함. 
- flutter_launcher_icons로 앱 아이콘을 변경하면 @mipmap/ic_launcher가 업데이트되니, 이 아이콘이 스플래시 스크린에 자동으로 반영된 것.

<br>
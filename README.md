# 모여라! – 간단한 커뮤니티 앱 MVP 개발
Moyeora는 React Native(Expo)와 Firebase를 활용해 구현한
간단한 커뮤니티 앱입니다.

회원가입부터 글 작성, 이미지 첨부, 댓글 작성까지
커뮤니티 서비스의 핵심 기능만 빠르게 검증할 수 있도록 구현된 프로젝트입니다.

## 주요 기능
* 회원가입 / 로그인
  * Firebase Auth 기반 이메일·비밀번호 인증
* 게시글 기능
  * 글 작성 / 수정 / 삭제
  * 글 목록 조회
  * 글 상세 보기
* 이미지 첨부
* 댓글 기능

## 기술 스택
- Frontend : React Native(Expo SDK 54)
- Backend : Firebase
  - Auth : 이메일 / 비밀번호 로그인
  - Firestore : 게시글, 댓글, 사용자 정보 저장
  - Storage : 이미지 업로드

## 프로젝트 구조
```
Moyeora/
├─ App.js                    # 네비게이션 시작점, RootNavigator 불러오는 곳
├─ firebaseConfig.js         # Firebase 초기화 (auth, db, storage export)
├─ metro.config.js           # Firebase .cjs용 설정
└─ src/
   ├─ screens/
   │  ├─ auth/
   │  │  ├─ LoginScreen.js          # 이메일/비번 로그인
   │  │  └─ SignUpScreen.js         # 이메일/비번 회원가입 + users에 저장
   │  ├─ posts/
   │  │  ├─ PostListScreen.js       # 글 목록
   │  │  ├─ PostDetailScreen.js     # 글 상세 + 댓글 목록/작성/수정/삭제 버튼
   │  │  └─ PostWriteScreen.js     # 글 작성/수정 + 이미지 첨부
   │
   ├─ components/
   │  ├─ Setting.js                # 설정 모달 + 로그아웃/탈퇴 버튼
   │
   ├─ services/
   │  ├─ authService.js             # 로그인/회원가입/로그아웃 helper 함수
   │  ├─ postService.js             # Firestore posts CRUD 함수 모음
   │  └─ commentService.js          # Firestore comments CRUD 함수 모음
   │
   └─ styles/
      ├─ LoginStyle.js
      ├─ PostDetailStyle.js 
      ├─ PostListStyle.js
      ├─ PostWriteStyle.js
      └─ SignUpStyle.js           

```

## 설치 및 실행
1. 저장소 클론
```
git clone <repo-url>
cd Moyeora
```

2. 패키지 설치
```
npm install
```

3. 🔧 Firebase 설정

프로젝트 루트의 firebaseConfig.js 파일에 본인의 Firebase 환경 변수를 입력합니다.
```
// firebaseConfig.js
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET_URL",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};
```

4. ▶️ Expo 실행 (Development)
```
npm start
```

또는
```
expo start
```

→ 실행 후 생성된 QR코드를 스캔하여 모바일에서 앱을 실행할 수 있습니다.
(iPhone: Expo Go 필요 / Android: Expo Go 또는 개발 빌드 권장)

5. 📱 Android 개발 빌드 (선택)

이미지 업로드 기능 등 일부 기능 테스트를 위해 필요한 경우:
```
npx expo run:android
```

6. 🍏 iOS 개발 빌드 (선택, Mac 필요)
```
npx expo run:ios
```

📌 필요 환경 (Requirements)
- Node.js 18+
- npm 또는 yarn
- Expo CLI
- Firebase 프로젝트

🧪 테스트 환경 (Test Devices)
- Android 실기기 — 개발 빌드로 테스트
- Expo Go — 일부 기능 테스트 가능 (Firebase Storage는 개발 빌드 권장)

## 개발 가이드라인
1. 코드 스타일

   * 메서드와 클래스에 적절한 주석을 달아주세요.
2. 브랜치 관리

    * 기능 개발: feature/기능이름
    * 버그 수정: bugfix/버그이름
    * 최적화 및 코드 수정: refactor/수정이름
    * 릴리즈: release/버전

3. 커밋 메시지

    * 명확하고 간결한 커밋 메시지를 작성해주세요.
    * 형식:
      ```
            <type> : <subject>

            <body>

            <footer>
      ```
    * Subject: Type 과 함께 헤더를 구성합니다. 예를들어, 로그인 API 를 추가했다면 다음과 같이 구성할 수 있습니다.
      ```
      ex) feat: Add login api
      ```
    * Type(해당 커밋의 성격을 나타내며 아래 중 하나여야 한다)
      * feat : 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정 커밋
      * fix : 기능에 대한 버그 수정 커밋
      * build : 빌드 관련 수정 / 모듈 설치 또는 삭제에 대한 커밋
      * chore : 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
      * ci : CI 관련 설정 수정
      * docs : 문서(주석) 수정
      * style : 코드 스타일, 포맷팅에 대한 수정
      * refactor : 기능의 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
      * test : 테스트 코드 추가/수정
      * release : 버전 릴리즈
    * Body: Header에서 표현할 수 없는 상세한 내용을 적는다. Header에서 충분히 표현할 수 있다면 생략 가능하다.
    * Footer: 바닥글로 어떤 이슈에서 왔는지 같은 참조 정보들을 추가하는 용도로 사용한다. 예를 들어 특정 이슈를 참조하려면 Issues #1234 와 같이 작성하면 된다. Footer는 생략 가능하다.

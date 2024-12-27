# 음성 제어 매니저 (Voice Control Manager)

Chrome 브라우저를 음성 명령으로 제어할 수 있는 확장 프로그램입니다. Web Speech API와 OpenAI API를 활용하여 자연스러운 음성 인식과 명령어 처리를 구현했습니다.

## 🛠 기술 스택

### 프론트엔드

- JavaScript (ES6+)
- HTML5/CSS3
- Chrome Extension APIs
- Web Speech API
- OpenAI API
- Chrome Storage API
- Web Crypto API를 활용한 API 키 암호화/복호화

## ✨ 주요 기능

- Web Speech API를 활용한 실시간 음성 인식
- 커스텀 명령어 처리 시스템 구현
- OpenAI API를 활용한 명령어 처리 시스템 구현
- Chrome Extension API를 활용한 탭 관리
- 동적 스크립트 주입을 통한 페이지 제어

## 🎯 구현 내용

### 아키텍처

- MV3(Manifest V3) 기반 확장 프로그램 설계
- Background/Content Script 통신 구조

### 보안

- Web Crypto API를 활용한 API 키 암호화/복호화

### UX/UI

- 실시간 음성 인식 상태 표시
- 직관적인 모드 전환 인터페이스
- 사용자 친화적 오류 처리

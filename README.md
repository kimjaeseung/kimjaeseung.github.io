# 물리치료 시간계산기

물리치료실에서 치료 항목을 선택하면 기준 시간에 소요 시간을 자동 합산해 예상 종료 시간을 보여주는 모바일 웹앱입니다.

## 파일 구조

```text
.
├── index.html
└── README.md
```

- 단일 파일 앱: `index.html`
- 외부 라이브러리 없음 (Google Fonts만 사용)

## 기능

- 기준 시간: 페이지 로드 시점의 현재 시각(`new Date()`)
- 항목(A/B/C/D/F) 다중 선택 가능
- 선택 즉시 총 추가 시간과 예상 종료 시간이 실시간 반영
- `초기화` 버튼: 체크박스 전체 해제
- `기준 시간 리셋` 버튼: 기준 시간을 현재 시각으로 갱신
- 시간 표기: 24시간제 `HH:MM` (자정 넘김 자동 처리)

## 로컬 실행

정적 파일이므로 아래 중 하나로 실행할 수 있습니다.

1) 파일 더블클릭으로 브라우저에서 열기  
2) 간단한 서버 실행

```bash
python3 -m http.server 8080
```

이후 브라우저에서 `http://localhost:8080` 접속

## GitHub Pages 배포 방법

1. GitHub에서 새 public 레포지토리 생성
2. `index.html` 파일 업로드 (또는 git push)
3. 레포지토리 `Settings` -> `Pages` -> `Source: main branch / root` 선택
4. 저장 후 `https://[유저명].github.io/[레포명]/` 으로 접속

## Vercel 배포 방법 (대안)

1. [vercel.com](https://vercel.com) 접속 후 GitHub 로그인
2. 해당 레포지토리 import
3. 자동 배포 완료

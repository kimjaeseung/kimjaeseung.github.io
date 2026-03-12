# Echo Legacy Books (데모 버전)

당신의 이야기를 한 권의 책으로 남기는 자서전 작성 서비스입니다.

## 기술 스택

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router v6

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173/calcurlator/` 접속 (Vite base 경로 포함)

## 빌드

```bash
npm run build
```

산출물: `dist/`

## GitHub Pages 배포

1. `package.json`의 `homepage`를 본인 URL로 수정  
   예: `"homepage": "https://<username>.github.io/calcurlator"`
2. `vite.config.ts`의 `base`가 레포 이름과 일치하는지 확인  
   예: 레포가 `calcurlator`이면 `base: '/calcurlator/'`
3. 배포 실행:

```bash
npm run deploy
```

`gh-pages`가 `dist` 내용을 `gh-pages` 브랜치에 푸시합니다.  
GitHub 저장소 **Settings → Pages → Source: Deploy from a branch** 에서 **gh-pages** 브랜치를 선택하면  
`https://<username>.github.io/calcurlator/` 에서 서비스됩니다.

## 폴더 구조

```
src/
├── assets/
├── components/   # Layout, ChatBubble, QuestionCard, PhotoRestorer
├── pages/        # Home, Interview, Preview, PhotoDemo
├── data/         # questions.ts
├── hooks/        # useLocalStorage
├── utils/        # textRefiner
├── App.tsx
├── main.tsx
└── index.css
```

## 기능 요약

- **홈**: 히어로 타이핑 애니메이션, 작성 현황 카드, 새 챕터 시작
- **인터뷰**: AI 질문 → 사용자 답변 → 후속 질문 흐름, 진행바, LocalStorage 저장
- **미리보기**: 나의 답변 ↔ 자서전 문체 변환, PDF 저장(인쇄), 사진 추가 링크
- **사진 복원**: 드래그/클릭 업로드, Before/After CSS 필터 데모, 슬라이더 비교

데이터는 모두 클라이언트 LocalStorage에만 저장되며, 외부 API 호출은 없습니다.

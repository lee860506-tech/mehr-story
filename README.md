# MEHR STORY — 연월(YEONWOL) 작가 포트폴리오

## 여는 방법
- `index.html`을 더블클릭하면 바로 열립니다 (Chrome / Edge 권장). 별도 서버가 필요 없습니다.
- GSAP·ScrollTrigger·Lenis는 `js/vendor/`에 포함되어 오프라인에서도 동작합니다.
- 글꼴(나눔명조, 고운바탕, Cinzel, Cormorant Garamond, Pinyon Script)은 Google Fonts에서 불러오므로 인터넷 연결 시 정확히 보입니다.
- (선택) VS Code의 Live Server로 열거나, Vercel/GitHub Pages에 폴더 그대로 올려도 됩니다.

## 내용 수정 — `js/data.js` 한 파일만 고치면 됩니다
| 항목 | 위치 | 비고 |
|---|---|---|
| 작품 소개 / 시놉시스 | `novels[].intro`, `novels[].synopsis` | 비어 있으면 '준비 중' 표시 |
| 등장인물 | `novels[].characters` | `{ name, role, image }` |
| 연재처 링크 | `novels[].links` | `{ label: "카카오페이지", url: "https://..." }` |
| 장르·키워드 | `novels[].genre` | |
| 트레일러 | `novels[].trailer` | 유튜브 embed 주소 또는 mp4 경로 |
| 캐릭터 이미지 | `novels[].gallery` | `{ src, alt }` |
| 새 작품 추가 | `novels` 배열에 객체 복사 | 표지는 `assets/img/covers/` |
| 프로필 문구·학력 | `profile` | |
| 스킬 | `creative`, `technical` | |
| Gmail / Instagram | `contacts[].value` | 이메일 주소 / 인스타 아이디(@ 없이) |
| 배경음악 곡·기본 볼륨 | `bgm.tracks`, `bgm.volume` | 파일은 `assets/audio/` (mp3 필수, ogg 선택) |

## 폴더 구조
```
index.html          페이지 구조 (헤더·히어로·섹션·푸터)
css/style.css       디자인 (색상 변수는 :root)
js/data.js          ★ 콘텐츠 데이터
js/main.js          인트로·애니메이션·모달 동작
js/bgm.js           배경음악 재생·볼륨 컨트롤
js/vendor/          GSAP, ScrollTrigger, Lenis
assets/video/       인트로 영상 (webm/mp4), 포스터
assets/audio/       배경음악 (mp3 + ogg)
assets/img/         로고, 표지, 배너, 크리스탈 아이콘, 장식
```

## 색상 (Midnight Royal — Modern Fantasy Luxury)
- 모든 색상은 `css/style.css` 맨 위 `:root` 변수에서 관리합니다.
  `--bg #050505 · --bg-2 #101010 · --card #1B1B1B · --gold #F5D88B · --gold-deep #B48A40 · --silver #C5C8CE · --silver-light #E9EBEE · --champagne #FFF8E6`
- 영문 제목·브랜드 문구 = 메탈릭 골드 그라디언트, 한글 본문·설명·기술 스택 = 실버/아이보리.
- 카드·태그 = 골드→실버 메탈릭 1px 프레임, 마우스를 올리면 테두리를 따라 빛이 흐릅니다.

## 인트로
- 영상(assets/video)은 1회 재생 → 마지막 장면에서 멈추고 어둡게 → 배경 없는 MEHR STORY 로고가 금빛 입자와 함께 휘리릭 나타납니다.
- 로고를 클릭하거나 Enter 키를 누르면 홈페이지로 입장합니다. 재생 중에는 Skip 버튼으로 바로 입장할 수 있습니다.
- 투명 로고 파일: `assets/img/brand/logo-transparent.png` (원본 크기), `.webp`, `-sm.webp`(헤더·푸터용)

## 배경음악 (BGM)
- 곡: 직접 만든 저작권 없는 곡 2개를 순서대로 반복 재생 (곡이 바뀔 때 부드럽게 겹쳐 전환)
  1. Binding the Unsaid — 보컬을 제거한 반주(Instrumental) 버전, 더 잔잔해서 첫 곡
  2. The Heavy Curtain — 원래 연주곡이라 그대로 사용
- 두 곡 모두 배경음 크기로 음량을 맞추고(약 -18 LUFS) 앞뒤에 페이드를 넣었습니다.
- 자동재생 없음: 인트로에서 로고(Click to Enter)를 눌러 입장할 때 천천히 커지며 시작됩니다.
- 왼쪽 아래 금빛 버튼 = 켜기/끄기, 마우스를 올리면(모바일은 탭) 볼륨 슬라이더가 나타납니다.
  켜짐/꺼짐과 볼륨은 브라우저에 저장되어 다음 방문에도 유지됩니다. (기본 볼륨 32%)

## 접근성 / 성능
- `prefers-reduced-motion` 설정 시: 인트로 영상 자동재생 없이 정지 화면 + 입장 배너, 패럴랙스·입자 움직임 최소화.
- 이미지는 WebP로 최적화, 화면 밖 이미지는 lazy loading.

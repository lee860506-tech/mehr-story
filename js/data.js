/* =====================================================================
   MEHR STORY — 콘텐츠 데이터 파일 (이 파일만 수정하면 내용이 바뀝니다)
   ---------------------------------------------------------------------
   · 빈 문자열("") 또는 빈 배열([])로 둔 항목은 사이트에서
     '준비 중' 문구로 자동 표시됩니다.
   · TODO 표시가 있는 곳은 작가님이 직접 채워 주셔야 하는 항목입니다.
   · 이미지 경로는 index.html 기준 상대 경로입니다.
   ===================================================================== */
window.MEHR_DATA = {

  /* ---------------- 브랜드 ---------------- */
  brand: {
    name: "MEHR STORY",
    author: "연월",
    authorEn: "YEONWOL",
    slogan: "Every Light Has a Story.",
    title: "Novelist · Storyteller · AI Creator"
  },

  /* ---------------- 작품 (SELECTED NOVELS) ----------------
     새 작품 추가: 아래 객체 하나를 복사해 붙여넣고 내용을 바꾸세요.
     theme: 작품 고유 색 (카드 발광·모달 색감)
     links: [{ label: "연재처 이름", url: "https://..." }]
     characters: [{ name: "이름", role: "역할/설명", image: "이미지 경로(선택)" }]
     trailer: 유튜브 embed 주소 또는 mp4 경로 (예: "https://www.youtube.com/embed/xxxx")
     gallery: 추가 이미지 [{ src: "경로", alt: "설명" }]               */
  novels: [
    {
      id: "munbak",
      title: "문밖의 내 짐승",
      titleEn: "",                                   // TODO: 영문 제목(선택)
      tagline: "내가 부르기 전까지 들어오지 마.",       // 표지 문구
      genre: "",                                     // TODO: 장르 / 키워드
      cover: "assets/img/covers/munbak.webp",
      coverSm: "assets/img/covers/munbak-sm.webp",
      coverRatio: "941 / 1672",
      banner: "assets/img/banners/munbak.webp",
      bannerRatio: "756 / 199",
      theme: { main: "#8c1d2c", glow: "rgba(190, 50, 70, .55)", soft: "#3a0a12" },
      intro: "",                                     // TODO: 작품 소개
      synopsis: "",                                  // TODO: 시놉시스
      characters: [],                                // TODO: 등장인물
      links: [],                                     // TODO: 연재처 링크
      trailer: "",                                   // TODO(선택): 트레일러
      gallery: []                                    // TODO(선택): 캐릭터 이미지
    },
    {
      id: "jogeon",
      title: "조건반사적 복종",
      titleEn: "",
      tagline: "",
      genre: "",
      cover: "assets/img/covers/jogeon.webp",
      coverSm: "assets/img/covers/jogeon-sm.webp",
      coverRatio: "1027 / 1531",
      banner: "assets/img/banners/jogeon.webp",
      bannerRatio: "760 / 199",
      theme: { main: "#a8a2a6", glow: "rgba(200, 120, 140, .45)", soft: "#16121a" },
      intro: "",
      synopsis: "",
      characters: [],
      links: [],
      trailer: "",
      gallery: []
    },
    {
      id: "reverse",
      title: "RE:VERSE",
      titleEn: "",
      tagline: "",
      genre: "",
      cover: "assets/img/covers/reverse.webp",
      coverSm: "assets/img/covers/reverse-sm.webp",
      coverRatio: "1125 / 1536",
      banner: "assets/img/banners/reverse.webp",
      bannerRatio: "756 / 225",
      theme: { main: "#4a6fb5", glow: "rgba(120, 160, 235, .5)", soft: "#0b1430" },
      intro: "",
      synopsis: "",
      characters: [],
      links: [],
      trailer: "",
      gallery: [
        { src: "assets/img/covers/reverse-alt.webp", alt: "RE:VERSE 아트워크 (은빛 머리와 자정빛 로브)", ratio: "1055 / 1491" }
      ]
    },
    {
      id: "bran",
      title: "B.Ran의 낙인",
      titleEn: "",
      tagline: "",
      genre: "",
      cover: "assets/img/covers/bran.webp",
      coverSm: "assets/img/covers/bran-sm.webp",
      coverRatio: "1 / 1",
      banner: "assets/img/banners/bran.webp",
      bannerRatio: "760 / 225",
      theme: { main: "#7b4fe0", glow: "rgba(150, 120, 230, .35)", soft: "#140a30" },
      intro: "",
      synopsis: "",
      characters: [],
      links: [],
      trailer: "",
      gallery: []
    }
  ],

  /* ---------------- 프로필 ---------------- */
  profile: {
    nameEn: "YEONWOL",
    nameKo: "연월",
    title: "Novelist · Storyteller · AI Creator",
    image: "assets/img/profile/yeonwol.webp",
    imageSm: "assets/img/profile/yeonwol-sm.webp",
    paragraphs: [
      "상상에서 시작된 이야기를 글로 풀어내고, 인물과 관계를 통해 하나의 세계를 만들어 갑니다.",
      "소설 창작을 중심으로 AI 기술을 활용하여 이야기 속 세계를 이미지, 영상, 음악, 인터랙티브 콘텐츠로 확장합니다."
    ],
    education: [
      { title: "AI로 만드는 스마트 영상 콘텐츠 제작 엔지니어링 과정", period: "2026.07.20 – 2026.11.24" }
    ]
  },

  /* ---------------- 스킬 ---------------- */
  creative: [
    "소설 및 시나리오 집필", "스토리텔링", "세계관 설계", "캐릭터 기획",
    "콘텐츠 기획", "AI 영상 연출", "프롬프트 설계"
  ],
  technical: [
    { category: "LLM & Agent",        gem: "sapphire", items: ["ChatGPT", "Gemini", "Claude"] },
    { category: "Creative AI",        gem: "amethyst", items: ["Grok", "Flow", "Seedance", "MiniMax", "Higgsfield", "Kling", "Midjourney", "ChatGPT Image 2.5", "Nano Banana 2.1"] },
    { category: "TTS",                gem: "ruby",     items: ["Google AI Studio", "ElevenLabs", "Vrew", "Typecast", "클로바 더빙"] },
    { category: "Music",              gem: "gold",     items: ["SUNO AI"] },
    { category: "Editor",             gem: "garnet",   items: ["CapCut", "DaVinci Resolve"] },
    { category: "Workflow AI",        gem: "sapphire", items: ["ComfyUI"] },
    { category: "Vibe Coding",        gem: "amethyst", items: ["Antigravity", "Codex", "Cowork", "Three.js", "Previs"] },
    { category: "IDE & DB & Deploy",  gem: "gold",     items: ["VS Code", "Supabase", "GitHub", "Vercel"] }
  ],

  /* ---------------- 배경음악 (BGM) ----------------
     tracks 순서대로 재생 후 처음으로 돌아가 반복합니다.
     volume: 처음 방문 시 기본 볼륨 (0 ~ 1)
     곡 추가: assets/audio 폴더에 mp3(필수)/ogg(선택)를 넣고 아래에 한 줄 추가  */
  bgm: {
    volume: 0.32,
    tracks: [
      { title: "Binding the Unsaid (Instrumental)", mp3: "assets/audio/binding-the-unsaid.mp3", ogg: "assets/audio/binding-the-unsaid.ogg" },
      { title: "The Heavy Curtain",                 mp3: "assets/audio/the-heavy-curtain.mp3", ogg: "assets/audio/the-heavy-curtain.ogg" }
    ]
  },

  /* ---------------- 연락처 ----------------
     value가 비어 있으면 '준비 중'으로 표시되고 클릭되지 않습니다.  */
  contacts: [
    {
      type: "gmail",
      label: "Gmail",
      value: "",                 // TODO: 예) yeonwol@gmail.com
      icon: "assets/img/icons/celestial/ui-mail.svg",
      note: "작품 문의 · 협업 제안"
    },
    {
      type: "instagram",
      label: "Instagram",
      value: "",                 // TODO: 예) yeonwol_story  (@ 없이 아이디만)
      icon: "assets/img/icons/celestial/ui-instagram.svg",
      note: "작업 일지 · 소식"
    }
  ]
};

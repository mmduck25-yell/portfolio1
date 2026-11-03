import { PortfolioStore } from '../types/portfolio';

export const INITIAL_PORTFOLIO_DATA: PortfolioStore = {
  profile: {
    name: '홍예랑',
    englishName: 'Hong Yerang',
    role: '웹툰 PD (Webtoon Producer)',
    coreCopy: '웹툰의 스크롤을 멈추게 하는 호흡과 연출, 기획과 제작을 아우르는 웹툰 PD 홍예랑입니다.',
    email: 'yerang.webtoonpd@gmail.com',
    phone: '010-8989-1204',
    keywords: [
      '웹툰 기획',
      '노블코믹스 각색',
      '세로 스크롤 콘티 기획',
      '프로덕션 관리'
    ],
    careerSummary: '상업 웹툰 스튜디오 및 노블코믹스 레이블에서 웹소설 원작 발굴, 콘티 감수, 작화 파이프라인 관리 및 런칭 총괄을 담당한 웹툰 PD입니다. 스마트폰 뷰어 환경에 최적화된 시선 유도와 컷 간격 조절로 독자 이탈을 방지하고 유료 결제 전환율(CVR)을 견인하는 상업적 연출을 추구합니다.',
    contactHours: '평일 10:00 - 19:00 (작가 피드백 및 긴급 마감 건 상시 대응)',
    collaborationNotice: '노블코믹스 각색 기획, 오리지널 웹툰 스토리보드 감수, 작화 파이프라인 구축 및 신작 프로듀싱 제안을 상시 환영합니다.',
    metrics: [
      {
        value: '100%',
        label: '주간 연재 런칭 세이브 마감 준수',
        sub: '18화 사전 비축 파이프라인 관리'
      },
      {
        value: '65~75컷',
        label: '회차별 최적 씬 페이스 조절',
        sub: '이탈 방지 훅 및 호흡 설계'
      },
      {
        value: '2000px/300dpi',
        label: '원고 마스터링 표준 규격화',
        sub: '2D·3D 배경 리소스 최적화'
      },
      {
        value: '85%',
        label: '노블코믹스 런칭 프로젝트 기여도',
        sub: '기획·콘티·작가 피드백 총괄'
      }
    ]
  },
  sectionHeaders: {
    home: {
      category: 'WEBTOON PRODUCER & DIRECTOR',
      title: '웹툰의 스크롤을 멈추게 하는 호흡과 연출',
      description: '기획과 제작을 아우르는 상업 웹툰 프로덕션',
    },
    projects: {
      category: 'TEAM PRODUCTIONS & CASE STUDIES',
      title: '실무 협업 프로젝트 및 이슈 해결',
      description: '노블코믹스 및 오리지널 웹툰의 기획, 콘티 감수, 배경 합성 파이프라인 정합, 마감 리스크 대응 실무 케이스 스터디입니다.',
    },
    personal: {
      category: 'STORYBOARD & DIRECTING WORK',
      title: '개인 작업 및 세로 스크롤 콘티',
      description: '텍스트 대본의 모바일 컷 분할, 스마트폰 스크롤 시뮬레이터, 3D 배경 합성 레이어, 장르별 씬 연출 기획안입니다.',
    },
    analysis: {
      category: 'COMMERCIAL INTELLIGENCE & ANALYSIS',
      title: '상업 웹툰 심층 분석 리포트',
      description: '〈아카데미에서 살아남기〉, 〈시든 꽃에 눈물을〉, 〈연상녀클럽〉/〈샤MONEY즘〉의 각색 방식, 씬 페이스, 유료 결제 전환 구조 분석서입니다.',
    },
    contact: {
      category: 'GET IN TOUCH & PARTNERSHIP',
      title: '웹툰 PD 연락처 및 협업 제안',
      description: '상업 노블코믹스 각색, 오리지널 웹툰 스토리보드 디렉팅, 제작 공정 파이프라인 정합 및 신작 프로젝트 프로듀싱 문의 창구입니다.',
    },
  },
  competencies: [
    {
      id: 'comp_visual',
      title: '시각화 및 연출',
      category: 'visual',
      summary: '스마트폰 세로 뷰어 환경에 최적화된 세로 스크롤 콘티 제작 및 시선 흐름 설계',
      bullets: [
        '단순 나열식의 평이한 눈높이(Eye-level) 앵글 배제 및 다이내믹한 앵글 전환(버드아이 뷰, 웜스아이 뷰)',
        '스크롤 가속도와 감속도를 고려한 컷 간격(Spacing) 설계로 독자의 시선 체류 시간과 긴장감 극대화',
        '컷 프레임을 탈피하는 오버랩 연출과 말풍선 배치 최적화로 모바일 한 손 터치 조작 시 몰입감 증대'
      ],
      specs: [
        '최적 컷 간격: 180px ~ 420px (스마트폰 6.7인치 기준)',
        '말풍선 독서 동선: 좌상단 → 우하단 Z자 흐름 설계',
        '모바일 시야각: 한 화면 1.5컷 내외 포커싱 원칙'
      ]
    },
    {
      id: 'comp_resource',
      title: '리소스 최적화',
      category: 'resource',
      summary: '스토리보드 투시와 정합을 맞춘 2D/3D 배경 에셋 생성, 합성 및 규격 표준화',
      bullets: [
        '스케치업 및 3D 모델링 에셋의 카메라 화각(FOV 30~55)과 인물 투시의 오차 없는 일치',
        '웹툰 표준 규격(가로 2000px, 300dpi 이상) 원고 마스터링 및 최종 플랫폼별 최적화 리사이징',
        '배경 라인 추출, 톤 보정, 림라이트(Rim Light) 후보정 파이프라인 구축으로 이질감 완벽 제거'
      ],
      specs: [
        '제작 규격: 가로 2000px × 세로 분할 / 300dpi 마스터링',
        '납품 규격: 가로 690px ~ 800px 최적화 RGB JPG 포맷',
        '레이어 규칙: 선화/밑색/명암/특수효과/말풍선 엄격 분리'
      ]
    },
    {
      id: 'comp_planning',
      title: '기획 및 분석',
      category: 'planning',
      summary: '상업 웹툰 트렌드 분석, 타겟 독자층 페르소나 설정 및 원작 소설 웹툰화 각색',
      bullets: [
        '네이버웹툰, 카카오페이지 요일별 상위권 랭킹 데이터 기반 트렌드 키워드 및 클리셰 변주 분석',
        '원작 웹소설 1화당 약 5,500자의 활자 묘사를 웹툰 65~75컷의 시각적 액션 및 대사로 압축 각색',
        '프롤로그 및 1~3화(런칭 3부작) 내 명확한 훅(Hook)과 주인공의 결핍/목표를 각인시키는 스토리 아크 설계'
      ],
      specs: [
        '소설 각색 압축비: 원작 1.8~2.2화 → 웹툰 1화 전환 기준',
        '후킹 컷 배치: 1화 엔딩 컷 기준 유료 열람 전환율 집중 공략',
        '장르 분석 풀: 판타지, 로판, 학원액션, 오컬트 스릴러'
      ]
    },
    {
      id: 'comp_comm',
      title: '커뮤니케이션 & 공정 관리',
      category: 'communication',
      summary: '글/그림 작가진과의 원활한 피드백 조율 및 주간 런칭 세이브 원고 일정 관리',
      bullets: [
        '작화가의 강점을 극대화하는 맞춤형 피드백 시트(레퍼런스 이미지 + 구도 가이드) 제공',
        '콘티 → 선화 → 채색 → 배경 합성 → 식자 및 최종 검수 5단계 분업 파이프라인 Gantt 관리',
        '런칭 전 최소 15화 세이브 원고 확보 및 주간 연재 마감 위험 요소 사전 차단(지각률 0% 달성)'
      ],
      specs: [
        '공정 주기: 콘티(D-6) → 선화(D-4) → 채색(D-2) → 식자·후보정(D-1)',
        '피드백 방식: 시각화 레이어 코멘트 및 구체적 수정 컷 샘플링',
        '리스크 관리: 비상용 뱅크씬 및 사전 3D 배경 라이브러리 비축'
      ]
    }
  ],
  teamProjects: [
    {
      id: 'proj_fantasy_noble',
      title: '아카데미 수호자의 귀환',
      subtitle: '동명 인기 웹소설 원작 기반 노블코믹스 런칭 프로젝트',
      genre: '판타지 / 아카데미 / 액션',
      role: '총괄 프로듀싱 (기획, 콘티 감수, 배경 합성 파이프라인 총괄)',
      contributionPercent: 85,
      period: '2025.03 - 2026.04 (런칭 완료, 주간 연재 중)',
      platform: '주요 대형 웹툰 플랫폼 독점 연재',
      description: '웹소설 원작의 웅장한 세계관과 아카데미 내 권력 다툼을 모바일 스크롤에 맞게 재해석한 프로젝트입니다. 주간 연재의 높은 작화 퀄리티를 유지하면서도 마감 일정을 준수할 수 있도록 3D 에셋 기반 공정 표준화를 구축했습니다.',
      roleDetails: [
        '원작 소설 1~40화 분석 및 웹툰 1~20화 스토리보드 트리트먼트 기획',
        '메인 작화가와의 1:1 세로 스크롤 콘티 피드백 및 시선 흐름 감수 (전체 회차)',
        '3D 스케치업 배경 에셋 라이브러리 25종 기획 및 2D 후보정 가이드 수립',
        '런칭 전 18화 세이브 원고 관리 및 플랫폼 담당 MD 커뮤니케이션'
      ],
      problemsAndSolutions: [
        {
          issue: '3D 배경 스케치업 추출 시 인물 작화와의 투시 불일치 및 렌더링 톤 이질감으로 작화 수정 지연 발생',
          solution: '콘티 단계에서 카메라 화각(FOV) 및 소실점 가이드라인을 규격화하고, 배경 톤 보정용 커스텀 액션 프리셋을 제작하여 작화 어시스턴트에게 배포',
          outcome: '회차당 배경 합성 및 수정 작업 시간 35% 단축, 인물과 배경의 일체감 대폭 향상'
        },
        {
          issue: '주간 연재 돌입 후 12화 시점에서 작화가 건강 악화로 인한 마감 지연 리스크 봉착',
          solution: '즉시 전투 씬의 뱅크 이펙트(검기, 충격파)와 서브 컷 펜슬 작업을 분업화할 수 있는 서브 작화 파트너 긴급 투입 및 PD 직접 콘티 러프화 지원',
          outcome: '연재 휴재 없이 정상 마감 완료 및 런칭 첫 주 플랫폼 인기 신작 랭킹 2위 달성'
        }
      ],
      thumbnail: '/src/assets/images/webtoon_project_fantasy_1793583964853.jpg',
      previewCuts: [
        '/src/assets/images/webtoon_project_fantasy_1793583964853.jpg',
        '/src/assets/images/webtoon_bg_composite_1793583964574.jpg'
      ],
      metrics: [
        '런칭 주간 신작 랭킹 2위',
        '평점 9.87 / 10 유지',
        '런칭 세이브 18화 마감 준수율 100%'
      ]
    },
    {
      id: 'proj_mystery_antique',
      title: '심야 환상 전당포',
      subtitle: '오리지널 미스터리 판타지 웹툰 기획 및 프로덕션',
      genre: '현대 판타지 / 미스터리 / 드라마',
      role: '기획 프로듀서 (세계관 설정, 씬 연출 디렉팅, 컬러 스크립트 총괄)',
      contributionPercent: 80,
      period: '2024.05 - 2025.02',
      platform: '국내 상업 플랫폼 정식 연재',
      description: '물건에 깃든 기억을 담보로 거래하는 신비로운 전당포를 배경으로 한 옴니버스 구성의 웹툰. 모바일 뷰어의 컷 간 스크롤 여백을 통한 서스펜스 유도와 장르적 음영 연출을 집중적으로 연구했습니다.',
      roleDetails: [
        '오리지널 시놉시스 및 에피소드별 갈등 구조 기획',
        '감정선 고조를 위한 세로 스크롤 컷 배치(아이레벨 배제, 로우앵글 극대화) 디렉팅',
        '채색 어시스턴트 팀 매니징 및 회차별 sRGB 컬러 일관성 검수'
      ],
      problemsAndSolutions: [
        {
          issue: '모바일 OLED 디스플레이 기종별로 암부(Shadow) 뭉개짐 현상 발생으로 미스터리 무드가 훼손되는 현상',
          solution: '명암 단계 최저값을 5% 이상 보정하는 섀도우 커브 표준 가이드를 배포하고, 3종 이상의 실기기(갤럭시, 아이폰, 아이패드) 실시간 교차 검수 프로세스 도입',
          outcome: '기기 환경에 구애받지 않는 고품질 암부 계조 유지 및 독자 연출 호평'
        }
      ],
      thumbnail: '/src/assets/images/webtoon_bg_composite_1793583964574.jpg',
      previewCuts: [
        '/src/assets/images/webtoon_bg_composite_1793583964574.jpg',
        '/src/assets/images/webtoon_storyboard_sample_1793583964841.jpg'
      ],
      metrics: [
        '누적 조회수 3,200만 돌파',
        '해외 4개국(일본, 북미, 대만, 프랑스) 수출 계약 체결',
        '회차당 독자 댓글 반응 지수 전작 대비 45% 상승'
      ]
    }
  ],
  personalWorks: [
    {
      id: 'work_scroll_storyboard',
      type: 'scroll_storyboard',
      title: '세로 스크롤 콘티: 텍스트 대본의 시각화',
      subtitle: '텍스트 대본을 바탕으로 직접 기획·스케치한 컷 분할 및 스크롤 연출 샘플',
      description: '단순한 그림 나열이 아닌, 독자가 엄지손가락으로 스크롤을 내리는 속도와 시선 이동을 치밀하게 계산한 세로 연출입니다. 눈높이(Eye-level)를 과감히 탈피하여 수직 공간의 긴장감을 연출했습니다.',
      scriptText: `[씬 #04. 비 내리는 골목길 추격전 - 밤]
(지문) 가쁜 숨을 몰아쉬며 좁은 뒷골목으로 달려 들어가는 이서준.
빗물 웅덩이를 밟으며 물이 튄다. 
서준은 숨을 고르며 뒤를 돌아보지만, 골목 끝 가로등 아래에는 아무도 없다.
안도하는 찰나, 서준의 머리 위 전신주에서 검은 실루엣의 '하늘'이 내려다보고 있다.
서준: "하아... 하아... 겨우 따돌린 건가...?"
하늘: (독백/냉소) "달아날 수 있을 거라 생각했나, 이서준."
(지문) 서준이 기척을 느끼고 위를 올려다보는 순간, 하늘이 눈을 번뜩이며 내리꽂히듯 착지한다!`,
      storyboardImage: '/src/assets/images/webtoon_storyboard_sample_1793583964841.jpg',
      storyboardImages: [
        '/src/assets/images/webtoon_storyboard_sample_1793583964841.jpg'
      ],
      techniques: [
        'Eye-level 앵글 배제: 바닥 빗물 웅덩이 클로즈업 → 로우앵글 전신 뜀박질 → 하이앵글 골목 부감',
        '수직 낙하 연출: 전신주 위의 실루엣에서 서준의 시선까지 3단 세로 긴 컷으로 낙하 가속도 표현',
        '말풍선 핑퐁: 독서 호흡을 늦추는 180px 여백 후 충격적인 클로즈업 컷 배치'
      ]
    },
    {
      id: 'work_composite',
      type: 'composite',
      title: '배경 및 인물 에셋 합성 파이프라인',
      subtitle: '스케치업 3D 에셋과 2D 캐릭터 작화를 이질감 없이 병합하여 완성한 무드 컷',
      description: '3D 모델링 특유의 딱딱한 선화와 플랫한 텍스처를 웹툰 작화 스타일에 맞게 필터링하고, 광원 및 림라이트(Rim Light) 후보정을 통해 하나의 회화처럼 자연스러운 공간감을 형성했습니다.',
      storyboardImage: '/src/assets/images/webtoon_bg_composite_1793583964574.jpg',
      techniques: [
        '소실점 일치: 2점 투시 배경 그리드에 맞춘 캐릭터 발목/어깨 접지면 투시 보정',
        '선화 추출 및 브러시 텍스처링: 3D의 기계적인 외곽선을 만화용 손글씨풍 잉크 질감으로 치환',
        '대기 원근법(Atmospheric Perspective): 배경 깊이에 따른 명도 페이드 및 공기 원근감 부여'
      ],
      compositeLayers: [
        {
          name: 'Layer 01. 3D 스케치업 원시 와이어프레임 & 렌더',
          tag: '3D Base',
          description: '공간의 비율과 가구 배치를 잡기 위한 카메라 화각 45도 추출 에셋'
        },
        {
          name: 'Layer 02. 라인 추출 및 만화 잉크 선화 가공',
          tag: 'Ink Line',
          description: '3D 와이어를 벡터 라인으로 전환 후 강약이 있는 펜 터치 효과 적용'
        },
        {
          name: 'Layer 03. 환경광 톤 매핑 & 앰비언트 오클루전',
          tag: 'Ambient Tone',
          description: '창문을 통해 들어오는 사선 자연광과 서가 그림자의 자연스러운 감쇠'
        },
        {
          name: 'Layer 04. 캐릭터 인물 작화 정합 및 림라이트 합성',
          tag: 'Final Polish',
          description: '역광 환경에 맞춘 캐릭터 외곽선 하이라이트 및 먼지 입자 이펙트 오버레이'
        }
      ]
    },
    {
      id: 'work_genre_mood',
      type: 'genre_mood',
      title: '장르별 씬 연출 및 시각적 무드 기획안',
      subtitle: '현대 학원물, 사이버펑크, 로맨스 판타지 등 장르 특성에 맞춘 카메라 및 조명 가이드',
      description: '각 장르가 독자에게 전달해야 하는 핵심 감정(청량감, 긴박감, 애절함)을 시각화하기 위해 컬러 스크립트와 카메라 워킹을 사전에 체계적으로 기획합니다.',
      genreScenes: [
        {
          genre: '현대 학원 액션물',
          mood: '청량감, 날카로운 청춘의 충돌, 속도감',
          lightingKeywords: ['하이키(High-key) 자연광', '푸른 하늘 역광', '스피드라인 음영'],
          cameraGuide: '타격감 강화를 위해 인체 왜곡을 허용한 광각 렌즈 앵글, 대각선 컷 분할 활용',
          description: '일상 파트에서는 아이레벨의 편안한 구도로 공감대를 형성하되, 액션 돌입 시 틸트(Dutch angle)와 프레임을 깨는 주먹/발끝 돌출 컷으로 스크롤 임팩트 유도'
        },
        {
          genre: '사이버펑크 / SF 느와르',
          mood: '차가운 금속성, 디스토피아적 고립감, 하이테크 긴장감',
          lightingKeywords: ['로우키(Low-key) 짙은 암부', '모노톤 베이스 + 네온 포인트', '비에 젖은 아스팔트 반사광'],
          cameraGuide: '마천루를 올려다보는 극단적인 웜스아이 뷰(Worm’s-eye view), 빌딩 숲 수직 파노라마 컷',
          description: '거대한 메가코프의 압도적인 스케일 속에 왜소한 인물을 배치하여 무력감을 시각화하고, 비선형적인 파편화 컷으로 혼란스러운 세계관 표현'
        },
        {
          genre: '로맨스 판타지 (로판)',
          mood: '우아함, 심리적 긴장, 서정적인 감정의 울림',
          lightingKeywords: ['부드러운 디퓨징 촛불/샹들리에광', '소프트 포커스', '골드 & 딥벨벳 명암'],
          cameraGuide: '인물의 미세한 눈빛과 손끝 떨림을 포착하는 마이크로 클로즈업, 여백이 긴 세로 컷',
          description: '두 인물 사이의 보이지 않는 거리감을 스크롤 길이로 표현. 한 화면에 두 사람을 동시에 담지 않고, 스크롤을 한참 내려야 상대방의 시선이 보이도록 호흡 조절'
        }
      ]
    }
  ],
  analyses: [
    {
      id: 'ana_academy',
      title: '웹소설 원작의 웹툰화 각색 및 회차별 씬 페이스 조절',
      originalWork: '아카데미에서 살아남기',
      genre: '판타지 / 아카데미 / 생존',
      platform: '네이버웹툰 인기 연재작 분석',
      summary: '원작 특유의 방대한 텍스트 설정과 독백 위주 서사를 웹툰 모바일 뷰어에 맞춰 속도감 있는 시각적 액션과 명료한 갈등으로 재구성한 모범적 노블코믹스 사례',
      pacingAnalysis: [
        {
          topic: '소설 독백의 시각화 (Show, Don’t Tell)',
          details: '원작에서 2~3페이지에 걸쳐 서술되는 주인공의 능력치 계산 및 심리 상태를 웹툰에서는 간결한 UI 인디케이터 1컷과 표정 변화로 압축. 활자 읽는 피로도를 최소화하고 독자가 사건의 결과에 집중하게 만듦.'
        },
        {
          topic: '회차별 기승전결(A-B-C-Climax) 컷 배분',
          details: '회차당 평균 68컷 기준: [도입부 상황 환기 12컷] → [위기/갈등 심화 20컷] → [해결 시도 및 반전 24컷] → [차회 예고성 클리프행어 12컷]. 특히 매회 마지막 컷에서 독자의 손가락이 다음 화 결제 버튼으로 향하도록 충격적인 정보 공개 배치.'
        }
      ],
      visualMoodStrategy: [
        {
          topic: '생존물 특유의 척박함과 아카데미 화려함의 대비',
          details: '야외 숲속 생존 캠프 씬은 거친 크로키 선화와 채도 낮은 모노톤 음영으로 위기감을 강조하고, 아카데미 본관 씬은 웅장한 3D 건축물과 정돈된 선화로 극단적인 계급 격차를 시각적으로 은유.'
        }
      ],
      commercialStructure: [
        {
          topic: '초반 1~3화 이탈 방지 훅 설계',
          details: '빙의 직후 혼란스러워하는 원작의 초반 정적 파트를 대폭 압축하고, 1화 40컷 지점에서 곧바로 첫 번째 생존 시험이라는 직접적 물리적 위기를 발생시켜 런칭 직후 독자 리텐션 지표 방어.'
        }
      ],
      keyTakeaway: '노블코믹스 PD의 본질은 "원작의 문장을 복사하는 것"이 아니라, "원작자가 글로 전달하고자 했던 핵심 감정선과 스릴을 스마트폰 스크롤의 시각적 쾌감으로 치환하는 번역자"여야 한다는 점을 명확히 입증함.'
    },
    {
      id: 'ana_wilted_flower',
      title: '로맨스 판타지 장르의 감정선 연출 및 시각적 무드 기획',
      originalWork: '시든 꽃에 눈물을',
      genre: '로맨스 판타지 / 드라마 / 피폐',
      platform: '네이버웹툰 인기 연재작 분석',
      summary: '자극적인 사이다 클리셰에 기대지 않고, 밀도 높은 감정 묘사와 서정적인 미장센, 호흡 조절만으로 독자를 강력하게 몰입시키는 고감도 연출의 표본',
      pacingAnalysis: [
        {
          topic: '스크롤 속도를 지연시키는 \'침묵의 여백\' 연출',
          details: '격정적인 대사 대신, 대사가 전혀 없는 흑백의 긴 세로 여백 컷(스크롤 1.5회 분량)을 배치하여 독자가 무의식중에 스크롤을 천천히 내리며 인물의 상처와 침묵에 동기화되도록 유도.'
        },
        {
          topic: '시선 이동을 고려한 대각선 말풍선 흐름',
          details: '인물의 시선이 향하는 반대편에 꼬리 없는 독백 말풍선을 배치하여, 모바일 화면 상에서 시선이 대각선으로 크게 요동치며 불안정한 심리를 체험하게 만드는 고도의 배치 기법.'
        }
      ],
      visualMoodStrategy: [
        {
          topic: '채도 제한을 통한 감정의 응축과 해방',
          details: '평상시 무드는 흑백에 가까운 세피아/저채도로 유지하다가, 주인공의 억눌린 감정이 폭발하거나 결정적인 구원의 순간에만 순도 높은 단일 컬러(핏빛 붉은색, 푸른 눈동자)를 개방하여 시각적 카타르시스 극대화.'
        }
      ],
      commercialStructure: [
        {
          topic: '코어 여성 독자층의 서사적 결속력 강화',
          details: '단순한 로맨스 성취를 넘어 주인공의 자아 회복과 내면의 극복 과정에 집중함으로써, 여성 독자 커뮤니티 내 자발적인 회차별 연출 분석 및 입소문 바이럴 유발.'
        }
      ],
      keyTakeaway: '웹툰 PD는 화려한 이펙트의 과잉보다, 때로는 \'비워내는 연출\'이 상업적으로 더 강력한 차별화와 프리미엄 브랜딩을 획득할 수 있음을 인식해야 함.'
    },
    {
      id: 'ana_commercial_review',
      title: '장르별 타겟 독자층 어필 포인트 및 상업적 스토리텔링 구조',
      originalWork: '연상녀클럽 / 샤MONEY즘',
      genre: '로맨스 드라마 / 오컬트 블랙코미디',
      platform: '상업 플랫폼 트렌드 비교 분석',
      summary: '극과 극의 타겟층(2030 현실 공감형 드라마 vs MZ 세대 자본주의 풍자 스릴러)을 겨냥한 상업적 포지셔닝과 후킹 구조 분석',
      pacingAnalysis: [
        {
          topic: '<연상녀클럽>: 2030 여성층을 저격하는 핑퐁 템포',
          details: '일상물 특유의 늘어짐을 방지하기 위해 씬 전환을 8컷 이내로 빠르게 끊고, 현실적인 연애 대화의 티키타카를 모바일 메신저 UI와 교차 편집하여 직관적 공감대 형성.'
        },
        {
          topic: '<샤MONEY즘>: 오컬트 무속과 코인의 기괴한 결합',
          details: '무속 신앙의 전통적 시각 요소(부적, 작두, 방울)를 가상화폐 차트와 현대 자본주의 기호와 결합. 회차당 2회 이상의 예측 불허의 상황 반전 컷 배치로 다음 화 궁금증 증폭.'
        }
      ],
      visualMoodStrategy: [
        {
          topic: '<연상녀클럽> 미니멀리즘 vs <샤MONEY즘> 네온 샤머니즘',
          details: '<연상녀클럽>은 정제된 패션 매거진풍의 깔끔한 선화로 트렌디함을 강조하고, <샤MONEY즘>은 형광 원색과 사이키델릭한 톤으로 광기와 기괴함을 시각화하여 썸네일 클릭률(CTR) 유도.'
        }
      ],
      commercialStructure: [
        {
          topic: '쿠키/캐시 결제 전환율(CVR) 극대화 구조',
          details: '매회 엔딩 컷 직전 가장 결정적인 비밀 폭로 대사를 배치한 뒤, 주인공의 충격받은 눈동자 클로즈업과 함께 "다음 화에 계속" 문구를 배치하여 스크롤 정지 지점이 곧 결제 버튼 클릭으로 직결되도록 설계.'
        }
      ],
      keyTakeaway: '철저한 타겟 독자 페르소나 정의(누가, 언제, 어떤 기분으로 스마트폰을 켜서 이 웹툰을 소비하는가)가 작품의 작화 스타일, 컷 템포, 회차 엔딩 방식을 결정하는 가장 결정적인 나침반임.'
    }
  ],
  sections: [
    {
      id: 'home',
      navLabel: '홈',
      category: 'WEBTOON PRODUCER & DIRECTOR',
      title: '웹툰의 스크롤을 멈추게 하는 호흡과 연출',
      description: '기획과 제작을 아우르는 상업 웹툰 프로덕션',
      type: 'home',
      isEnabled: true,
      order: 0,
    },
    {
      id: 'projects',
      navLabel: '팀 프로젝트',
      category: 'TEAM PRODUCTIONS & CASE STUDIES',
      title: '실무 협업 프로젝트 및 이슈 해결',
      description: '노블코믹스 및 오리지널 웹툰의 기획, 콘티 감수, 배경 합성 파이프라인 정합, 마감 리스크 대응 실무 케이스 스터디입니다.',
      type: 'projects',
      isEnabled: true,
      order: 1,
    },
    {
      id: 'personal',
      navLabel: '개인 작업 & 콘티',
      category: 'STORYBOARD & DIRECTING WORK',
      title: '개인 작업 및 세로 스크롤 콘티',
      description: '텍스트 대본의 모바일 컷 분할, 스마트폰 스크롤 시뮬레이터, 3D 배경 합성 레이어, 장르별 씬 연출 기획안입니다.',
      type: 'personal',
      isEnabled: true,
      order: 2,
    },
    {
      id: 'analysis',
      navLabel: '작품 분석 리포트',
      category: 'COMMERCIAL INTELLIGENCE & ANALYSIS',
      title: '상업 웹툰 심층 분석 리포트',
      description: '〈아카데미에서 살아남기〉, 〈시든 꽃에 눈물을〉, 〈연상녀클럽〉/〈샤MONEY즘〉의 각색 방식, 씬 페이스, 유료 결제 전환 구조 분석서입니다.',
      type: 'analysis',
      isEnabled: true,
      order: 3,
    },
    {
      id: 'contact',
      navLabel: '연락처',
      category: 'GET IN TOUCH & PARTNERSHIP',
      title: '웹툰 PD 연락처 및 협업 제안',
      description: '상업 노블코믹스 각색, 오리지널 웹툰 스토리보드 디렉팅, 제작 공정 파이프라인 정합 및 신작 프로젝트 프로듀싱 문의 창구입니다.',
      type: 'contact',
      isEnabled: true,
      order: 4,
    },
  ],
  pageBlocks: [
    {
      id: 'block_proj_pipeline',
      pageId: 'projects',
      title: '상업 웹툰 제작 파이프라인 및 협업 프로세스',
      subtitle: '원작 분석부터 최종 런칭까지 4단계 실무 정합 공정',
      category: 'PRODUCTION PIPELINE & WORKFLOW',
      description: '작가진과의 시각적 마찰을 최소화하고 정기 연재 주기를 안정적으로 수호하기 위해 정립한 실무 협업 프로세스입니다.',
      type: 'process_steps',
      isEnabled: true,
      order: 0,
      bgColor: 'slate',
      items: [
        {
          id: 'step_1',
          value: '01',
          title: '원작 해체 & 각색 트리트먼트',
          subtitle: 'Step 01 · 기획 공정',
          tag: '원작 각색',
          description: '원작 소설의 방대한 텍스트 중 독자 이탈 구간을 과감히 압축하고, 회차별 킬링 포인트 및 엔딩 클리프행어를 선별하여 모바일 전용 시나리오로 재구성합니다.',
          bullets: ['원작 세계관 설정집 및 인물 관계도 도식화', '회차당 평균 65~70컷 기준 템포 분할', '초반 1~3화 후킹 지점 집중 설계']
        },
        {
          id: 'step_2',
          value: '02',
          title: '세로 스크롤 콘티 & 컷 호흡 설계',
          subtitle: 'Step 02 · 연출 공정',
          tag: '콘티 연출',
          description: '스마트폰 화면 기준 시선의 자연스러운 대각선 이동과 손가락 스크롤 터치 속도를 계산하여 컷 간격, 대사 여백, 임팩트 컷 크기를 조율합니다.',
          bullets: ['모바일 뷰어 실시간 스크롤 테스트', '대사 말풍선 시선 유도 경로 최적화', '하이라이트 액션 씬 풀스크린 컷 설계']
        },
        {
          id: 'step_3',
          value: '03',
          title: '3D 배경 및 스케치업 라이팅 정합',
          subtitle: 'Step 03 · 기술 공정',
          tag: '배경 합성',
          description: '인물 작화와 3D 배경의 이질감을 해소하기 위해 씬별 광원 키워드와 톤 앤 매너 프리셋을 제공하고 클립스튜디오 레이어 구조를 표준화합니다.',
          bullets: ['스케치업 카메라 투시 왜곡(FOV) 보정', '자연광/역광/던전광 라이팅 프리셋 적용', '후가공 텍스처 및 블룸 이펙트 정합']
        },
        {
          id: 'step_4',
          value: '04',
          title: '식자 가독성 검수 & 모바일 QA',
          subtitle: 'Step 04 · 최종 공정',
          tag: '런칭 & 납품',
          description: '다양한 해상도 기기(아이폰/갤럭시)에서 말풍선 크기, 폰트 가독성, 색역(sRGB) 일치 여부를 최종 전수 검수 후 세이브 원고를 아카이빙합니다.',
          bullets: ['디바이스별 모바일 실화면 최종 QA', '오탈자 및 효과음 식자 레이아웃 점검', '8회분 이상 세이브 원고 안정화 유지']
        }
      ]
    },
    {
      id: 'block_proj_faq',
      pageId: 'projects',
      title: '팀 프로젝트 협업 및 일정 관리 FAQ',
      subtitle: '작가진 및 제작사 실무진과의 소통 방식',
      category: 'PROJECT FAQ & COLLABORATION RULES',
      description: '상업 연재 프로젝트 진행 시 자주 논의되는 제작 프로세스 및 리스크 대응 방안입니다.',
      type: 'faq_accordion',
      isEnabled: true,
      order: 1,
      bgColor: 'white',
      items: [
        {
          id: 'proj_faq_1',
          title: '세이브 원고 부족 및 작가 건강 이슈 발생 시 어떻게 대처하나요?',
          tag: '일정 관리',
          description: '연재 개시 전 최소 8회분의 세이브 원고를 확보하며, 공정별 데드라인(콘티 D-10, 선화 D-6, 채색 D-3, 식자 D-1) 버퍼를 둡니다. 위기 시 어시스턴트 지원망 가동 및 편집부 사전 협의를 통해 휴재율 0%를 유지합니다.'
        },
        {
          id: 'proj_faq_2',
          title: '작화가님과의 연출 및 작화 수정 피드백은 어떻게 전달하나요?',
          tag: '커뮤니케이션',
          description: '단순 텍스트 지적이 아닌, 클립스튜디오 레이어 위에 직접 붉은 펜으로 컷 구도와 인체 동세를 수정한 직관적 레퍼런스 시안을 제작해 제공함으로써 불필요한 감정 소모와 재작업 시간을 대폭 단축합니다.'
        },
        {
          id: 'proj_faq_3',
          title: '3D 배경 및 외부 에셋 라이선스 관리는 어떻게 이루어지나요?',
          tag: '에셋 라이선스',
          description: '텀블벅, 에이콘3D 등에서 정식 구매한 상업용 에셋만을 엄선하여 사용하며, 프로젝트별 에셋 출처와 라이선스 범위를 스프레드시트에 전수 기록하여 법적 분쟁 리스크를 원천 차단합니다.'
        }
      ]
    },
    {
      id: 'block_personal_rules',
      pageId: 'personal',
      title: '세로 스크롤 연출 3대 핵심 디렉팅 철학',
      subtitle: '지면 만화와 구별되는 스마트폰 웹툰만의 고유한 문법',
      category: 'DIRECTING PHILOSOPHY & CONSTITUTION',
      description: '스마트폰 단말기 화면을 읽는 현대 독자의 인지 심리와 손가락 인터랙션을 고려한 3가지 연출 원칙입니다.',
      type: 'card_grid',
      isEnabled: true,
      order: 0,
      bgColor: 'slate',
      items: [
        {
          id: 'rule_1',
          title: '1. 시선의 대각선 낙하 유도 (Z-Path Flow)',
          subtitle: '자연스러운 시선 이동 경로',
          tag: '시선 유도',
          description: '인물의 표정 컷에서 대사 말풍선으로 이어지는 동선을 대각선으로 자연스럽게 유도하여 독자가 시각 피로도 없이 자연스러운 몰입감을 유지하도록 설계합니다.',
          bullets: ['좌상단→우하단 시선 흐름 준수', '말풍선 꼬리 길이와 위치 최적화', '컷 간 세로 여백을 활용한 감정 환기']
        },
        {
          id: 'rule_2',
          title: '2. 스크롤 가속과 제동 (Scroll Pacing Control)',
          subtitle: '손가락 터치와 호흡의 일치',
          tag: '호흡 조절',
          description: '빠른 액션 씬에서는 좁은 컷 간격과 파편화된 효과선으로 손가락을 빠르게 튕기게 만들고, 결정적인 감정 폭발 씬에서는 긴 세로 공백을 주어 무의식중에 스크롤을 멈추게 만듭니다.',
          bullets: ['액션 씬: 1화면당 2~3컷 밀도 높은 템포', '감정 씬: 스크롤 1.5화면 분량의 침묵 여백', '클라이맥스: 테두리를 탈피한 전신 풀샷']
        },
        {
          id: 'rule_3',
          title: '3. 3D 에셋과 2D 감성의 융합 (Hybrid Directing)',
          subtitle: '이질감 없는 세계관 구현',
          tag: '미장센',
          description: '3D 배경이 주는 이질감을 줄이기 위해 렌더링 선화의 굵기를 인물 펜터치와 일치시키고, 역광 및 대기 원근법(Fog/Bloom) 효과를 후가공하여 한 장의 회화 같은 완성도를 부여합니다.',
          bullets: ['스케치업 투시 왜곡(FOV) 교정', '장르별 조명 프리셋(자연광/던전광/마법광)', '레이어 마스크 기반의 효율적인 합성']
        }
      ]
    },
    {
      id: 'block_analysis_metrics',
      pageId: 'analysis',
      title: '상업 웹툰 유료 결제 전환(CVR) 3대 핵심 분석 축',
      subtitle: '독자 잔존율(Retention)과 유료 쿠키 전환율 극대화',
      category: 'COMMERCIAL FRAMEWORK',
      description: '연재작의 상업적 성공을 견인하기 위해 작품 기획 단계부터 정량적으로 검증하는 3대 분석 프레임워크입니다.',
      type: 'stats_metrics',
      isEnabled: true,
      order: 0,
      bgColor: 'white',
      items: [
        {
          id: 'metric_1',
          value: '40 Cut',
          title: '1화 이탈 방지 훅 (First Drop-off Prevention)',
          subtitle: '초반 40컷 내 직접 갈등',
          description: '독자가 1화를 읽고 무료 이탈하지 않도록 40컷 지점 내에 주인공의 첫 위기나 매력적인 보상을 배치하여 다음 화 클릭률을 극대화합니다.'
        },
        {
          id: 'metric_2',
          value: 'D-End',
          title: '회차 엔딩 클리프행어 (Cliffhanger Engine)',
          subtitle: '결제 버튼 앞 스크롤 정지',
          description: '주요 정보가 폭로되거나 결정적인 일격이 가해지는 순간 컷을 분할하고 엔딩을 맺어 다음 화 유료 미리보기 결제를 자연스럽게 유도합니다.'
        },
        {
          id: 'metric_3',
          value: '98 %',
          title: '주간 정시 마감 수호율 (On-time Delivery)',
          subtitle: '세이브 원고 파이프라인',
          description: '플랫폼 주간 랭킹 방어의 핵심은 안정적인 연재 리듬입니다. 체계적인 일정 관리로 휴재 없는 연속 연재를 지원합니다.'
        }
      ]
    },
    {
      id: 'block_contact_notice',
      pageId: 'contact',
      title: '신규 웹툰 기획 및 협업 제안 환영',
      subtitle: '상업 노블코믹스 각색 및 오리지널 웹툰 디렉팅 문의',
      category: 'INQUIRY & SCHEDULE',
      description: '상업 연재 프로젝트, 외주 콘티 감수, 3D 배경 합성 파이프라인 구축 문의는 이메일(mmduck25@gmail.com) 또는 유선 연락으로 남겨주시면 24시간 이내에 포트폴리오 맞춤 검토 후 회신드립니다.',
      type: 'text_banner',
      isEnabled: true,
      order: 0,
      bgColor: 'sky',
      items: [
        {
          id: 'contact_item_1',
          title: '원작 소설 웹툰화 타진 및 각색 기획안 사전 검토 가능',
          description: '원작의 모바일 스크롤 적합도, 장르 트렌드, 타겟 독자층 페르소나 분석'
        },
        {
          id: 'contact_item_2',
          title: '대면 및 온라인(Google Meet / Zoom) 미팅 진행 가능',
          description: '프로젝트 범위 협의, 세부 제작 파이프라인 맞춤 설계, 제작 일정 조율'
        }
      ]
    }
  ]
};


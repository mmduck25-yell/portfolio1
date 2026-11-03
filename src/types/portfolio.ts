export interface MetricItem {
  value: string;
  label: string;
  sub: string;
}

export interface ProfileData {
  name: string;
  englishName: string;
  role: string;
  coreCopy: string;
  careerSummary: string;
  email: string;
  phone: string;
  keywords: string[];
  avatarUrl?: string;
  metrics: MetricItem[];
  contactHours: string;
  collaborationNotice: string;
}

export interface SectionHeaderConfig {
  category: string;
  title: string;
  description: string;
}

export interface SectionHeaders {
  home?: SectionHeaderConfig;
  projects: SectionHeaderConfig;
  personal: SectionHeaderConfig;
  analysis: SectionHeaderConfig;
  contact: SectionHeaderConfig;
}

export interface Competency {
  id: string;
  title: string;
  category: 'visual' | 'resource' | 'planning' | 'communication';
  summary: string;
  bullets: string[];
  specs: string[];
}

export interface ProblemSolution {
  issue: string;
  solution: string;
  outcome: string;
}

export interface TeamProject {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  role: string;
  contributionPercent: number;
  period: string;
  platform: string;
  description: string;
  roleDetails: string[];
  problemsAndSolutions: ProblemSolution[];
  thumbnail: string;
  previewCuts: string[];
  metrics: string[];
}

export interface PersonalWork {
  id: string;
  type: 'scroll_storyboard' | 'composite' | 'genre_mood';
  title: string;
  subtitle: string;
  description: string;
  scriptText?: string;
  storyboardImage?: string;
  storyboardImages?: string[];
  techniques?: string[];
  compositeLayers?: {
    name: string;
    description: string;
    tag: string;
    image?: string;
  }[];
  genreScenes?: {
    genre: string;
    mood: string;
    lightingKeywords: string[];
    cameraGuide: string;
    description: string;
  }[];
}

export interface WebtoonAnalysis {
  id: string;
  title: string;
  originalWork: string;
  genre: string;
  platform: string;
  summary: string;
  pacingAnalysis: {
    topic: string;
    details: string;
  }[];
  visualMoodStrategy: {
    topic: string;
    details: string;
  }[];
  commercialStructure: {
    topic: string;
    details: string;
  }[];
  keyTakeaway: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  date?: string;
  description: string;
  bullets?: string[];
  imageUrl?: string;
  linkUrl?: string;
}

export type PageBlockType = 
  | 'text_banner' 
  | 'card_grid' 
  | 'process_steps' 
  | 'faq_accordion' 
  | 'stats_metrics' 
  | 'media_gallery';

export interface PageBlockItem {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  description?: string;
  bullets?: string[];
  imageUrl?: string;
  linkUrl?: string;
  value?: string;
  subtext?: string;
}

export interface PageContentBlock {
  id: string;
  pageId: string; // 'home', 'projects', 'personal', 'analysis', 'contact', or custom section ID
  title: string;
  subtitle?: string;
  category?: string;
  description?: string;
  type: PageBlockType;
  isEnabled?: boolean;
  order: number;
  bgColor?: 'white' | 'slate' | 'sky';
  items: PageBlockItem[];
}

export interface SiteSection {
  id: string; // e.g. 'home', 'projects', 'personal', 'analysis', 'contact', or custom ID 'section_xxx'
  navLabel: string; // Menu label in navbar, e.g. '홈', '팀 프로젝트', '수상 및 활동'
  category: string; // Top uppercase category, e.g. 'TEAM PRODUCTIONS & CASE STUDIES'
  title: string; // Main title of the section
  description: string; // Sub description
  type: 'home' | 'projects' | 'personal' | 'analysis' | 'contact' | 'custom' | 'timeline' | 'faq';
  isEnabled: boolean;
  order: number;
  customItems?: CustomSectionItem[];
}

export interface PortfolioStore {
  profile: ProfileData;
  sectionHeaders: SectionHeaders;
  competencies: Competency[];
  teamProjects: TeamProject[];
  personalWorks: PersonalWork[];
  analyses: WebtoonAnalysis[];
  sections: SiteSection[];
  pageBlocks?: PageContentBlock[];
}

export type NavPage = string;


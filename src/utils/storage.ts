import { PortfolioStore } from '../types/portfolio';
import { INITIAL_PORTFOLIO_DATA } from '../data/initialData';

const STORAGE_KEY = 'webtoon_pd_portfolio_data_v3';

export function loadPortfolioData(): PortfolioStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_PORTFOLIO_DATA;
    }
    const parsed = JSON.parse(raw);
    // Ensure all critical sections exist
    return {
      profile: { ...INITIAL_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
      sectionHeaders: {
        home: { ...INITIAL_PORTFOLIO_DATA.sectionHeaders.home, ...(parsed.sectionHeaders?.home || {}) },
        projects: { ...INITIAL_PORTFOLIO_DATA.sectionHeaders.projects, ...(parsed.sectionHeaders?.projects || {}) },
        personal: { ...INITIAL_PORTFOLIO_DATA.sectionHeaders.personal, ...(parsed.sectionHeaders?.personal || {}) },
        analysis: { ...INITIAL_PORTFOLIO_DATA.sectionHeaders.analysis, ...(parsed.sectionHeaders?.analysis || {}) },
        contact: { ...INITIAL_PORTFOLIO_DATA.sectionHeaders.contact, ...(parsed.sectionHeaders?.contact || {}) },
      },
      competencies: parsed.competencies || INITIAL_PORTFOLIO_DATA.competencies,
      teamProjects: parsed.teamProjects || INITIAL_PORTFOLIO_DATA.teamProjects,
      personalWorks: parsed.personalWorks || INITIAL_PORTFOLIO_DATA.personalWorks,
      analyses: parsed.analyses || INITIAL_PORTFOLIO_DATA.analyses,
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? parsed.sections
        : INITIAL_PORTFOLIO_DATA.sections,
      pageBlocks: Array.isArray(parsed.pageBlocks) && parsed.pageBlocks.length > 0
        ? parsed.pageBlocks
        : (INITIAL_PORTFOLIO_DATA.pageBlocks || []),
    };
  } catch (err) {
    console.error('Failed to load portfolio data from storage, using defaults:', err);
    return INITIAL_PORTFOLIO_DATA;
  }
}

export function savePortfolioData(data: PortfolioStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save portfolio data to storage:', err);
  }
}

export function resetPortfolioData(): PortfolioStore {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset portfolio data:', err);
  }
  return INITIAL_PORTFOLIO_DATA;
}

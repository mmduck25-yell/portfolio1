import React from 'react';
import { ArrowUp, Lock, ChevronRight } from 'lucide-react';
import { ProfileData, NavPage, SiteSection } from '../types/portfolio';

interface FooterProps {
  profile: ProfileData;
  onNavigate: (page: NavPage) => void;
  onOpenAdmin: () => void;
  sections?: SiteSection[];
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigate, onOpenAdmin, sections }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSections = sections && sections.length > 0
    ? [...sections].filter(s => s.isEnabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [
        { id: 'home', navLabel: '메인 홈 (Home)' },
        { id: 'projects', navLabel: '팀 프로젝트 사례' },
        { id: 'personal', navLabel: '개인 작업 & 콘티' },
        { id: 'analysis', navLabel: '작품 분석 리포트' },
        { id: 'contact', navLabel: '연락처 (Contact)' },
      ];


  return (
    <footer id="contact-footer" className="border-t border-slate-200 bg-slate-50 py-8 text-slate-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Quick Menu Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          {activeSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                onNavigate(sec.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-1 text-slate-600 hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-1 font-medium whitespace-nowrap"
            >
              <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
              <span>{sec.navLabel || (sec as any).title}</span>
            </button>
          ))}
        </div>


        {/* Quiet Bottom Strip: Copyright & Controls (NO BOTTOM CONTACT INFO) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 text-slate-500">
            <span>© {new Date().getFullYear()} {profile.name} ({profile.englishName}). All rights reserved.</span>
            <span>·</span>
            <span>Webtoon Producer & Director</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600 transition-colors cursor-pointer font-medium"
            >
              <Lock className="w-3 h-3 text-sky-600" />
              <span>Admin</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-600 hover:text-sky-600 transition-colors cursor-pointer font-bold"
              aria-label="최상단으로 이동"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

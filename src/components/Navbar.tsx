import React, { useState, useRef, useEffect } from 'react';
import { Lock, Menu, X } from 'lucide-react';
import { NavPage, SiteSection } from '../types/portfolio';

interface NavbarProps {
  name: string;
  role: string;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenAdmin: () => void;
  sections?: SiteSection[];
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  role,
  currentPage,
  onNavigate,
  onOpenAdmin,
  sections,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const defaultLinks: { label: string; page: NavPage }[] = [
    { label: '홈', page: 'home' },
    { label: '팀 프로젝트', page: 'projects' },
    { label: '개인 작업 & 콘티', page: 'personal' },
    { label: '작품 분석 리포트', page: 'analysis' },
    { label: '연락처', page: 'contact' },
  ];

  const activeSections = sections && sections.length > 0
    ? [...sections].filter(s => s.isEnabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : null;

  const navLinks: { label: string; page: NavPage }[] = activeSections
    ? activeSections.map(s => ({ label: s.navLabel || s.title, page: s.id }))
    : defaultLinks;


  const handleNavClick = (page: NavPage) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep the active tab scrolled into view in the mobile top navigation bar
  useEffect(() => {
    if (mobileNavRef.current) {
      const activeEl = mobileNavRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [currentPage]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Header Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark with Hong Yerang */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left text-sm sm:text-base font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-600 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="font-bold tracking-tight text-slate-900">{name}</span>
          <span className="text-slate-300 font-normal">/</span>
          <span className="text-slate-500 font-normal text-xs sm:text-sm">{role}</span>
        </button>

        {/* Zone 2: Desktop Navigation Links (Clean 5 items) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 relative ${
                  isActive ? 'text-sky-600 font-bold' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Admin & Mobile Toggle Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAdmin}
            title="관리자 설정"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-all bg-slate-50 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            <span>Admin</span>
          </button>

          {/* Mobile hamburger menu button for full menu list */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
            aria-label="전체 메뉴 펼치기"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Menu Tab Bar - Always visible right at the top on mobile */}
      <div className="md:hidden border-t border-slate-200/90 bg-slate-50/95 px-3 py-2">
        <nav
          ref={mobileNavRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
          aria-label="모바일 상단 메뉴 바"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => handleNavClick(link.page)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer (When hamburger toggled for expanded view) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase px-2 mb-1">
            PORTFOLIO MENU
          </div>
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`flex items-center justify-between w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="text-xs text-sky-600 font-semibold">현재 위치</span>}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>관리자 CMS 모드</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-sky-600 font-semibold underline cursor-pointer"
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TeamProjectsSection } from './components/TeamProjectsSection';
import { PersonalWorkSection } from './components/PersonalWorkSection';
import { AnalysisSection } from './components/AnalysisSection';
import { ContactPage } from './components/ContactPage';
import { CustomSection } from './components/CustomSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { PageHeader } from './components/PageHeader';
import { PageNavigation } from './components/PageNavigation';
import { PageContentBlocks } from './components/PageContentBlocks';
import { PortfolioStore, NavPage } from './types/portfolio';
import { INITIAL_PORTFOLIO_DATA } from './data/initialData';
import { loadPortfolioData, savePortfolioData, resetPortfolioData } from './utils/storage';

export default function App() {
  const [data, setData] = useState<PortfolioStore>(() => loadPortfolioData());
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'sections' | 'pageBlocks' | 'profile' | 'headers' | 'projects' | 'personal' | 'analyses'>('sections');
  const [adminPageId, setAdminPageId] = useState<string | undefined>(undefined);

  // Active sorted sections list
  const activeSections = (data.sections && data.sections.length > 0
    ? data.sections
    : INITIAL_PORTFOLIO_DATA.sections
  ).filter((s) => s.isEnabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Default to first active section or 'home'
  const homeSectionId = activeSections[0]?.id || 'home';

  // Parse initial page from hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash) return;
      if (activeSections.some((s) => s.id === hash)) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeSections]);

  // If current page is deleted or hidden, fallback to first available active section
  useEffect(() => {
    if (activeSections.length > 0 && !activeSections.some((s) => s.id === currentPage)) {
      const fallback = activeSections[0]?.id || 'home';
      setCurrentPage(fallback);
      window.location.hash = `#/${fallback}`;
    }
  }, [activeSections, currentPage]);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active section and neighboring sections
  const currentIndex = activeSections.findIndex((s) => s.id === currentPage);
  const currentSection = activeSections[currentIndex] || activeSections[0];
  const prevSection = currentIndex > 0 ? activeSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < activeSections.length - 1
      ? activeSections[currentIndex + 1]
      : null;

  // Sync title when profile name or page changes
  useEffect(() => {
    const currentLabel = currentSection?.navLabel || currentSection?.title || '포트폴리오';
    document.title = `${currentLabel} | 웹툰 PD ${data.profile.name} (${data.profile.englishName}) 포트폴리오`;
  }, [data.profile.name, data.profile.englishName, currentSection]);

  const handleSaveData = (newData: PortfolioStore) => {
    setData(newData);
    savePortfolioData(newData);
  };

  const handleResetData = () => {
    const initial = resetPortfolioData();
    setData(initial);
  };

  // Open Admin Modal directly to a specific tab and target page
  const handleOpenAdminTab = (tab?: string, targetPageId?: string) => {
    if (tab) setAdminTab(tab as any);
    setAdminPageId(targetPageId || currentPage);
    setIsAdminOpen(true);
  };

  // Direct In-Page Content Block Delete
  const handleDeleteBlock = (blockId: string) => {
    const remaining = (data.pageBlocks || []).filter((b) => b.id !== blockId);
    const updated = { ...data, pageBlocks: remaining };
    handleSaveData(updated);
  };

  // Direct In-Page Content Block Reorder
  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const allBlocks = [...(data.pageBlocks || [])];
    const pageItems = allBlocks
      .filter((b) => b.pageId === currentPage)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const idx = pageItems.findIndex((b) => b.id === blockId);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= pageItems.length) return;

    const [moved] = pageItems.splice(idx, 1);
    pageItems.splice(targetIdx, 0, moved);

    const reindexed = pageItems.map((b, i) => ({ ...b, order: i }));
    const otherBlocks = allBlocks.filter((b) => b.pageId !== currentPage);
    const updated = { ...data, pageBlocks: [...otherBlocks, ...reindexed] };
    handleSaveData(updated);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation Bar dynamically reflecting active sections */}
      <Navbar
        name={data.profile.name}
        role={data.profile.role}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleOpenAdminTab('sections')}
        sections={data.sections}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {/* Render dynamically based on current section type */}
        {currentSection && currentSection.type === 'home' && (
          <div className="space-y-0">
            <HeroSection
              profile={data.profile}
              headerConfig={
                data.sectionHeaders?.home || {
                  category: currentSection.category,
                  title: currentSection.title,
                  description: currentSection.description,
                }
              }
              onNavigate={handleNavigate}
            />

            {/* Modular Content Sections inside Home */}
            <PageContentBlocks
              pageId={currentSection.id}
              pageTitle={currentSection.navLabel || currentSection.title}
              blocks={data.pageBlocks || []}
              onOpenAdmin={handleOpenAdminTab}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
            />
          </div>
        )}

        {currentSection && currentSection.type === 'projects' && (
          <div>
            <PageHeader
              pageCategory={
                currentSection.category ||
                data.sectionHeaders?.projects?.category ||
                'TEAM PRODUCTIONS & CASE STUDIES'
              }
              pageTitle={
                currentSection.title ||
                data.sectionHeaders?.projects?.title ||
                '실무 협업 프로젝트 및 이슈 해결'
              }
              description={
                currentSection.description ||
                data.sectionHeaders?.projects?.description ||
                '노블코믹스 및 오리지널 웹툰의 기획, 콘티 감수, 배경 합성 파이프라인 정합, 마감 리스크 대응 실무 케이스 스터디입니다.'
              }
              onGoHome={() => handleNavigate(homeSectionId)}
            />
            <TeamProjectsSection projects={data.teamProjects} />

            {/* Modular Content Sections inside Projects */}
            <PageContentBlocks
              pageId={currentSection.id}
              pageTitle={currentSection.navLabel || currentSection.title}
              blocks={data.pageBlocks || []}
              onOpenAdmin={handleOpenAdminTab}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
            />

            <PageNavigation
              prevPage={
                prevSection
                  ? { page: prevSection.id, label: prevSection.navLabel || prevSection.title }
                  : undefined
              }
              nextPage={
                nextSection
                  ? { page: nextSection.id, label: nextSection.navLabel || nextSection.title }
                  : undefined
              }
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentSection && currentSection.type === 'personal' && (
          <div>
            <PageHeader
              pageCategory={
                currentSection.category ||
                data.sectionHeaders?.personal?.category ||
                'STORYBOARD & DIRECTING WORK'
              }
              pageTitle={
                currentSection.title ||
                data.sectionHeaders?.personal?.title ||
                '개인 작업 및 세로 스크롤 콘티'
              }
              description={
                currentSection.description ||
                data.sectionHeaders?.personal?.description ||
                '텍스트 대본의 모바일 컷 분할, 스마트폰 스크롤 시뮬레이터, 3D 배경 합성 레이어, 장르별 씬 연출 기획안입니다.'
              }
              onGoHome={() => handleNavigate(homeSectionId)}
            />
            <PersonalWorkSection works={data.personalWorks} />

            {/* Modular Content Sections inside Personal Work */}
            <PageContentBlocks
              pageId={currentSection.id}
              pageTitle={currentSection.navLabel || currentSection.title}
              blocks={data.pageBlocks || []}
              onOpenAdmin={handleOpenAdminTab}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
            />

            <PageNavigation
              prevPage={
                prevSection
                  ? { page: prevSection.id, label: prevSection.navLabel || prevSection.title }
                  : undefined
              }
              nextPage={
                nextSection
                  ? { page: nextSection.id, label: nextSection.navLabel || nextSection.title }
                  : undefined
              }
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentSection && currentSection.type === 'analysis' && (
          <div>
            <PageHeader
              pageCategory={
                currentSection.category ||
                data.sectionHeaders?.analysis?.category ||
                'COMMERCIAL INTELLIGENCE & ANALYSIS'
              }
              pageTitle={
                currentSection.title ||
                data.sectionHeaders?.analysis?.title ||
                '상업 웹툰 심층 분석 리포트'
              }
              description={
                currentSection.description ||
                data.sectionHeaders?.analysis?.description ||
                '상업 웹툰의 각색 방식, 씬 페이스, 유료 결제 전환 구조 분석서입니다.'
              }
              onGoHome={() => handleNavigate(homeSectionId)}
            />
            <AnalysisSection analyses={data.analyses} />

            {/* Modular Content Sections inside Analysis */}
            <PageContentBlocks
              pageId={currentSection.id}
              pageTitle={currentSection.navLabel || currentSection.title}
              blocks={data.pageBlocks || []}
              onOpenAdmin={handleOpenAdminTab}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
            />

            <PageNavigation
              prevPage={
                prevSection
                  ? { page: prevSection.id, label: prevSection.navLabel || prevSection.title }
                  : undefined
              }
              nextPage={
                nextSection
                  ? { page: nextSection.id, label: nextSection.navLabel || nextSection.title }
                  : undefined
              }
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentSection && currentSection.type === 'contact' && (
          <div>
            <ContactPage
              profile={data.profile}
              headerConfig={
                data.sectionHeaders?.contact || {
                  category: currentSection.category,
                  title: currentSection.title,
                  description: currentSection.description,
                }
              }
              onGoHome={() => handleNavigate(homeSectionId)}
            />

            {/* Modular Content Sections inside Contact */}
            <PageContentBlocks
              pageId={currentSection.id}
              pageTitle={currentSection.navLabel || currentSection.title}
              blocks={data.pageBlocks || []}
              onOpenAdmin={handleOpenAdminTab}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
            />

            <PageNavigation
              prevPage={
                prevSection
                  ? { page: prevSection.id, label: prevSection.navLabel || prevSection.title }
                  : undefined
              }
              nextPage={
                nextSection
                  ? { page: nextSection.id, label: nextSection.navLabel || nextSection.title }
                  : undefined
              }
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Custom / Timeline / FAQ Section Types */}
        {currentSection &&
          ['custom', 'timeline', 'faq'].includes(currentSection.type) && (
            <div>
              <CustomSection
                section={currentSection}
                onGoHome={() => handleNavigate(homeSectionId)}
              />

              {/* Modular Content Sections inside Custom Sections */}
              <PageContentBlocks
                pageId={currentSection.id}
                pageTitle={currentSection.navLabel || currentSection.title}
                blocks={data.pageBlocks || []}
                onOpenAdmin={handleOpenAdminTab}
                onDeleteBlock={handleDeleteBlock}
                onMoveBlock={handleMoveBlock}
              />

              <PageNavigation
                prevPage={
                  prevSection
                    ? { page: prevSection.id, label: prevSection.navLabel || prevSection.title }
                    : undefined
                }
                nextPage={
                  nextSection
                    ? { page: nextSection.id, label: nextSection.navLabel || nextSection.title }
                    : undefined
                }
                onNavigate={handleNavigate}
              />
            </div>
          )}
      </main>

      {/* Global Clean White Footer */}
      <Footer
        profile={data.profile}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleOpenAdminTab('sections')}
        sections={data.sections}
      />

      {/* Admin CMS Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onSave={handleSaveData}
        onReset={handleResetData}
        initialTab={adminTab}
        initialPageId={adminPageId}
      />
    </div>
  );
}


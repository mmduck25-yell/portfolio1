import React, { useState, useRef } from 'react';
import { SiteSection, CustomSectionItem, SectionHeaders } from '../types/portfolio';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Layers, 
  HelpCircle, 
  Clock, 
  LayoutGrid, 
  FolderGit2, 
  BookOpen, 
  BarChart3, 
  Mail, 
  ImagePlus, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';
import { compressAndReadFile } from '../utils/imageUpload';

interface SectionManagerProps {
  sections: SiteSection[];
  onChangeSections: (newSections: SiteSection[]) => void;
  sectionHeaders: SectionHeaders;
  onChangeSectionHeaders: (newHeaders: SectionHeaders) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  onChangeSections,
  sectionHeaders,
  onChangeSectionHeaders,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<SiteSection['type']>('custom');

  // Active custom item for image upload
  const [activeUploadTarget, setActiveUploadTarget] = useState<{ sectionId: string; itemId: string } | null>(null);
  const customImageInputRef = useRef<HTMLInputElement>(null);

  // Expanded custom sections
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});

  const toggleSectionExpand = (id: string) => {
    setExpandedSectionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Reorder sections
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const updated = [...sortedSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index orders
    const reindexed = updated.map((sec, idx) => ({ ...sec, order: idx }));
    onChangeSections(reindexed);
  };

  // Toggle isEnabled
  const handleToggleEnabled = (id: string) => {
    const updated = sections.map(sec =>
      sec.id === id ? { ...sec, isEnabled: sec.isEnabled === false ? true : false } : sec
    );
    onChangeSections(updated);
  };

  // Delete section
  const handleDeleteSection = (id: string, label: string) => {
    if (sections.length <= 1) {
      alert('최소 1개 이상의 섹션이 유지되어야 합니다. 삭제할 수 없습니다.');
      return;
    }

    if (window.confirm(`정말로 '${label}' 섹션을 전체 웹사이트에서 완전히 삭제하시겠습니까?\n\n삭제 후 저장을 누르면 네비게이션 및 페이지 목록에서 완전히 제거됩니다.`)) {
      const remaining = sections.filter(sec => sec.id !== id);
      const reindexed = remaining.map((sec, idx) => ({ ...sec, order: idx }));
      onChangeSections(reindexed);
    }
  };

  // Update section metadata
  const handleUpdateSectionField = (id: string, field: keyof SiteSection, value: any) => {
    const updated = sections.map(sec => {
      if (sec.id === id) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    onChangeSections(updated);

    // Keep sectionHeaders in sync if built-in
    if (['home', 'projects', 'personal', 'analysis', 'contact'].includes(id)) {
      const headerKey = id as keyof SectionHeaders;
      if (field === 'title' || field === 'category' || field === 'description') {
        onChangeSectionHeaders({
          ...sectionHeaders,
          [headerKey]: {
            ...sectionHeaders[headerKey],
            [field]: value,
          },
        });
      }
    }
  };

  // Add new section
  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim()) {
      alert('메뉴명을 입력해주세요.');
      return;
    }

    const newId = `section_${Date.now()}`;
    const newSection: SiteSection = {
      id: newId,
      navLabel: newNavLabel.trim(),
      category: newCategory.trim() || 'NEW ARCHIVE & SHOWCASE',
      title: newTitle.trim() || newNavLabel.trim(),
      description: newDescription.trim() || '관리자가 추가한 신규 섹션입니다.',
      type: newType,
      isEnabled: true,
      order: sections.length,
      customItems: [
        {
          id: `item_${Date.now()}_1`,
          title: '첫 번째 항목 제목',
          subtitle: '상세 부제목 또는 진행 기간',
          tag: '신규 기획',
          date: '2025.01',
          description: '이곳에 상세 설명 및 실무 협업 내용을 자유롭게 기입해주세요.',
          bullets: ['핵심 성과 또는 디렉팅 포인트 1', '모바일 스크롤 컷 분할 및 정합 완료'],
        },
      ],
    };

    onChangeSections([...sections, newSection]);
    setIsAddingNew(false);
    setNewNavLabel('');
    setNewCategory('');
    setNewTitle('');
    setNewDescription('');
    setNewType('custom');
    setExpandedSectionIds(prev => ({ ...prev, [newId]: true }));
  };

  // Add item to custom section
  const handleAddCustomItem = (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: `item_${Date.now()}`,
      title: '새로운 콘텐츠 항목',
      subtitle: '부제목 또는 역할',
      tag: '주요 성과',
      date: '2025',
      description: '상세 설명 내용을 작성해주세요.',
      bullets: ['주요 세부 사항 1', '주요 세부 사항 2'],
    };

    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          customItems: [...(sec.customItems || []), newItem],
        };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  // Delete item from custom section
  const handleDeleteCustomItem = (sectionId: string, itemId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          customItems: (sec.customItems || []).filter(item => item.id !== itemId),
        };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  // Update custom item field
  const handleUpdateCustomItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: any) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          customItems: (sec.customItems || []).map(item => {
            if (item.id === itemId) {
              return { ...item, [field]: value };
            }
            return item;
          }),
        };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  // Image Upload Handler for Custom Items
  const handleCustomImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    try {
      const dataUrl = await compressAndReadFile(file, 1400, 0.85);
      handleUpdateCustomItem(activeUploadTarget.sectionId, activeUploadTarget.itemId, 'imageUrl', dataUrl);
    } catch (err) {
      alert('이미지를 불러오는데 실패했습니다.');
    } finally {
      if (customImageInputRef.current) customImageInputRef.current.value = '';
      setActiveUploadTarget(null);
    }
  };

  const getTypeBadge = (type: SiteSection['type']) => {
    switch (type) {
      case 'home':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><LayoutGrid className="w-3 h-3" /> 메인 홈</span>;
      case 'projects':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100"><FolderGit2 className="w-3 h-3" /> 팀 프로젝트</span>;
      case 'personal':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"><BookOpen className="w-3 h-3" /> 개인 작업 & 콘티</span>;
      case 'analysis':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><BarChart3 className="w-3 h-3" /> 상업 분석</span>;
      case 'contact':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><Mail className="w-3 h-3" /> 연락처</span>;
      case 'timeline':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100"><Clock className="w-3 h-3" /> 타임라인/연혁</span>;
      case 'faq':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100"><HelpCircle className="w-3 h-3" /> FAQ 아코디언</span>;
      case 'custom':
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200"><Layers className="w-3 h-3" /> 커스텀 카드</span>;
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Hidden image input for custom items */}
      <input
        type="file"
        ref={customImageInputRef}
        accept="image/*"
        onChange={handleCustomImageFile}
        className="hidden"
      />

      {/* Guide Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-950 text-sm">전체 페이지 & 섹션 추가 / 삭제 / 순서 관리</span>
            <span className="bg-sky-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
              총 {sections.length}개 섹션
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            웹사이트 상단 네비게이션 및 페이지 목록에 나타나는 섹션을 직접 <strong>추가</strong>하거나 <strong>삭제</strong>할 수 있습니다. 
            위/아래 화살표를 눌러 메뉴 노출 순서를 변경하고, 노출 여부(눈 아이콘)를 설정할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? '추가 취소' : '새 섹션 추가하기'}</span>
        </button>
      </div>

      {/* NEW SECTION CREATION FORM */}
      {isAddingNew && (
        <form onSubmit={handleCreateSection} className="bg-white border-2 border-sky-400 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-sky-600" />
              <span>새로운 섹션 / 메뉴 페이지 생성</span>
            </h4>
            <span className="text-[11px] text-slate-400">모든 항목은 생성 후에도 수정 가능합니다</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">메뉴명 (상단 네비게이션 노출 이름) *</label>
              <input
                type="text"
                value={newNavLabel}
                onChange={e => setNewNavLabel(e.target.value)}
                placeholder="예: 수상 및 활동, 작업 프로세스, FAQ"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">섹션 유형 (레이아웃 형태)</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as SiteSection['type'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
              >
                <option value="custom">카드형 쇼케이스 (기본: 이미지+제목+설명+불릿 카드)</option>
                <option value="timeline">타임라인 / 연혁형 (연도/날짜별 마일스톤)</option>
                <option value="faq">FAQ / Q&A 아코디언 (질문과 답변)</option>
                <option value="projects">팀 프로젝트 쇼케이스</option>
                <option value="personal">개인 작업 & 콘티</option>
                <option value="analysis">상업 작품 분석</option>
                <option value="contact">연락처 및 협업 제안</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">영문 카테고리 태그 (헤더 상단 노출)</label>
              <input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="예: AWARDS & MILESTONES, PROCESS"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">섹션 메인 타이틀</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="예: 웹툰 공모전 수상 및 대외 활동 내역"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">섹션 상세 설명 (헤더 본문)</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="해당 섹션에 대한 전반적인 소개 및 개요를 입력해주세요."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg cursor-pointer shadow-xs"
            >
              섹션 생성 완료
            </button>
          </div>
        </form>
      )}

      {/* SECTIONS LIST */}
      <div className="space-y-4">
        {sortedSections.map((sec, index) => {
          const isCustomType = ['custom', 'timeline', 'faq'].includes(sec.type);
          const isExpanded = !!expandedSectionIds[sec.id];
          const isFirst = index === 0;
          const isLast = index === sortedSections.length - 1;

          return (
            <div
              key={sec.id}
              className={`bg-white border rounded-2xl transition-all shadow-2xs ${
                sec.isEnabled === false
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Order control */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMove(index, 'up')}
                      title="위로 이동"
                      className={`p-1 rounded cursor-pointer ${
                        isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-white hover:text-sky-600'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold px-1 text-slate-500">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMove(index, 'down')}
                      title="아래로 이동"
                      className={`p-1 rounded cursor-pointer ${
                        isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-white hover:text-sky-600'
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Badges & Title */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(sec.type)}
                      <span className="font-bold text-sm text-slate-900">{sec.navLabel}</span>
                      {sec.isEnabled === false && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                          숨김 상태
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ID: {sec.id} · 분류: {sec.category || 'CATEGORY'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(sec.id)}
                    title={sec.isEnabled === false ? '섹션 표시하기' : '섹션 숨기기'}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      sec.isEnabled === false
                        ? 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sec.isEnabled === false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>숨김</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>노출중</span>
                      </>
                    )}
                  </button>

                  {/* Expand content items (if custom) */}
                  {isCustomType && (
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand(sec.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 cursor-pointer transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>콘텐츠 관리 ({sec.customItems?.length || 0})</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}

                  {/* DELETE SECTION BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id, sec.navLabel)}
                    title="섹션 삭제"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>섹션 삭제</span>
                  </button>
                </div>
              </div>

              {/* Editable Fields for the Section */}
              <div className="p-4 sm:p-5 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-[11px]">메뉴 이름 (네비게이션 라벨)</label>
                  <input
                    type="text"
                    value={sec.navLabel}
                    onChange={e => handleUpdateSectionField(sec.id, 'navLabel', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-[11px]">영문 카테고리 태그</label>
                  <input
                    type="text"
                    value={sec.category}
                    onChange={e => handleUpdateSectionField(sec.id, 'category', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-[11px]">메인 타이틀</label>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={e => handleUpdateSectionField(sec.id, 'title', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-slate-600 font-semibold text-[11px]">섹션 설명</label>
                  <textarea
                    rows={2}
                    value={sec.description}
                    onChange={e => handleUpdateSectionField(sec.id, 'description', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* CUSTOM SECTION ITEMS SUB-MANAGER */}
              {isCustomType && isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        <span>'{sec.navLabel}' 섹션 내부 콘텐츠 항목 관리</span>
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {sec.type === 'timeline'
                          ? '연도/마일스톤 순서대로 표시되는 타임라인 항목입니다.'
                          : sec.type === 'faq'
                          ? '질문과 답변으로 구성되는 아코디언 항목입니다.'
                          : '반응형 카드 격자로 표시되는 쇼케이스 항목입니다.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCustomItem(sec.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ 항목 추가</span>
                    </button>
                  </div>

                  {(!sec.customItems || sec.customItems.length === 0) ? (
                    <div className="py-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      등록된 세부 항목이 없습니다. '+ 항목 추가' 버튼을 눌러 첫 항목을 작성해보세요.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sec.customItems.map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded">
                              ITEM #{itemIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomItem(sec.id, item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                              title="항목 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">제목 / 질문 *</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'title', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">부제목 / 소제목</label>
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'subtitle', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">태그 / 분류</label>
                              <input
                                type="text"
                                value={item.tag || ''}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'tag', e.target.value)}
                                placeholder="예: 공모전 수상, 기획 멘토링"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">일자 / 기간</label>
                              <input
                                type="text"
                                value={item.date || ''}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'date', e.target.value)}
                                placeholder="예: 2024.11"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">외부 링크 URL (선택)</label>
                              <input
                                type="url"
                                value={item.linkUrl || ''}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'linkUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700">상세 설명 / 답변 본문</label>
                              <textarea
                                rows={3}
                                value={item.description}
                                onChange={e => handleUpdateCustomItem(sec.id, item.id, 'description', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                              />
                            </div>

                            {/* Bullets List */}
                            <div className="sm:col-span-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-700">불릿 포인트 / 핵심 요약 목록</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentBullets = item.bullets || [];
                                    handleUpdateCustomItem(sec.id, item.id, 'bullets', [...currentBullets, '새로운 세부 사항']);
                                  }}
                                  className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                                >
                                  + 불릿 추가
                                </button>
                              </div>

                              {(item.bullets || []).map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={e => {
                                      const updatedBullets = [...(item.bullets || [])];
                                      updatedBullets[bIdx] = e.target.value;
                                      handleUpdateCustomItem(sec.id, item.id, 'bullets', updatedBullets);
                                    }}
                                    className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedBullets = (item.bullets || []).filter((_, idx) => idx !== bIdx);
                                      handleUpdateCustomItem(sec.id, item.id, 'bullets', updatedBullets);
                                    }}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Image Attachment from PC */}
                            <div className="sm:col-span-3 pt-2 border-t border-slate-200/80">
                              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                                항목 이미지 (내 컴퓨터에서 사진 첨부)
                              </label>

                              {item.imageUrl ? (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.imageUrl}
                                    alt="첨부 이미지"
                                    className="w-20 h-16 object-cover rounded-lg border border-slate-200 bg-white"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveUploadTarget({ sectionId: sec.id, itemId: item.id });
                                        customImageInputRef.current?.click();
                                      }}
                                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                                    >
                                      이미지 변경
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateCustomItem(sec.id, item.id, 'imageUrl', undefined)}
                                      className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 cursor-pointer"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveUploadTarget({ sectionId: sec.id, itemId: item.id });
                                    customImageInputRef.current?.click();
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 bg-white hover:border-sky-400 hover:text-sky-600 text-slate-600 text-xs cursor-pointer transition-colors"
                                >
                                  <ImagePlus className="w-3.5 h-3.5 text-sky-500" />
                                  <span>내 컴퓨터에서 이미지 첨부하기</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

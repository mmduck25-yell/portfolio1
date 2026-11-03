import React, { useState, useRef } from 'react';
import { 
  PageContentBlock, 
  PageBlockItem, 
  SiteSection 
} from '../types/portfolio';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Layers, 
  HelpCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ImagePlus, 
  Settings2, 
  Sparkles,
  BarChart3,
  ListOrdered,
  LayoutGrid,
  FileText,
  Images
} from 'lucide-react';
import { compressAndReadFile } from '../utils/imageUpload';

interface PageBlockManagerProps {
  sections: SiteSection[];
  pageBlocks: PageContentBlock[];
  onChangePageBlocks: (newBlocks: PageContentBlock[]) => void;
  selectedPageId?: string;
}

export const PageBlockManager: React.FC<PageBlockManagerProps> = ({
  sections,
  pageBlocks,
  onChangePageBlocks,
  selectedPageId: initialSelectedPageId,
}) => {
  // Current page filter
  const [activePageId, setActivePageId] = useState<string>(
    initialSelectedPageId || sections[0]?.id || 'home'
  );

  // New block form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<PageContentBlock['type']>('card_grid');
  const [newBgColor, setNewBgColor] = useState<PageContentBlock['bgColor']>('slate');

  // Expanded block IDs
  const [expandedBlockIds, setExpandedBlockIds] = useState<Record<string, boolean>>({});

  // Image Upload Target
  const [activeUploadTarget, setActiveUploadTarget] = useState<{ blockId: string; itemId: string } | null>(null);
  const blockImageInputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (id: string) => {
    setExpandedBlockIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter blocks for active page and sort by order
  const currentBlocks = pageBlocks
    .filter((b) => b.pageId === activePageId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Find active section info
  const activeSection = sections.find((s) => s.id === activePageId);

  // Reorder blocks within current page
  const handleMove = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = currentBlocks.findIndex((b) => b.id === blockId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentBlocks.length) return;

    const reorderedCurrent = [...currentBlocks];
    const [moved] = reorderedCurrent.splice(currentIndex, 1);
    reorderedCurrent.splice(targetIndex, 0, moved);

    // Update orders for current page
    const updatedCurrent = reorderedCurrent.map((b, idx) => ({ ...b, order: idx }));
    const otherBlocks = pageBlocks.filter((b) => b.pageId !== activePageId);

    onChangePageBlocks([...otherBlocks, ...updatedCurrent]);
  };

  // Toggle Visibility
  const handleToggleEnabled = (blockId: string) => {
    const updated = pageBlocks.map((b) =>
      b.id === blockId ? { ...b, isEnabled: b.isEnabled === false ? true : false } : b
    );
    onChangePageBlocks(updated);
  };

  // Delete Content Section
  const handleDeleteBlock = (blockId: string, blockTitle: string) => {
    if (
      window.confirm(
        `정말로 '${blockTitle}' 내용 섹션을 완전히 삭제하시겠습니까?\n\n이 페이지에서 해당 내용 섹션이 영구히 제거됩니다.`
      )
    ) {
      const remaining = pageBlocks.filter((b) => b.id !== blockId);
      // Re-index remaining for this page
      const remainingForPage = remaining.filter((b) => b.pageId === activePageId);
      const reindexedForPage = remainingForPage.map((b, idx) => ({ ...b, order: idx }));
      const otherBlocks = remaining.filter((b) => b.pageId !== activePageId);
      onChangePageBlocks([...otherBlocks, ...reindexedForPage]);
    }
  };

  // Update Block Meta
  const handleUpdateBlockField = (
    blockId: string,
    field: keyof PageContentBlock,
    value: any
  ) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, [field]: value };
      }
      return b;
    });
    onChangePageBlocks(updated);
  };

  // Create New Content Block
  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('섹션 제목을 입력해주세요.');
      return;
    }

    const newId = `block_${Date.now()}`;
    const defaultItems: PageBlockItem[] =
      newType === 'process_steps'
        ? [
            {
              id: `item_${Date.now()}_1`,
              value: '01',
              title: '1단계: 사전 기획 및 분석',
              subtitle: 'Step 01',
              tag: '사전 기획',
              description: '작업의 기초가 되는 원작 분석 및 방향성을 설정합니다.',
              bullets: ['핵심 목표 정의', '일정 수립'],
            },
            {
              id: `item_${Date.now()}_2`,
              value: '02',
              title: '2단계: 실무 제작 및 검수',
              subtitle: 'Step 02',
              tag: '실무 제작',
              description: '체계적인 공정 정합을 통해 품질을 극대화합니다.',
              bullets: ['상세 피드백 반영', '최종 확인'],
            },
          ]
        : newType === 'faq_accordion'
        ? [
            {
              id: `item_${Date.now()}_1`,
              title: '자주 묻는 질문 1: 협업 방식 및 일정은 어떻게 조율되나요?',
              tag: 'FAQ',
              description: '질문에 대한 상세한 답변을 작성해주세요.',
              bullets: ['세부 안내 사항 1', '세부 안내 사항 2'],
            },
          ]
        : newType === 'stats_metrics'
        ? [
            {
              id: `item_${Date.now()}_1`,
              value: '100%',
              title: '핵심 달성 지표',
              subtitle: '정량적 성과',
              description: '해당 지표에 대한 구체적인 설명과 의미를 작성해주세요.',
            },
          ]
        : [
            {
              id: `item_${Date.now()}_1`,
              title: '신규 콘텐츠 카드 제목',
              subtitle: '부제목 또는 카테고리',
              tag: '신규 항목',
              description: '이곳에 상세한 설명 내용을 입력해주세요.',
              bullets: ['주요 특징 1', '주요 특징 2'],
            },
          ];

    const newBlock: PageContentBlock = {
      id: newId,
      pageId: activePageId,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory.trim() || 'SECTION HIGHLIGHT',
      description: newDescription.trim() || undefined,
      type: newType,
      isEnabled: true,
      order: currentBlocks.length,
      bgColor: newBgColor,
      items: defaultItems,
    };

    onChangePageBlocks([...pageBlocks, newBlock]);
    setIsAddingNew(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewCategory('');
    setNewDescription('');
    setExpandedBlockIds((prev) => ({ ...prev, [newId]: true }));
  };

  // Add Item to Block
  const handleAddItemToBlock = (blockId: string) => {
    const newItem: PageBlockItem = {
      id: `item_${Date.now()}`,
      title: '새로운 세부 내용 항목',
      subtitle: '부제목 또는 분류',
      tag: '항목',
      description: '상세 내용을 입력해주세요.',
      bullets: ['세부 내용 1', '세부 내용 2'],
    };

    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          items: [...(b.items || []), newItem],
        };
      }
      return b;
    });
    onChangePageBlocks(updated);
  };

  // Delete Item from Block
  const handleDeleteItemFromBlock = (blockId: string, itemId: string) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          items: (b.items || []).filter((item) => item.id !== itemId),
        };
      }
      return b;
    });
    onChangePageBlocks(updated);
  };

  // Update Item in Block
  const handleUpdateItem = (
    blockId: string,
    itemId: string,
    field: keyof PageBlockItem,
    value: any
  ) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          items: (b.items || []).map((item) => {
            if (item.id === itemId) {
              return { ...item, [field]: value };
            }
            return item;
          }),
        };
      }
      return b;
    });
    onChangePageBlocks(updated);
  };

  // Image Upload Handler
  const handleItemImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    try {
      const dataUrl = await compressAndReadFile(file, 1400, 0.85);
      handleUpdateItem(
        activeUploadTarget.blockId,
        activeUploadTarget.itemId,
        'imageUrl',
        dataUrl
      );
    } catch (err) {
      alert('이미지를 불러오는데 실패했습니다.');
    } finally {
      if (blockImageInputRef.current) blockImageInputRef.current.value = '';
      setActiveUploadTarget(null);
    }
  };

  const getTypeIcon = (type: PageContentBlock['type']) => {
    switch (type) {
      case 'process_steps':
        return <ListOrdered className="w-3.5 h-3.5 text-sky-600" />;
      case 'card_grid':
        return <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />;
      case 'faq_accordion':
        return <HelpCircle className="w-3.5 h-3.5 text-teal-600" />;
      case 'stats_metrics':
        return <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'text_banner':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'media_gallery':
        return <Images className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  const getTypeName = (type: PageContentBlock['type']) => {
    switch (type) {
      case 'process_steps':
        return '프로세스 / 단계별 파이프라인';
      case 'card_grid':
        return '카드 그리드 쇼케이스';
      case 'faq_accordion':
        return 'FAQ / Q&A 아코디언';
      case 'stats_metrics':
        return '핵심 수치 / 지표 카드';
      case 'text_banner':
        return '공지 / 텍스트 배너';
      case 'media_gallery':
        return '미디어 갤러리';
      default:
        return '내용 섹션';
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Hidden image input for item uploads */}
      <input
        type="file"
        ref={blockImageInputRef}
        accept="image/*"
        onChange={handleItemImageFile}
        className="hidden"
      />

      {/* Page Selector Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-sky-700 uppercase">
              PAGE SELECTION
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              내용 섹션을 관리할 메뉴(페이지)를 선택하세요
            </h4>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingNew ? '추가 닫기' : `+ '${activeSection?.navLabel || '이 페이지'}'에 내용 섹션 추가`}</span>
          </button>
        </div>

        {/* Page pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/80">
          {sections.map((sec) => {
            const count = pageBlocks.filter((b) => b.pageId === sec.id).length;
            const isSelected = sec.id === activePageId;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActivePageId(sec.id);
                  setIsAddingNew(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{sec.navLabel}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white text-sky-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}개
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide Note */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          선택된 <strong>'{activeSection?.navLabel}'</strong> 페이지 내부에 들어갈 내용 섹션입니다. 
          새로운 섹션을 추가하거나 불필요한 섹션을 <strong>삭제</strong>할 수 있으며, 
          위/아래 순서 조정 및 제목, 설명, 텍스트, 이미지를 자유롭게 수정할 수 있습니다.
        </p>
      </div>

      {/* CREATE NEW BLOCK FORM */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateBlock}
          className="bg-white border-2 border-sky-400 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" />
              <span>'{activeSection?.navLabel}' 페이지에 새로운 내용 섹션 생성</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              PAGE ID: {activePageId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">섹션 제목 *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 제작 파이프라인 및 협업 프로세스, 자주 묻는 질문 FAQ"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">섹션 유형 (레이아웃 형태)</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as PageContentBlock['type'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
              >
                <option value="card_grid">카드 그리드 (제목+설명+불릿 포인트 쇼케이스)</option>
                <option value="process_steps">프로세스 / 단계별 파이프라인 (01, 02, 03... 스텝형)</option>
                <option value="faq_accordion">FAQ / Q&A 아코디언 (질문과 답변 접기/펼치기)</option>
                <option value="stats_metrics">핵심 수치 / 지표 카드 (큰 숫자+라벨+설명)</option>
                <option value="text_banner">공지 / 텍스트 배너 (강조 안내 박스)</option>
                <option value="media_gallery">미디어 갤러리 (이미지 컷 모음)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">영문 카테고리 태그 (상단 미니 뱃지)</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="예: WORKFLOW & PIPELINE, FAQ, HIGHLIGHT"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">부제목 (선택)</label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="예: 원작 분석부터 최종 런칭까지 4단계 실무 정합"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">배경 테마 스타일</label>
              <select
                value={newBgColor}
                onChange={(e) => setNewBgColor(e.target.value as PageContentBlock['bgColor'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
              >
                <option value="white">화이트 (깔끔한 기본 흰색 배경)</option>
                <option value="slate">슬레이트 그레이 (차분하고 세련된 연회색)</option>
                <option value="sky">스카이 하이라이트 (시원한 하늘색 포인트 배경)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">섹션 본문 상세 설명</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="해당 섹션의 목적 및 전반적인 가이드를 작성해주세요."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              내용 섹션 생성 완료
            </button>
          </div>
        </form>
      )}

      {/* CONTENT BLOCKS LIST */}
      <div className="space-y-4">
        {currentBlocks.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
            <div className="inline-flex p-3 rounded-full bg-white text-slate-400 border border-slate-200">
              <Layers className="w-6 h-6 text-sky-500" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-800">
                '{activeSection?.navLabel}' 페이지에 등록된 추가 내용 섹션이 없습니다
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                상단의 <strong>'+ 내용 섹션 추가'</strong> 버튼을 눌러 프로세스 파이프라인, 카드 그리드, FAQ, 수치 지표 섹션을 손쉽게 추가해보세요.
              </p>
            </div>
          </div>
        ) : (
          currentBlocks.map((block, index) => {
            const isFirst = index === 0;
            const isLast = index === currentBlocks.length - 1;
            const isExpanded = !!expandedBlockIds[block.id];

            return (
              <div
                key={block.id}
                className={`bg-white border rounded-2xl transition-all shadow-2xs ${
                  block.isEnabled === false
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* Order Control */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMove(block.id, 'up')}
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
                        onClick={() => handleMove(block.id, 'down')}
                        title="아래로 이동"
                        className={`p-1 rounded cursor-pointer ${
                          isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-white hover:text-sky-600'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {getTypeIcon(block.type)}
                          <span>{getTypeName(block.type)}</span>
                        </span>
                        <span className="font-bold text-sm text-slate-900">{block.title}</span>
                        {block.isEnabled === false && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                            숨김
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        태그: {block.category || 'CATEGORY'} · 하위 항목: {block.items?.length || 0}개
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(block.id)}
                      title={block.isEnabled === false ? '섹션 표시하기' : '섹션 숨기기'}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        block.isEnabled === false
                          ? 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {block.isEnabled === false ? (
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

                    {/* Expand Item Editor */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(block.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 cursor-pointer transition-colors"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>하위 항목 편집 ({block.items?.length || 0})</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* DELETE CONTENT SECTION BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id, block.title)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
                      title="내용 섹션 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>섹션 삭제</span>
                    </button>
                  </div>
                </div>

                {/* Editable Fields for Block */}
                <div className="p-4 sm:p-5 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold text-[11px]">섹션 메인 타이틀</label>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => handleUpdateBlockField(block.id, 'title', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold text-[11px]">영문 카테고리 태그</label>
                    <input
                      type="text"
                      value={block.category || ''}
                      onChange={(e) => handleUpdateBlockField(block.id, 'category', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold text-[11px]">부제목</label>
                    <input
                      type="text"
                      value={block.subtitle || ''}
                      onChange={(e) => handleUpdateBlockField(block.id, 'subtitle', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-600 font-semibold text-[11px]">섹션 설명</label>
                    <textarea
                      rows={2}
                      value={block.description || ''}
                      onChange={(e) => handleUpdateBlockField(block.id, 'description', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold text-[11px]">배경 테마</label>
                    <select
                      value={block.bgColor || 'white'}
                      onChange={(e) => handleUpdateBlockField(block.id, 'bgColor', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <option value="white">화이트 배경</option>
                      <option value="slate">슬레이트 연회색 배경</option>
                      <option value="sky">스카이 하늘색 포인트 배경</option>
                    </select>
                  </div>
                </div>

                {/* SUB-ITEMS ACCORDION */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {getTypeIcon(block.type)}
                          <span>'{block.title}' 내부 세부 항목 관리 ({block.items?.length || 0})</span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          {getTypeName(block.type)}에 해당하는 세부 카드/단계/질문 항목들을 수정하거나 추가할 수 있습니다.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddItemToBlock(block.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ 항목 추가</span>
                      </button>
                    </div>

                    {(!block.items || block.items.length === 0) ? (
                      <div className="py-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                        등록된 세부 항목이 없습니다. '+ 항목 추가' 버튼을 눌러 항목을 생성해보세요.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {block.items.map((item, itemIdx) => (
                          <div
                            key={item.id || itemIdx}
                            className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3 relative group"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                              <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded">
                                ITEM #{itemIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteItemFromBlock(block.id, item.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                                title="항목 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">항목 제목 / 질문 *</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleUpdateItem(block.id, item.id, 'title', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">부제목 / 소제목</label>
                                <input
                                  type="text"
                                  value={item.subtitle || ''}
                                  onChange={(e) => handleUpdateItem(block.id, item.id, 'subtitle', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                  {block.type === 'process_steps' ? '스텝 번호 (예: 01)' : block.type === 'stats_metrics' ? '지표 수치 (예: 98%)' : '태그 / 분류'}
                                </label>
                                <input
                                  type="text"
                                  value={item.value || item.tag || ''}
                                  onChange={(e) => {
                                    if (block.type === 'process_steps' || block.type === 'stats_metrics') {
                                      handleUpdateItem(block.id, item.id, 'value', e.target.value);
                                    } else {
                                      handleUpdateItem(block.id, item.id, 'tag', e.target.value);
                                    }
                                  }}
                                  placeholder={block.type === 'process_steps' ? '01' : block.type === 'stats_metrics' ? '98%' : '기획 공정'}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">상세 설명 / 답변 본문</label>
                                <textarea
                                  rows={2}
                                  value={item.description || ''}
                                  onChange={(e) => handleUpdateItem(block.id, item.id, 'description', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                />
                              </div>

                              {/* Bullets List */}
                              <div className="sm:col-span-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-semibold text-slate-700">불릿 포인트 요약 목록</label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentBullets = item.bullets || [];
                                      handleUpdateItem(block.id, item.id, 'bullets', [...currentBullets, '새로운 세부 사항']);
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
                                      onChange={(e) => {
                                        const updatedBullets = [...(item.bullets || [])];
                                        updatedBullets[bIdx] = e.target.value;
                                        handleUpdateItem(block.id, item.id, 'bullets', updatedBullets);
                                      }}
                                      className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedBullets = (item.bullets || []).filter((_, idx) => idx !== bIdx);
                                        handleUpdateItem(block.id, item.id, 'bullets', updatedBullets);
                                      }}
                                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Image Attachment */}
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
                                          setActiveUploadTarget({ blockId: block.id, itemId: item.id });
                                          blockImageInputRef.current?.click();
                                        }}
                                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                                      >
                                        이미지 변경
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateItem(block.id, item.id, 'imageUrl', undefined)}
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
                                      setActiveUploadTarget({ blockId: block.id, itemId: item.id });
                                      blockImageInputRef.current?.click();
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
          })
        )}
      </div>
    </div>
  );
};

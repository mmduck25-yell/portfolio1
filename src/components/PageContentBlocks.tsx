import React, { useState } from 'react';
import { 
  PageContentBlock, 
  PageBlockItem 
} from '../types/portfolio';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Settings2,
  ExternalLink,
  ImageIcon,
  ArrowRight
} from 'lucide-react';

interface PageContentBlocksProps {
  pageId: string;
  pageTitle?: string;
  blocks: PageContentBlock[];
  onOpenAdmin?: (tab?: string, targetPageId?: string) => void;
  onDeleteBlock?: (blockId: string) => void;
  onMoveBlock?: (blockId: string, direction: 'up' | 'down') => void;
}

export const PageContentBlocks: React.FC<PageContentBlocksProps> = ({
  pageId,
  pageTitle = '이 페이지',
  blocks,
  onOpenAdmin,
  onDeleteBlock,
  onMoveBlock,
}) => {
  // Filter active blocks belonging to current page
  const pageBlocks = blocks
    .filter((b) => b.pageId === pageId && b.isEnabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Accordion state for FAQ blocks
  const [openFaqItems, setOpenFaqItems] = useState<Record<string, boolean>>({});

  const toggleFaq = (itemId: string) => {
    setOpenFaqItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleDelete = (block: PageContentBlock) => {
    if (window.confirm(`'${block.title}' 내용 섹션을 이 페이지에서 삭제하시겠습니까?`)) {
      if (onDeleteBlock) {
        onDeleteBlock(block.id);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Render each content block */}
      {pageBlocks.map((block, index) => {
        const isFirst = index === 0;
        const isLast = index === pageBlocks.length - 1;

        // Background styling
        const bgClass =
          block.bgColor === 'slate'
            ? 'bg-slate-50/90 border-y border-slate-200/80'
            : block.bgColor === 'sky'
            ? 'bg-sky-50/60 border-y border-sky-100'
            : 'bg-white border-y border-slate-100';

        return (
          <section key={block.id} className={`py-14 sm:py-20 px-4 sm:px-6 relative group ${bgClass}`}>
            <div className="max-w-6xl mx-auto space-y-10">
              
              {/* Content Section Admin Quick Action Bar (Floating or Header) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                    내용 섹션 #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {block.type === 'process_steps' && '프로세스 파이프라인'}
                    {block.type === 'card_grid' && '카드 그리드 쇼케이스'}
                    {block.type === 'faq_accordion' && 'FAQ 아코디언'}
                    {block.type === 'stats_metrics' && '핵심 지표 / 수치'}
                    {block.type === 'text_banner' && '공지 / 텍스트 배너'}
                    {block.type === 'media_gallery' && '미디어 갤러리'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  {/* Reorder Buttons */}
                  {onMoveBlock && (
                    <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-2xs p-0.5">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => onMoveBlock(block.id, 'up')}
                        title="섹션 위로 이동"
                        className={`p-1 rounded cursor-pointer ${
                          isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => onMoveBlock(block.id, 'down')}
                        title="섹션 아래로 이동"
                        className={`p-1 rounded cursor-pointer ${
                          isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Edit in Admin */}
                  {onOpenAdmin && (
                    <button
                      type="button"
                      onClick={() => onOpenAdmin('pageBlocks', pageId)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-2xs cursor-pointer transition-colors"
                      title="관리자 모달에서 이 섹션 내용 편집"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>섹션 편집</span>
                    </button>
                  )}

                  {/* Delete Section */}
                  {onDeleteBlock && (
                    <button
                      type="button"
                      onClick={() => handleDelete(block)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md shadow-2xs cursor-pointer transition-colors"
                      title="이 내용 섹션 완전히 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>섹션 삭제</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Section Header */}
              <div className="space-y-3">
                {block.category && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-sky-600 uppercase bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span>{block.category}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {block.title}
                  </h3>
                  {block.subtitle && (
                    <p className="text-sm sm:text-base font-semibold text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
                {block.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line">
                    {block.description}
                  </p>
                )}
              </div>

              {/* BLOCK TYPE: PROCESS STEPS */}
              {block.type === 'process_steps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {block.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group/step hover:border-sky-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="font-mono text-xl font-black text-sky-500 group-hover/step:text-sky-600 transition-colors">
                            {item.value || `0${idx + 1}`}
                          </span>
                          {item.tag && (
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <p className="text-[11px] font-medium text-slate-400">
                              {item.subtitle}
                            </p>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.bullets && item.bullets.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1" />
                              <span className="leading-snug">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* BLOCK TYPE: CARD GRID */}
              {block.type === 'card_grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {block.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-sky-300 flex flex-col"
                    >
                      {item.imageUrl && (
                        <div className="relative aspect-16/9 bg-slate-100 overflow-hidden border-b border-slate-100">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {item.tag && (
                              <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
                                {item.tag}
                              </span>
                            )}
                            {item.value && (
                              <span className="text-xs font-mono font-bold text-slate-500">
                                {item.value}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h4>

                          {item.subtitle && (
                            <p className="text-xs font-medium text-slate-500">
                              {item.subtitle}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {item.bullets && item.bullets.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            {item.bullets.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{bullet}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.linkUrl && (
                          <div className="pt-2">
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                            >
                              <span>상세 링크 확인</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BLOCK TYPE: FAQ ACCORDION */}
              {block.type === 'faq_accordion' && (
                <div className="space-y-3 max-w-4xl mx-auto">
                  {block.items.map((item, idx) => {
                    const itemId = item.id || `faq_${idx}`;
                    const isOpen = openFaqItems[itemId] ?? (idx === 0);

                    return (
                      <div
                        key={itemId}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-slate-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(itemId)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                              Q
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900">
                                {item.title}
                              </div>
                              {item.tag && (
                                <span className="text-[10px] text-sky-700 font-semibold">
                                  #{item.tag}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-1 rounded-full text-slate-400">
                            {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="p-4 sm:p-5 pt-0 sm:pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/40">
                            <div className="flex items-start gap-3 pt-3">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                                A
                              </div>
                              <div className="space-y-2 flex-1">
                                <p className="whitespace-pre-line">{item.description}</p>
                                {item.bullets && item.bullets.length > 0 && (
                                  <ul className="space-y-1 pt-1 list-disc list-inside text-xs text-slate-500">
                                    {item.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx}>{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BLOCK TYPE: STATS & METRICS */}
              {block.type === 'stats_metrics' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {block.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all text-center space-y-3 hover:border-sky-300"
                    >
                      <div className="text-3xl sm:text-4xl font-black text-sky-600 font-mono tracking-tight">
                        {item.value || `0${idx + 1}`}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs font-semibold text-sky-700">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* BLOCK TYPE: TEXT BANNER */}
              {block.type === 'text_banner' && (
                <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {block.subtitle || block.title}
                    </h4>
                    {block.description && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {block.description}
                      </p>
                    )}
                  </div>

                  {block.items && block.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      {block.items.map((item, idx) => (
                        <div key={item.id || idx} className="bg-sky-50/60 p-4 rounded-xl space-y-1 border border-sky-100">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            <span>{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-600 pl-3.5 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BLOCK TYPE: MEDIA GALLERY */}
              {block.type === 'media_gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {block.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs group/img"
                    >
                      {item.imageUrl ? (
                        <div className="aspect-3/4 bg-slate-100 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-3/4 bg-slate-100 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="p-3 space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </section>
        );
      })}

      {/* Admin Quick Prompt to Add Content Section to Current Page */}
      <div className="py-6 px-4 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-dashed border-slate-200 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>
            이 페이지({pageTitle})에 등록된 추가 내용 섹션:{' '}
            <strong className="text-slate-800 font-mono">{pageBlocks.length}개</strong>
          </span>
        </div>

        {onOpenAdmin && (
          <button
            type="button"
            onClick={() => onOpenAdmin('pageBlocks', pageId)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-sky-600" />
            <span>+ 이 페이지에 새로운 내용 섹션 추가하기</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SiteSection, CustomSectionItem } from '../types/portfolio';
import { PageHeader } from './PageHeader';
import { ExternalLink, ChevronDown, ChevronUp, Calendar, Tag, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

interface CustomSectionProps {
  section: SiteSection;
  onGoHome: () => void;
}

export const CustomSection: React.FC<CustomSectionProps> = ({ section, onGoHome }) => {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const items = section.customItems || [];

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="pb-16">
      <PageHeader
        pageCategory={section.category || 'CUSTOM SECTION'}
        pageTitle={section.title || section.navLabel}
        description={section.description || ''}
        onGoHome={onGoHome}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl max-w-2xl mx-auto px-6">
            <div className="inline-flex p-3 rounded-full bg-sky-50 text-sky-600 mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">등록된 콘텐츠 항목이 없습니다</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              우측 상단의 <strong>Admin</strong> 버튼을 눌러 이 섹션에 새로운 카드, 타임라인 또는 Q&A 항목을 추가해보세요.
            </p>
          </div>
        ) : section.type === 'timeline' ? (
          /* TIMELINE LAYOUT */
          <div className="max-w-3xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-sky-200 space-y-10 py-4">
            {items.map((item, index) => (
              <div key={item.id || index} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-500 shadow-xs group-hover:scale-125 transition-transform" />

                <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    {item.date && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    )}
                    {item.tag && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                  {item.subtitle && (
                    <div className="text-sm font-medium text-sky-600 mb-3">{item.subtitle}</div>
                  )}

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                    {item.description}
                  </p>

                  {item.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedImage(item.imageUrl || null)}
                      />
                    </div>
                  )}

                  {item.bullets && item.bullets.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      {item.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.linkUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                      >
                        <span>관련 링크 바로가기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : section.type === 'faq' ? (
          /* FAQ ACCORDION LAYOUT */
          <div className="max-w-3xl mx-auto space-y-4">
            {items.map((item, index) => {
              const isExpanded = expandedFaqId === item.id;
              return (
                <div
                  key={item.id || index}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full flex items-center justify-between text-left p-5 sm:p-6 cursor-pointer bg-white hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 pr-4">
                      <span className="font-mono text-sm sm:text-base font-bold text-sky-600 shrink-0">
                        Q{index + 1}.
                      </span>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-slate-900">
                          {item.title}
                        </div>
                        {item.tag && (
                          <span className="inline-block mt-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-slate-50/60 border-t border-slate-100 text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 animate-in fade-in duration-150">
                      <p className="whitespace-pre-line">{item.description}</p>

                      {item.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full max-h-80 object-cover cursor-pointer"
                            onClick={() => setSelectedImage(item.imageUrl || null)}
                          />
                        </div>
                      )}

                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline pt-2"
                        >
                          <span>참고 자료 링크</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* DEFAULT: RICH CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image Cover */}
                {item.imageUrl ? (
                  <div className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(item.imageUrl || null)}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs border border-white/40">
                        {item.tag}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-4 pb-0 flex items-center justify-between">
                    {item.tag ? (
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                        {item.tag}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">#0{index + 1}</span>
                    )}
                    {item.date && (
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {item.imageUrl && item.date && (
                      <div className="text-xs text-slate-400 font-medium mb-1">{item.date}</div>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs font-semibold text-sky-600 mb-3">{item.subtitle}</div>
                    )}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                      {item.description}
                    </p>

                    {item.bullets && item.bullets.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5 mb-4">
                        {item.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.linkUrl && (
                    <div className="pt-3 border-t border-slate-100">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                      >
                        <span>자세히 보기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <img src={selectedImage} alt="확대 이미지" className="max-h-[85vh] w-auto object-contain mx-auto rounded-lg" />
            <div className="text-center text-xs text-slate-400 py-2">클릭하여 닫기</div>
          </div>
        </div>
      )}
    </div>
  );
};

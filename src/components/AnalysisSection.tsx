import React, { useState } from 'react';
import { BookOpen, Layers, BarChart3, Quote, ChevronRight, CheckCircle2 } from 'lucide-react';
import { WebtoonAnalysis } from '../types/portfolio';

interface AnalysisSectionProps {
  analyses: WebtoonAnalysis[];
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analyses }) => {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(analyses[0]?.id || 'ana_academy');

  const currentAnalysis = analyses.find((a) => a.id === selectedAnalysisId) || analyses[0];

  return (
    <section id="analysis" className="py-16 lg:py-24 border-b border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Reports Status Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="text-xs font-mono text-slate-500">
            분석 대상 작품을 클릭하면 하단에 상세 각색·연출·상업성 분석서가 열립니다.
          </div>
          <div className="text-xs font-mono text-sky-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs whitespace-nowrap">
            {analyses.length} IN-DEPTH COMMERCIAL REPORTS
          </div>
        </div>

        {/* 3 Report Selector Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyses.map((report, idx) => {
            const isSelected = report.id === selectedAnalysisId;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedAnalysisId(report.id)}
                className={`text-left p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/40 border-sky-400 shadow-md ring-2 ring-sky-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-3">
                    <span className="text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded">REPORT 0{idx + 1}</span>
                    <span className="font-medium text-slate-600">{report.genre}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug">
                    〈{report.originalWork}〉
                  </h3>
                  <div className="text-xs text-slate-600 font-medium mb-3">
                    {report.title}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {report.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-sky-600' : 'text-slate-500'}>
                    분석서 전문 열람
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-sky-600' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Full Report View */}
        {currentAnalysis && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 space-y-8 shadow-sm">
            
            {/* Report Header */}
            <div className="border-b border-slate-200 pb-6 space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
                <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded">{currentAnalysis.platform}</span>
                <span>/</span>
                <span className="text-slate-700 font-medium">장르: {currentAnalysis.genre}</span>
                <span>/</span>
                <span className="text-slate-900 font-semibold">대상작: 〈{currentAnalysis.originalWork}〉</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {currentAnalysis.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {currentAnalysis.summary}
              </p>
            </div>

            {/* 3 Core Analytical Dimensions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Dimension 1: Pacing & Cut Rhythm */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>회차별 씬 페이스 & 컷 분할 분석</span>
                </div>
                <div className="space-y-4">
                  {currentAnalysis.pacingAnalysis.map((item, pIdx) => (
                    <div key={pIdx} className="space-y-1.5 text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0" />
                        <span>{item.topic}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-3">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension 2: Visual Mood & Mise-en-scène */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>시각적 무드 & 미장센 기획</span>
                </div>
                <div className="space-y-4">
                  {currentAnalysis.visualMoodStrategy.map((item, vIdx) => (
                    <div key={vIdx} className="space-y-1.5 text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0" />
                        <span>{item.topic}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-3">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension 3: Commercial Structure & Audience Appeal */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  <span>타겟 독자층 & 상업적 스토리텔링</span>
                </div>
                <div className="space-y-4">
                  {currentAnalysis.commercialStructure.map((item, cIdx) => (
                    <div key={cIdx} className="space-y-1.5 text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0" />
                        <span>{item.topic}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-3">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PD Key Takeaway Quote Box */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-6 relative shadow-2xs">
              <Quote className="w-8 h-8 text-sky-200 absolute top-4 right-4 pointer-events-none" />
              <div className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold mb-2">
                PD INSIGHT & ACTIONABLE TAKEAWAY
              </div>
              <blockquote className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed italic">
                "{currentAnalysis.keyTakeaway}"
              </blockquote>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

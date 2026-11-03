import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NavPage } from '../types/portfolio';

interface PageNavigationProps {
  prevPage?: { page: NavPage; label: string };
  nextPage?: { page: NavPage; label: string };
  onNavigate: (page: NavPage) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  prevPage,
  nextPage,
  onNavigate,
}) => {
  return (
    <div className="border-t border-slate-200 bg-slate-50/80 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevPage ? (
            <button
              onClick={() => {
                onNavigate(prevPage.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2.5 px-5 py-3 rounded-lg border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/50 text-xs text-slate-700 hover:text-sky-700 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-sky-500" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-mono">이전 페이지</div>
                <div className="font-semibold text-slate-900">{prevPage.label}</div>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextPage && (
            <button
              onClick={() => {
                onNavigate(nextPage.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2.5 px-5 py-3 rounded-lg border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/50 text-xs text-slate-700 hover:text-sky-700 transition-all cursor-pointer shadow-xs"
            >
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">다음 페이지</div>
                <div className="font-semibold text-slate-900">{nextPage.label}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

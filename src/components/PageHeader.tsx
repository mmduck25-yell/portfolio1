import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  pageTitle: string;
  pageCategory: string;
  description: string;
  onGoHome: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  pageTitle,
  pageCategory,
  description,
  onGoHome,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white pt-10 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <button
            onClick={onGoHome}
            className="hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-sky-600 font-semibold uppercase">{pageCategory}</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

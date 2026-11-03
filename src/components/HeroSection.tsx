import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, Check, Copy, MessageSquare } from 'lucide-react';
import { ProfileData, NavPage, SectionHeaderConfig } from '../types/portfolio';

interface HeroSectionProps {
  profile: ProfileData;
  headerConfig?: SectionHeaderConfig;
  onNavigate: (page: NavPage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, headerConfig, onNavigate }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="relative bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Typographic Hero: Clean Focused Editorial Layout ending at Contact */}
        <div className="max-w-4xl space-y-6">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full w-fit">
            <span className="h-2 w-2 bg-sky-500 rounded-full animate-pulse"></span>
            <span>{headerConfig?.category || 'Webtoon Producer & Director Portfolio'}</span>
          </div>

          {/* Core Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight lg:leading-[1.2] text-balance">
            {profile.coreCopy}
          </h1>

          {/* Career Summary */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
            {profile.careerSummary}
          </p>

          {/* Contact Details (Email & Phone with Copy Buttons & Direct Link) */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
              <Mail className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="select-all font-mono text-xs font-medium">{profile.email}</span>
              <button
                onClick={() => copyToClipboard(profile.email, 'email')}
                title="이메일 복사"
                className="text-slate-400 hover:text-sky-600 ml-1 p-0.5 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="select-all font-mono text-xs font-medium">{profile.phone}</span>
              <button
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                title="전화번호 복사"
                className="text-slate-400 hover:text-sky-600 ml-1 p-0.5 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>상세 연락처 & 문의 제안서 →</span>
            </button>
          </div>

          {/* Action Navigation CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors rounded-lg shadow-sm cursor-pointer"
            >
              <span>팀 프로젝트 사례 보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 hover:text-sky-700 border border-slate-300 hover:border-sky-300 transition-colors rounded-lg bg-white shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>연락처 및 협업 문의</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

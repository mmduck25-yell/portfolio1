import React, { useState } from 'react';
import { Mail, Phone, Clock, MessageSquare, Send, Check, Copy, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { ProfileData, SectionHeaderConfig } from '../types/portfolio';
import { PageHeader } from './PageHeader';

interface ContactPageProps {
  profile: ProfileData;
  headerConfig?: SectionHeaderConfig;
  onGoHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile, headerConfig, onGoHome }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  // Interactive Inquiry Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    studio: '',
    projectType: '노블코믹스 각색 기획',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('성함, 이메일, 문의 내용을 모두 입력해주세요.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <PageHeader
        pageCategory={headerConfig?.category || "GET IN TOUCH & PARTNERSHIP"}
        pageTitle={headerConfig?.title || "웹툰 PD 연락처 및 협업 제안"}
        description={headerConfig?.description || "상업 노블코믹스 각색, 오리지널 웹툰 스토리보드 디렉팅, 제작 공정 파이프라인 정합 및 신작 프로젝트 프로듀싱 문의 창구입니다."}
        onGoHome={onGoHome}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 5 cols: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-sky-600 font-bold uppercase">DIRECT COMMUNICATION</span>
              <h2 className="text-xl font-bold text-slate-900">직접 문의 채널</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                급한 회차 마감 조율 또는 즉각적인 미팅 제안은 전화 및 이메일로 연락 부탁드립니다.
              </p>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <strong>이메일 (Direct Email)</strong>
                </span>
                <span className="text-sky-600">상시 수신</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-base sm:text-lg font-bold font-mono text-slate-900 hover:text-sky-600 transition-colors"
                >
                  {profile.email}
                </a>
                <button
                  onClick={() => copyToClipboard(profile.email, 'email')}
                  title="이메일 복사"
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-sky-300 text-slate-500 hover:text-sky-600 cursor-pointer transition-colors bg-slate-50"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <strong>연락처 전화번호</strong>
                </span>
                <span className="text-sky-600">유선/문자</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`tel:${profile.phone}`}
                  className="text-base sm:text-lg font-bold font-mono text-slate-900 hover:text-sky-600 transition-colors"
                >
                  {profile.phone}
                </a>
                <button
                  onClick={() => copyToClipboard(profile.phone, 'phone')}
                  title="전화번호 복사"
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-sky-300 text-slate-500 hover:text-sky-600 cursor-pointer transition-colors bg-slate-50"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-sky-600" />
                <strong>업무 및 피드백 가능 시간</strong>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {profile.contactHours}
              </p>
            </div>

            {/* Collaboration Notice */}
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>협업 및 제안 안내</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {profile.collaborationNotice}
              </p>
            </div>

          </div>

          {/* Right 7 cols: Interactive Collaboration Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono text-sky-600 font-bold uppercase">PROJECT INQUIRY FORM</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  신작 기획 및 프로듀싱 제안서 보내기
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  웹소설 원작 정보, 기획안 또는 작화 협업 제안 내용을 남겨주시면 확인 후 신속히 회신드립니다.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 bg-sky-50/50 rounded-xl border border-sky-200 p-6">
                  <div className="inline-flex p-3 rounded-full bg-sky-100 text-sky-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900">문의가 성공적으로 전달되었습니다!</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      보내주신 내용({formState.projectType})을 검토한 후, 기재해주신 이메일(<strong>{formState.email}</strong>)로 연락드리겠습니다.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormState({ name: '', email: '', studio: '', projectType: '노블코믹스 각색 기획', message: '' });
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 hover:border-sky-400 text-slate-700 rounded-lg cursor-pointer"
                  >
                    추가 문의 작성하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">성함 / 담당자명 *</label>
                      <input
                        type="text"
                        required
                        placeholder="예: 홍길동"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">회신받으실 이메일 주소 *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@studio.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">소속 스튜디오 / 출판사 / 레이블</label>
                      <input
                        type="text"
                        placeholder="예: 웹툰 스튜디오 / 에이전시"
                        value={formState.studio}
                        onChange={(e) => setFormState({ ...formState, studio: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">문의 및 협업 유형</label>
                      <select
                        value={formState.projectType}
                        onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white text-xs cursor-pointer"
                      >
                        <option value="노블코믹스 각색 기획">노블코믹스 각색 기획 및 트리트먼트</option>
                        <option value="세로 스크롤 콘티 연출">세로 스크롤 콘티 제작 및 시선 흐름 감수</option>
                        <option value="제작 공정 파이프라인 관리">제작 파이프라인 구축 및 마감 공정 관리</option>
                        <option value="웹툰 상업 분석 및 기획안">상업 웹툰 타겟 분석 및 런칭 기획 자문</option>
                        <option value="기타 협업 문의">기타 협업 및 채용 제안</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">문의 내용 (원작 정보, 일정, 상세 요구사항) *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="프로젝트 개요, 원작 소설 링크, 희망 런칭 일정 및 PD 롤에 대해 자유롭게 작성해주세요."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>문의 제안서 발송하기</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* 4-Step Production Partnership Roadmap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs font-mono text-sky-600 font-bold uppercase">WORKFLOW & ENGAGEMENT</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              웹툰 PD 프로젝트 협업 진행 프로세스
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono text-sky-600 font-bold">STEP 01</div>
              <div className="font-bold text-slate-900 text-sm">원작 검토 & 타겟층 분석</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                웹소설 원작 텍스트 및 시놉시스를 정독하고, 주요 독자 페르소나 및 각색 코어를 도출합니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono text-sky-600 font-bold">STEP 02</div>
              <div className="font-bold text-slate-900 text-sm">세로 콘티 & 씬 페이스 설계</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                스마트폰 세로 스크롤에 맞춘 컷 분할, Eye-level 탈피 앵글 및 회차별 후킹 컷을 확정합니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono text-sky-600 font-bold">STEP 03</div>
              <div className="font-bold text-slate-900 text-sm">3D 배경 & 작화 파이프라인 정합</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                스케치업 3D 투시 가이드 및 2000px/300dpi 원고 마스터링 표준을 구축하여 작화 이질감을 제거합니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono text-sky-600 font-bold">STEP 04</div>
              <div className="font-bold text-slate-900 text-sm">세이브 원고 관리 & 상업 런칭</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                15화 이상의 안정적인 런칭 세이브 원고를 확보하고, 플랫폼 MD 피드백 및 프로모션을 조율합니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

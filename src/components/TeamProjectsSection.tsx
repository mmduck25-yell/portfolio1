import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, X, ChevronRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { TeamProject } from '../types/portfolio';

interface TeamProjectsSectionProps {
  projects: TeamProject[];
}

export const TeamProjectsSection: React.FC<TeamProjectsSectionProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<TeamProject | null>(null);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  return (
    <section id="team-projects" className="py-16 lg:py-24 border-b border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Status Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="text-xs font-mono text-slate-500">
            실무 협업 프로젝트 포트폴리오 (<span className="text-sky-600 font-bold">{projects.length}개 작품</span>)
          </div>
          <div className="text-xs font-mono text-sky-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            TOTAL {projects.length} FEATURED PRODUCTIONS
          </div>
        </div>

        {/* Projects List */}
        <div className="mt-12 space-y-16">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:border-sky-300 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
                
                {/* Left 7 Cols: Project Information & Problem Solving */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
                    <span className="text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded">PROJECT #{idx + 1}</span>
                    <span>/</span>
                    <span className="font-medium text-slate-700">{project.genre}</span>
                    <span>/</span>
                    <span>{project.period}</span>
                    <span>/</span>
                    <span className="text-slate-600">{project.platform}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">{project.subtitle}</p>
                  </div>

                  {/* Role & Contribution Rate Progress */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        담당 업무: <strong className="text-slate-900">{project.role}</strong>
                      </span>
                      <span className="font-mono text-sky-600 font-bold tabular-nums">
                        기여도 {project.contributionPercent}%
                      </span>
                    </div>

                    {/* Sky Blue Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full transition-all duration-500"
                        style={{ width: `${project.contributionPercent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                      {project.roleDetails.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2">
                          <span className="text-sky-500 mt-0.5 font-bold">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Problem & Solution Box */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-sky-600" />
                      <span>핵심 문제 해결 (Issue & Resolution Process)</span>
                    </div>

                    <div className="space-y-3">
                      {project.problemsAndSolutions.map((item, pIdx) => (
                        <div
                          key={pIdx}
                          className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs shadow-2xs"
                        >
                          <div className="flex items-start gap-2 text-slate-700 font-medium">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-900">문제점: </strong>
                              <span>{item.issue}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-slate-700 pl-6">
                            <div>
                              <strong className="text-sky-700">해결 방안: </strong>
                              <span>{item.solution}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-slate-600 pl-6 pt-1.5 border-t border-slate-100">
                            <div>
                              <strong className="text-slate-900">성과 도출: </strong>
                              <span className="text-slate-700 font-medium">{item.outcome}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="text-xs font-mono text-slate-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 Cols: Thumbnail & High-res Preview Cuts */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div
                    onClick={() => setActiveProject(project)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-xs"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5">
                        대표 원고 컷 확대 보기
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/95 backdrop-blur-xs rounded-lg text-[11px] text-slate-700 flex items-center justify-between shadow-xs">
                      <span className="font-medium text-slate-900">대표 콘티/작화 씬</span>
                      <span className="font-mono text-sky-600 font-semibold">클릭하여 전체 뷰어 열기</span>
                    </div>
                  </div>

                  {/* Preview Cut Strip */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 font-medium">
                      원고 상세 컷 ({project.previewCuts.length}장)
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {project.previewCuts.map((cut, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => setSelectedImageModal(cut)}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs cursor-pointer"
                        >
                          <img
                            src={cut}
                            alt={`${project.title} 컷 ${cIdx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 text-[10px] text-white font-medium">
                            확대 보기
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveProject(project)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 hover:text-sky-600 bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>프로젝트 상세 리포트 및 원고 감수 내역 보기</span>
                    <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 my-8 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto webtoon-scroll">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-sky-600 font-bold mb-1">
                  PRODUCTION DOSSIER · {activeProject.genre}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {activeProject.title}
                </h3>
                <p className="text-slate-600 text-sm mt-1">{activeProject.subtitle}</p>
              </div>

              {/* Large Image Showcase */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={activeProject.thumbnail}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[460px] object-cover"
                />
              </div>

              {/* All Preview Cuts Gallery */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  원고 상세 컷 갤러리 ({activeProject.previewCuts.length}장)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeProject.previewCuts.map((cut, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs"
                      onClick={() => setSelectedImageModal(cut)}
                    >
                      <img
                        src={cut}
                        alt={`원고 컷 ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium">
                        확대
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  프로젝트 개요 및 기획 의도
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Role & Contributions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  웹툰 PD 수행 롤 & 기여도 ({activeProject.contributionPercent}%)
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {activeProject.roleDetails.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Problem Solving Full Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  공정 관리 중 발생 이슈 및 해결 프로세스
                </h4>
                <div className="space-y-3">
                  {activeProject.problemsAndSolutions.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                      <div className="text-slate-800">
                        <strong className="text-slate-900">발생 이슈: </strong>
                        {item.issue}
                      </div>
                      <div className="text-slate-800">
                        <strong className="text-sky-700">PD 대응 및 조율: </strong>
                        {item.solution}
                      </div>
                      <div className="text-slate-600 border-t border-slate-200 pt-1.5">
                        <strong className="text-slate-900">최종 결과: </strong>
                        {item.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Image Lightbox */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 cursor-zoom-out backdrop-blur-xs"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImageModal}
              alt="원고 상세 확대"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-10 right-0 text-white text-xs font-mono uppercase bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700 cursor-pointer"
            >
              닫기 (ESC)
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

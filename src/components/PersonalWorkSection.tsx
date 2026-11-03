import React, { useState } from 'react';
import { Smartphone, Layers, Clapperboard, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { PersonalWork } from '../types/portfolio';

interface PersonalWorkSectionProps {
  works: PersonalWork[];
}

export const PersonalWorkSection: React.FC<PersonalWorkSectionProps> = ({ works }) => {
  const [activeTab, setActiveTab] = useState<'scroll_storyboard' | 'composite' | 'genre_mood'>('scroll_storyboard');
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(0);

  const currentWork = works.find((w) => w.type === activeTab) || works[0];

  // Combine single storyboardImage and multiple storyboardImages into an array
  const scrollImages: string[] = currentWork.storyboardImages && currentWork.storyboardImages.length > 0
    ? currentWork.storyboardImages
    : (currentWork.storyboardImage ? [currentWork.storyboardImage] : []);

  return (
    <section id="personal-work" className="py-16 lg:py-24 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Category Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div className="text-xs font-mono text-slate-500">
            직무 역량별 시뮬레이션 포트폴리오
          </div>

          {/* Interactive Category Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('scroll_storyboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'scroll_storyboard'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>세로 스크롤 콘티</span>
            </button>

            <button
              onClick={() => setActiveTab('composite')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'composite'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>배경·인물 합성</span>
            </button>

            <button
              onClick={() => setActiveTab('genre_mood')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'genre_mood'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>장르별 씬 연출</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Vertical Scroll Storyboard */}
        {activeTab === 'scroll_storyboard' && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 cols: Script Text & Directing Intent */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-sky-600 font-bold uppercase">
                  DIRECTOR'S BLUEPRINT · SCRIPT TO SCROLL
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  텍스트 대본의 모바일 컷 분할 & 스크롤 호흡 설계
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  활자로만 작성된 소설 및 각색 시나리오를 읽고 독자가 스마트폰 뷰어에서 
                  느끼는 체감 속도(Pacing)와 서스펜스를 유도하도록 직접 스케치한 콘티입니다.
                </p>
              </div>

              {/* Text Script Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>기획 원문 대본 (Script Excerpt)</span>
                  </div>
                  <span className="font-mono text-sky-600">SCENE #04</span>
                </div>
                <pre className="text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed select-text bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  {currentWork.scriptText}
                </pre>
              </div>

              {/* Storyboard Key Principles */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PD's Visual Directing Points (콘티 연출 주안점)
                </div>
                <div className="space-y-2.5">
                  {currentWork.techniques?.map((tech, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 6 cols: Smartphone Vertical Scroll Simulator */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-sm">
                
                {/* Simulator Header Indicator */}
                <div className="mb-3 text-center">
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    스마트폰 뷰어 시뮬레이션 ({scrollImages.length}장 컷 연출)
                  </span>
                </div>

                {/* Smartphone Device Mockup */}
                <div className="relative mx-auto rounded-[40px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden ring-4 ring-slate-200">
                  {/* Speaker & Sensor Notch */}
                  <div className="absolute top-2 inset-x-0 mx-auto w-28 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
                    <div className="w-10 h-1 bg-slate-950 rounded-full" />
                  </div>

                  {/* Scrollable Screen Canvas */}
                  <div className="h-[540px] overflow-y-auto webtoon-scroll pt-8 pb-12 bg-white text-slate-900 select-none">
                    {/* Header bar within reader */}
                    <div className="px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 mb-3 bg-slate-50">
                      <span className="font-semibold text-slate-800">EP. 04 · 긴박한 추격전</span>
                      <span className="font-mono text-sky-600 font-bold">{scrollImages.length} 컷 로드됨</span>
                    </div>

                    {/* Scrollable Storyboard Image Sequence */}
                    <div className="px-3 space-y-4">
                      <div className="text-center text-[11px] text-slate-400 font-mono py-1 border-y border-slate-100">
                        ↓ 마우스 휠이나 터치로 스크롤하여 호흡을 확인하세요
                      </div>

                      {scrollImages.map((imgSrc, imgIdx) => (
                        <div key={imgIdx} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs">
                          <img
                            src={imgSrc}
                            alt={`세로 스크롤 콘티 원고 ${imgIdx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full object-contain"
                          />
                        </div>
                      ))}

                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-slate-700 space-y-1">
                        <div className="font-bold text-sky-800">PD 연출 의도 체크:</div>
                        <p className="leading-relaxed">
                          골목길의 폐쇄감을 위해 컷 간격을 좁히다가, 하늘이 내려다보는 컷에서 
                          갑작스러운 300px 여백을 부여하여 독자의 시선이 정지하도록 유도함.
                        </p>
                      </div>

                      <div className="text-center text-[10px] text-slate-400 font-mono py-4">
                        — SCENE 04 CUT END —
                      </div>
                    </div>
                  </div>

                  {/* Bottom Home indicator inside phone */}
                  <div className="absolute bottom-2 inset-x-0 mx-auto w-32 h-1 bg-slate-700 rounded-full z-20" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Resource Compositing */}
        {activeTab === 'composite' && (
          <div className="mt-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left 7 cols: Composite Image */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md relative">
                  <img
                    src={currentWork.storyboardImage}
                    alt="배경 합성 결과물"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-sky-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                    FINAL COMPOSITE CUT
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Layer Pipeline Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-sky-600 font-bold uppercase">
                  RESOURCE INTEGRATION PIPELINE
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  3D 에셋과 2D 작화의 이질감 제거 공정
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  스케치업 3D 배경의 투시와 원근감을 인물 작화와 정합시키고, 
                  단계별 필터링과 광원 톤 매핑을 통해 완성도 높은 상업 작화 씬을 완성합니다.
                </p>

                <div className="space-y-3 pt-2">
                  {currentWork.compositeLayers?.map((layer, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{layer.name}</span>
                        <span className="text-[10px] font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-semibold">
                          {layer.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{layer.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Genre Visual Mood */}
        {activeTab === 'genre_mood' && (
          <div className="mt-12 space-y-8">
            {/* Genre Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              {currentWork.genreScenes?.map((scene, sIdx) => (
                <button
                  key={scene.genre}
                  onClick={() => setSelectedGenreIndex(sIdx)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedGenreIndex === sIdx
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
                  }`}
                >
                  {scene.genre}
                </button>
              ))}
            </div>

            {/* Selected Genre Card Display */}
            {currentWork.genreScenes && currentWork.genreScenes[selectedGenreIndex] && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono text-sky-600 font-bold uppercase">
                      GENRE DIRECTING DOSSIER
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {currentWork.genreScenes[selectedGenreIndex].genre} 연출 가이드
                    </h3>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    MOOD: <strong className="text-slate-800">{currentWork.genreScenes[selectedGenreIndex].mood}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Camera & Angle Guide */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Clapperboard className="w-4 h-4 text-sky-600" />
                      <span>카메라 앵글 및 스크롤 워킹 원칙</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {currentWork.genreScenes[selectedGenreIndex].cameraGuide}
                    </p>
                  </div>

                  {/* Lighting & Tone Keywords */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>핵심 조명 및 톤 매핑 키워드</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentWork.genreScenes[selectedGenreIndex].lightingKeywords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-xs font-mono bg-sky-50 border border-sky-200 text-sky-800 font-semibold px-2.5 py-1 rounded-md"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Practical Direction Description */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    PD 씬 연출 상세 기획 의도
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentWork.genreScenes[selectedGenreIndex].description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

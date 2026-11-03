import React, { useState, useRef } from 'react';
import { X, Lock, KeyRound, Save, RotateCcw, Download, Upload, Check, AlertCircle, ImagePlus, Trash2, Camera, Plus } from 'lucide-react';
import { PortfolioStore } from '../types/portfolio';
import { compressAndReadFile, readMultipleImages } from '../utils/imageUpload';
import { SectionManager } from './SectionManager';
import { PageBlockManager } from './PageBlockManager';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioStore;
  onSave: (newData: PortfolioStore) => void;
  onReset: () => void;
  initialTab?: 'sections' | 'pageBlocks' | 'profile' | 'headers' | 'projects' | 'personal' | 'analyses';
  initialPageId?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
  initialTab = 'sections',
  initialPageId,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Editable local state
  const [formData, setFormData] = useState<PortfolioStore>(data);
  const [activeTab, setActiveTab] = useState<'sections' | 'pageBlocks' | 'profile' | 'headers' | 'projects' | 'personal' | 'analyses'>(initialTab);
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(initialPageId);

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const projectThumbInputRef = useRef<HTMLInputElement>(null);
  const projectCutsInputRef = useRef<HTMLInputElement>(null);
  const personalCutsInputRef = useRef<HTMLInputElement>(null);

  const [activeProjectIdForCuts, setActiveProjectIdForCuts] = useState<string | null>(null);
  const [activeProjectIdForThumb, setActiveProjectIdForThumb] = useState<string | null>(null);
  const [activeWorkIdForCuts, setActiveWorkIdForCuts] = useState<string | null>(null);

  // Sync formData when data prop changes
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialPageId) setSelectedPageId(initialPageId);
  }, [initialTab, initialPageId, isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '8989') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSaveAll = () => {
    onSave(formData);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 2500);
  };

  // Project Thumbnail Upload
  const handleProjectThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProjectIdForThumb) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1400, 0.85);
      const updated = formData.teamProjects.map((p) =>
        p.id === activeProjectIdForThumb ? { ...p, thumbnail: dataUrl } : p
      );
      setFormData({ ...formData, teamProjects: updated });
    } catch (err) {
      alert('썸네일 이미지를 불러오는데 실패했습니다.');
    }
  };

  // Project Multi-Cuts Upload
  const handleProjectMultipleCuts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeProjectIdForCuts) return;
    try {
      const dataUrls = await readMultipleImages(files);
      const updated = formData.teamProjects.map((p) => {
        if (p.id === activeProjectIdForCuts) {
          return { ...p, previewCuts: [...p.previewCuts, ...dataUrls] };
        }
        return p;
      });
      setFormData({ ...formData, teamProjects: updated });
    } catch (err) {
      alert('원고 이미지를 불러오는데 실패했습니다.');
    } finally {
      if (projectCutsInputRef.current) projectCutsInputRef.current.value = '';
    }
  };

  // Remove Cut from Project
  const handleRemoveProjectCut = (projectId: string, cutIndex: number) => {
    const updated = formData.teamProjects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          previewCuts: p.previewCuts.filter((_, idx) => idx !== cutIndex),
        };
      }
      return p;
    });
    setFormData({ ...formData, teamProjects: updated });
  };

  // Personal Work Multi-Cuts Upload
  const handlePersonalMultipleCuts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeWorkIdForCuts) return;
    try {
      const dataUrls = await readMultipleImages(files);
      const updated = formData.personalWorks.map((w) => {
        if (w.id === activeWorkIdForCuts) {
          const currentList = w.storyboardImages && w.storyboardImages.length > 0
            ? w.storyboardImages
            : (w.storyboardImage ? [w.storyboardImage] : []);
          return {
            ...w,
            storyboardImages: [...currentList, ...dataUrls],
          };
        }
        return w;
      });
      setFormData({ ...formData, personalWorks: updated });
    } catch (err) {
      alert('콘티 이미지를 불러오는데 실패했습니다.');
    } finally {
      if (personalCutsInputRef.current) personalCutsInputRef.current.value = '';
    }
  };

  // Remove Personal Work Cut
  const handleRemovePersonalCut = (workId: string, cutIndex: number) => {
    const updated = formData.personalWorks.map((w) => {
      if (w.id === workId) {
        const currentList = w.storyboardImages && w.storyboardImages.length > 0
          ? w.storyboardImages
          : (w.storyboardImage ? [w.storyboardImage] : []);
        return {
          ...w,
          storyboardImages: currentList.filter((_, idx) => idx !== cutIndex),
        };
      }
      return w;
    });
    setFormData({ ...formData, personalWorks: updated });
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'webtoon_pd_portfolio_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.teamProjects) {
          const merged = {
            ...formData,
            ...parsed,
            sectionHeaders: {
              ...formData.sectionHeaders,
              ...(parsed.sectionHeaders || {}),
            },
            sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
              ? parsed.sections
              : formData.sections,
            pageBlocks: Array.isArray(parsed.pageBlocks) && parsed.pageBlocks.length > 0
              ? parsed.pageBlocks
              : formData.pageBlocks,
          };
          setFormData(merged);
          onSave(merged);
          alert('포트폴리오 데이터를 성공적으로 불러왔습니다.');
        } else {
          alert('유효하지 않은 포트폴리오 JSON 형식입니다.');
        }
      } catch (err) {
        alert('JSON 파싱에 실패했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-900 max-h-[92vh] overflow-y-auto webtoon-scroll">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={projectThumbInputRef}
          accept="image/*"
          onChange={handleProjectThumbFile}
          className="hidden"
        />
        <input
          type="file"
          ref={projectCutsInputRef}
          multiple
          accept="image/*"
          onChange={handleProjectMultipleCuts}
          className="hidden"
        />
        <input
          type="file"
          ref={personalCutsInputRef}
          multiple
          accept="image/*"
          onChange={handlePersonalMultipleCuts}
          className="hidden"
        />

        {/* Not Authenticated: Password Screen (NO PASSWORD REVEALED) */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">관리자 인증 (Admin Access)</h3>
              <p className="text-xs text-slate-500">
                포트폴리오의 모든 텍스트와 이미지 수정을 위해 관리자 비밀번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-700">비밀번호</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-500 focus:bg-white font-mono"
                    autoFocus
                  />
                </div>
                {passwordError && (
                  <div className="text-xs text-red-500 flex items-center gap-1 pt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>비밀번호가 올바르지 않습니다. 다시 시도해주세요.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard: Full CMS for all texts & images */
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-sky-600 font-bold">ADMIN CONTROL PANEL</div>
                <h3 className="text-xl font-bold text-slate-900">홈페이지 전체 콘텐츠 & 이미지 CMS</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {saveSuccessNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>저장 완료!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>전체 변경사항 저장</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeTab === 'sections'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>전체 메뉴 관리 (추가 / 삭제)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === 'sections' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
                }`}>
                  {formData.sections?.length || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pageBlocks')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeTab === 'pageBlocks'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>페이지 내 내용 섹션 (추가 / 삭제)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === 'pageBlocks' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
                }`}>
                  {formData.pageBlocks?.length || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'profile'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                기본 프로필 & 연락처
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'headers'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                메뉴별 섹션 제목 관리
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'projects'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                팀 프로젝트 & 원고 이미지 ({formData.teamProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'personal'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                개인 콘티 & 여러 컷 업로드
              </button>
              <button
                onClick={() => setActiveTab('analyses')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'analyses'
                    ? 'bg-sky-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                상업 분석 리포트 ({formData.analyses.length})
              </button>
            </div>

            {/* Tab 0: Section Management (Add, Delete, Order, Content) */}
            {activeTab === 'sections' && (
              <SectionManager
                sections={formData.sections || []}
                onChangeSections={(newSections) => setFormData({ ...formData, sections: newSections })}
                sectionHeaders={formData.sectionHeaders}
                onChangeSectionHeaders={(newHeaders) => setFormData({ ...formData, sectionHeaders: newHeaders })}
              />
            )}

            {/* Tab 0.5: Page Content Blocks Manager (Add, Delete, Order, Subsections within any Page) */}
            {activeTab === 'pageBlocks' && (
              <PageBlockManager
                sections={formData.sections || []}
                pageBlocks={formData.pageBlocks || []}
                onChangePageBlocks={(newBlocks) => setFormData({ ...formData, pageBlocks: newBlocks })}
                selectedPageId={selectedPageId}
              />
            )}

            {/* Tab 1: Profile & Home Metrics & Contact (NO LOCATION) */}
            {activeTab === 'profile' && (
              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">PD 성명</label>
                    <input
                      type="text"
                      value={formData.profile.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, name: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">영문 표기</label>
                    <input
                      type="text"
                      value={formData.profile.englishName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, englishName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">이메일 주소</label>
                    <input
                      type="email"
                      value={formData.profile.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, email: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">연락처 전화번호</label>
                    <input
                      type="text"
                      value={formData.profile.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, phone: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">
                    홈 메인 핵심 카피 (Headline)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.profile.coreCopy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, coreCopy: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">
                    직무 키워드 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={formData.profile.keywords.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">소개글 요약 (Career Summary)</label>
                  <textarea
                    rows={3}
                    value={formData.profile.careerSummary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, careerSummary: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Contact Page specific texts */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-xs">연락처 전용 페이지 문구 설정</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">피드백 및 업무 가능 시간</label>
                      <input
                        type="text"
                        value={formData.profile.contactHours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: { ...formData.profile, contactHours: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">협업 제안 환영 안내문</label>
                      <input
                        type="text"
                        value={formData.profile.collaborationNotice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile: { ...formData.profile, collaborationNotice: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Home KPI Metrics Edit */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 text-xs">메인 홈 핵심 지표 스트립 4종 수정</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.profile.metrics && formData.profile.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
                        <span className="font-mono text-sky-600 font-bold text-[11px]">지표 #{mIdx + 1}</span>
                        <input
                          type="text"
                          placeholder="수치 (예: 100%)"
                          value={metric.value}
                          onChange={(e) => {
                            const updatedMetrics = [...formData.profile.metrics];
                            updatedMetrics[mIdx].value = e.target.value;
                            setFormData({
                              ...formData,
                              profile: { ...formData.profile, metrics: updatedMetrics },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-xs font-mono font-bold"
                        />
                        <input
                          type="text"
                          placeholder="라벨 (예: 주간 연재 마감 준수)"
                          value={metric.label}
                          onChange={(e) => {
                            const updatedMetrics = [...formData.profile.metrics];
                            updatedMetrics[mIdx].label = e.target.value;
                            setFormData({
                              ...formData,
                              profile: { ...formData.profile, metrics: updatedMetrics },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="부제목 (예: 18화 사전 비축)"
                          value={metric.sub}
                          onChange={(e) => {
                            const updatedMetrics = [...formData.profile.metrics];
                            updatedMetrics[mIdx].sub = e.target.value;
                            setFormData({
                              ...formData,
                              profile: { ...formData.profile, metrics: updatedMetrics },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Menu Page Section Headers Edit */}
            {activeTab === 'headers' && (
              <div className="space-y-6 text-xs">
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 space-y-1">
                  <div className="font-bold text-sky-900 text-sm">각 메뉴 페이지 섹션 제목 및 설명 관리</div>
                  <p className="text-slate-600 leading-relaxed">
                    팀 프로젝트, 개인 작업 & 콘티, 상업 작품 분석, 연락처 페이지 상단에 표시되는 대제목, 영문 카테고리(서브헤더), 페이지 요약 설명을 수정할 수 있습니다.
                  </p>
                </div>

                {/* Section 0: Main Home Header */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">0. 메인 홈 상단 헤더 & 카피 (Home)</span>
                    <span className="font-mono text-sky-600 font-semibold text-[11px]">HOME PAGE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">상단 키커 뱃지 (Kicker Badge)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.home?.category || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              home: {
                                ...(formData.sectionHeaders?.home || { category: '', title: '', description: '' }),
                                category: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">서브 슬로건 (Sub Slogan)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.home?.description || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              home: {
                                ...(formData.sectionHeaders?.home || { category: '', title: '', description: '' }),
                                description: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 1: Team Projects Header */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">1. 팀 프로젝트 페이지 제목 (Team Projects)</span>
                    <span className="font-mono text-sky-600 font-semibold text-[11px]">PROJECTS PAGE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">대제목 (Page Title)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.projects?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              projects: {
                                ...(formData.sectionHeaders?.projects || { category: '', title: '', description: '' }),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">영문 카테고리 (Category / Breadcrumb)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.projects?.category || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              projects: {
                                ...(formData.sectionHeaders?.projects || { category: '', title: '', description: '' }),
                                category: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">페이지 요약 설명 (Description)</label>
                    <textarea
                      rows={2}
                      value={formData.sectionHeaders?.projects?.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sectionHeaders: {
                            ...formData.sectionHeaders,
                            projects: {
                              ...(formData.sectionHeaders?.projects || { category: '', title: '', description: '' }),
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 2: Personal Work Header */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">2. 개인 작업 & 콘티 페이지 제목 (Personal Work)</span>
                    <span className="font-mono text-sky-600 font-semibold text-[11px]">PERSONAL WORK PAGE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">대제목 (Page Title)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.personal?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              personal: {
                                ...(formData.sectionHeaders?.personal || { category: '', title: '', description: '' }),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">영문 카테고리 (Category / Breadcrumb)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.personal?.category || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              personal: {
                                ...(formData.sectionHeaders?.personal || { category: '', title: '', description: '' }),
                                category: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">페이지 요약 설명 (Description)</label>
                    <textarea
                      rows={2}
                      value={formData.sectionHeaders?.personal?.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sectionHeaders: {
                            ...formData.sectionHeaders,
                            personal: {
                              ...(formData.sectionHeaders?.personal || { category: '', title: '', description: '' }),
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 3: Commercial Analysis Header */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">3. 상업 작품 분석 리포트 페이지 제목 (Analysis)</span>
                    <span className="font-mono text-sky-600 font-semibold text-[11px]">ANALYSIS PAGE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">대제목 (Page Title)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.analysis?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              analysis: {
                                ...(formData.sectionHeaders?.analysis || { category: '', title: '', description: '' }),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">영문 카테고리 (Category / Breadcrumb)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.analysis?.category || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              analysis: {
                                ...(formData.sectionHeaders?.analysis || { category: '', title: '', description: '' }),
                                category: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">페이지 요약 설명 (Description)</label>
                    <textarea
                      rows={2}
                      value={formData.sectionHeaders?.analysis?.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sectionHeaders: {
                            ...formData.sectionHeaders,
                            analysis: {
                              ...(formData.sectionHeaders?.analysis || { category: '', title: '', description: '' }),
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 4: Contact Page Header */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm">4. 연락처 및 협업 제안 페이지 제목 (Contact)</span>
                    <span className="font-mono text-sky-600 font-semibold text-[11px]">CONTACT PAGE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">대제목 (Page Title)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.contact?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              contact: {
                                ...(formData.sectionHeaders?.contact || { category: '', title: '', description: '' }),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-semibold">영문 카테고리 (Category / Breadcrumb)</label>
                      <input
                        type="text"
                        value={formData.sectionHeaders?.contact?.category || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sectionHeaders: {
                              ...formData.sectionHeaders,
                              contact: {
                                ...(formData.sectionHeaders?.contact || { category: '', title: '', description: '' }),
                                category: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-semibold">페이지 요약 설명 (Description)</label>
                    <textarea
                      rows={2}
                      value={formData.sectionHeaders?.contact?.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sectionHeaders: {
                            ...formData.sectionHeaders,
                            contact: {
                              ...(formData.sectionHeaders?.contact || { category: '', title: '', description: '' }),
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Team Projects & Multi-image upload */}
            {activeTab === 'projects' && (
              <div className="space-y-8 text-xs">
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 space-y-1">
                  <div className="font-bold text-sky-900 text-sm">실무 협업 프로젝트 (Team Projects) 전체 내용 편집</div>
                  <p className="text-slate-600 leading-relaxed">
                    작품 메인 제목(예: 아카데미 수호자의 귀환), 장르 및 키워드(예: 판타지 / 아카데미 / 액션), 부제목, 기여도, 담당 롤, 개요, 세부 업무, 이슈 해결 과정, 성과 지표 및 첨부 원고 이미지를 모두 수정할 수 있습니다.
                  </p>
                </div>

                {formData.teamProjects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-5">
                    {/* Project Header Status Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-600 font-bold bg-sky-50 border border-sky-200 px-2.5 py-1 rounded">
                          PROJECT #{pIdx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-base">
                          {proj.title}
                        </span>
                        <span className="text-slate-500 text-xs">({proj.genre})</span>
                      </div>
                      <span className="font-mono text-sky-600 font-bold bg-white px-2.5 py-1 rounded border border-slate-200">
                        기여도 {proj.contributionPercent}%
                      </span>
                    </div>

                    {/* 1. Main Titles (Main text as highlighted by user) */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span>메인 텍스트 및 기본 정보 (프로젝트명 & 장르)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">
                            프로젝트 메인 제목 <span className="text-sky-600 font-normal">(예: 아카데미 수호자의 귀환)</span>
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].title = e.target.value;
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-bold text-sm focus:bg-white focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">
                            장르 및 분류 키워드 <span className="text-sky-600 font-normal">(예: 판타지 / 아카데미 / 액션)</span>
                          </label>
                          <input
                            type="text"
                            value={proj.genre}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].genre = e.target.value;
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-medium text-xs focus:bg-white focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">
                          프로젝트 부제목 (서브 카피)
                        </label>
                        <input
                          type="text"
                          value={proj.subtitle}
                          onChange={(e) => {
                            const updated = [...formData.teamProjects];
                            updated[pIdx].subtitle = e.target.value;
                            setFormData({ ...formData, teamProjects: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg focus:bg-white focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* 2. Production Specs & Role */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span>담당 롤, 기여도 및 연재 환경</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">기여도 (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={proj.contributionPercent}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].contributionPercent = Number(e.target.value);
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">연재 플랫폼 / 마스터 규격</label>
                          <input
                            type="text"
                            value={proj.platform}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].platform = e.target.value;
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">참여 기간</label>
                          <input
                            type="text"
                            value={proj.period}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].period = e.target.value;
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">담당 업무 및 롤 요약</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => {
                            const updated = [...formData.teamProjects];
                            updated[pIdx].role = e.target.value;
                            setFormData({ ...formData, teamProjects: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">프로젝트 개요 상세 설명</label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...formData.teamProjects];
                            updated[pIdx].description = e.target.value;
                            setFormData({ ...formData, teamProjects: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* 3. Detailed Role Bullets (Role Details) */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                        <span>담당 세부 업무 목록 (Role Details - {proj.roleDetails.length}항목)</span>
                      </div>

                      <div className="space-y-2">
                        {proj.roleDetails.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2">
                            <span className="font-mono text-sky-600 font-bold text-xs shrink-0">•</span>
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => {
                                const updated = [...formData.teamProjects];
                                updated[pIdx].roleDetails[dIdx] = e.target.value;
                                setFormData({ ...formData, teamProjects: updated });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Problems and Solutions (Issue & Resolution Process) */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                        <span>핵심 문제 해결 기록 (Issue & Resolution Process)</span>
                      </div>

                      <div className="space-y-4">
                        {proj.problemsAndSolutions.map((ps, psIdx) => (
                          <div key={psIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                            <span className="font-bold text-sky-700 text-xs">
                              문제 해결 케이스 #{psIdx + 1}
                            </span>
                            
                            <div>
                              <label className="text-slate-600 block mb-1 text-[11px] font-semibold">발생 이슈 (Risk / Problem)</label>
                              <textarea
                                rows={2}
                                value={ps.issue}
                                onChange={(e) => {
                                  const updated = [...formData.teamProjects];
                                  updated[pIdx].problemsAndSolutions[psIdx].issue = e.target.value;
                                  setFormData({ ...formData, teamProjects: updated });
                                }}
                                className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="text-slate-600 block mb-1 text-[11px] font-semibold">해결 방안 (PD Resolution / Direction)</label>
                              <textarea
                                rows={2}
                                value={ps.solution}
                                onChange={(e) => {
                                  const updated = [...formData.teamProjects];
                                  updated[pIdx].problemsAndSolutions[psIdx].solution = e.target.value;
                                  setFormData({ ...formData, teamProjects: updated });
                                }}
                                className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="text-slate-600 block mb-1 text-[11px] font-semibold">결과 및 성과 (Outcome)</label>
                              <textarea
                                rows={2}
                                value={ps.outcome}
                                onChange={(e) => {
                                  const updated = [...formData.teamProjects];
                                  updated[pIdx].problemsAndSolutions[psIdx].outcome = e.target.value;
                                  setFormData({ ...formData, teamProjects: updated });
                                }}
                                className="w-full bg-white border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg font-medium"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. Metrics Badges */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="font-bold text-slate-800 text-xs">
                        성과 및 핵심 지표 배지 (Metrics - {proj.metrics.length}종)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {proj.metrics.map((m, mIdx) => (
                          <input
                            key={mIdx}
                            type="text"
                            value={m}
                            onChange={(e) => {
                              const updated = [...formData.teamProjects];
                              updated[pIdx].metrics[mIdx] = e.target.value;
                              setFormData({ ...formData, teamProjects: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs"
                          />
                        ))}
                      </div>
                    </div>

                    {/* 6. Image Attachment Section (Thumbnail + Multiple Cuts from PC) */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-800 text-xs block">
                            대표 썸네일 및 첨부 원고 컷 ({proj.previewCuts.length}장 첨부됨)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            내 컴퓨터에서 이미지를 선택하여 여러 장을 자유롭게 추가하거나 삭제할 수 있습니다.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProjectIdForThumb(proj.id);
                              projectThumbInputRef.current?.click();
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5 text-sky-600" />
                            <span>썸네일 변경</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveProjectIdForCuts(proj.id);
                              projectCutsInputRef.current?.click();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          >
                            <ImagePlus className="w-3.5 h-3.5" />
                            <span>내 컴퓨터에서 여러 장 추가</span>
                          </button>
                        </div>
                      </div>

                      {/* Cut Thumbnails List with Delete Button */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                        {proj.previewCuts.map((cutSrc, cIdx) => (
                          <div key={cIdx} className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={cutSrc} alt="컷" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveProjectCut(proj.id, cIdx)}
                              title="삭제"
                              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-500 hover:text-white text-slate-700 rounded transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Personal Works & Storyboard Multi-Cuts Upload */}
            {activeTab === 'personal' && (
              <div className="space-y-8 text-xs">
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 space-y-1">
                  <div className="font-bold text-sky-900 text-sm">개인 작업 및 세로 콘티 (Personal Work) 전체 텍스트 편집</div>
                  <p className="text-slate-600 leading-relaxed">
                    세로 스크롤 콘티, 배경/인물 합성 레이어, 장르별 씬 연출의 제목, 부제목, 상세 설명, 대본 텍스트 및 연출 원칙을 모두 수정할 수 있습니다.
                  </p>
                </div>

                {formData.personalWorks.map((work, wIdx) => {
                  const workCuts = work.storyboardImages && work.storyboardImages.length > 0
                    ? work.storyboardImages
                    : (work.storyboardImage ? [work.storyboardImage] : []);

                  return (
                    <div key={work.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sky-600 font-bold bg-sky-50 border border-sky-200 px-2.5 py-1 rounded">
                            WORK #{wIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-base">{work.title}</span>
                        </div>
                        <span className="text-xs text-sky-600 font-mono font-bold uppercase bg-white border border-slate-200 px-2.5 py-1 rounded">
                          {work.type}
                        </span>
                      </div>

                      {/* Main Titles */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">작업 제목 (Title)</label>
                            <input
                              type="text"
                              value={work.title}
                              onChange={(e) => {
                                const updated = [...formData.personalWorks];
                                updated[wIdx].title = e.target.value;
                                setFormData({ ...formData, personalWorks: updated });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">부제목 (Subtitle)</label>
                            <input
                              type="text"
                              value={work.subtitle}
                              onChange={(e) => {
                                const updated = [...formData.personalWorks];
                                updated[wIdx].subtitle = e.target.value;
                                setFormData({ ...formData, personalWorks: updated });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">작업 개요 설명 (Description)</label>
                          <textarea
                            rows={3}
                            value={work.description}
                            onChange={(e) => {
                              const updated = [...formData.personalWorks];
                              updated[wIdx].description = e.target.value;
                              setFormData({ ...formData, personalWorks: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Type 1: Scroll Storyboard Specifics */}
                      {work.type === 'scroll_storyboard' && (
                        <>
                          {/* Script Text */}
                          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                            <label className="text-slate-700 font-semibold block">텍스트 대본 내용 (Script Text)</label>
                            <textarea
                              rows={5}
                              value={work.scriptText || ''}
                              onChange={(e) => {
                                const updated = [...formData.personalWorks];
                                updated[wIdx].scriptText = e.target.value;
                                setFormData({ ...formData, personalWorks: updated });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono text-xs leading-relaxed"
                            />
                          </div>

                          {/* Directing Techniques */}
                          {work.techniques && (
                            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                              <label className="text-slate-700 font-semibold block">핵심 연출 기법 3종 (Directing Principles)</label>
                              <div className="space-y-2">
                                {work.techniques.map((tech, tIdx) => (
                                  <input
                                    key={tIdx}
                                    type="text"
                                    value={tech}
                                    onChange={(e) => {
                                      const updated = [...formData.personalWorks];
                                      if (updated[wIdx].techniques) {
                                        updated[wIdx].techniques![tIdx] = e.target.value;
                                        setFormData({ ...formData, personalWorks: updated });
                                      }
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Storyboard Multiple Images Upload */}
                          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-800">
                                  스마트폰 뷰어 콘티 이미지 ({workCuts.length}장 컷 등록됨)
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  내 컴퓨터에서 여러 장을 선택하면 모바일 스크롤 시뮬레이터에 순서대로 배치됩니다.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveWorkIdForCuts(work.id);
                                  personalCutsInputRef.current?.click();
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
                              >
                                <ImagePlus className="w-3.5 h-3.5" />
                                <span>내 컴퓨터에서 여러 장 추가</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                              {workCuts.map((cutSrc, idx) => (
                                <div key={idx} className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                  <img src={cutSrc} alt={`콘티 컷 ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePersonalCut(work.id, idx)}
                                    title="삭제"
                                    className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-500 hover:text-white text-slate-700 rounded transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Type 2: Composite Layers */}
                      {work.type === 'composite' && work.compositeLayers && (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                          <label className="text-slate-700 font-semibold block">합성 4단계 레이어 명칭 및 설명</label>
                          <div className="space-y-3">
                            {work.compositeLayers.map((layer, lIdx) => (
                              <div key={lIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={layer.name}
                                  placeholder="레이어 명"
                                  onChange={(e) => {
                                    const updated = [...formData.personalWorks];
                                    if (updated[wIdx].compositeLayers) {
                                      updated[wIdx].compositeLayers![lIdx].name = e.target.value;
                                      setFormData({ ...formData, personalWorks: updated });
                                    }
                                  }}
                                  className="bg-white border border-slate-200 px-2.5 py-1.5 rounded font-bold"
                                />
                                <input
                                  type="text"
                                  value={layer.tag}
                                  placeholder="태그"
                                  onChange={(e) => {
                                    const updated = [...formData.personalWorks];
                                    if (updated[wIdx].compositeLayers) {
                                      updated[wIdx].compositeLayers![lIdx].tag = e.target.value;
                                      setFormData({ ...formData, personalWorks: updated });
                                    }
                                  }}
                                  className="bg-white border border-slate-200 px-2.5 py-1.5 rounded font-mono text-sky-600"
                                />
                                <input
                                  type="text"
                                  value={layer.description}
                                  placeholder="설명"
                                  onChange={(e) => {
                                    const updated = [...formData.personalWorks];
                                    if (updated[wIdx].compositeLayers) {
                                      updated[wIdx].compositeLayers![lIdx].description = e.target.value;
                                      setFormData({ ...formData, personalWorks: updated });
                                    }
                                  }}
                                  className="bg-white border border-slate-200 px-2.5 py-1.5 rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Type 3: Genre Scenes */}
                      {work.type === 'genre_mood' && work.genreScenes && (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                          <label className="text-slate-700 font-semibold block">장르별 씬 연출 기획안 (학원물, 사이버펑크, 로맨스 판타지)</label>
                          <div className="space-y-3">
                            {work.genreScenes.map((scene, sIdx) => (
                              <div key={sIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={scene.genre}
                                    onChange={(e) => {
                                      const updated = [...formData.personalWorks];
                                      if (updated[wIdx].genreScenes) {
                                        updated[wIdx].genreScenes![sIdx].genre = e.target.value;
                                        setFormData({ ...formData, personalWorks: updated });
                                      }
                                    }}
                                    className="bg-white border border-slate-200 px-2.5 py-1.5 rounded font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={scene.mood}
                                    onChange={(e) => {
                                      const updated = [...formData.personalWorks];
                                      if (updated[wIdx].genreScenes) {
                                        updated[wIdx].genreScenes![sIdx].mood = e.target.value;
                                        setFormData({ ...formData, personalWorks: updated });
                                      }
                                    }}
                                    className="bg-white border border-slate-200 px-2.5 py-1.5 rounded font-medium text-sky-700"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={scene.cameraGuide}
                                  placeholder="카메라 화각 가이드"
                                  onChange={(e) => {
                                    const updated = [...formData.personalWorks];
                                    if (updated[wIdx].genreScenes) {
                                      updated[wIdx].genreScenes![sIdx].cameraGuide = e.target.value;
                                      setFormData({ ...formData, personalWorks: updated });
                                    }
                                  }}
                                  className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded font-mono text-xs"
                                />
                                <textarea
                                  rows={2}
                                  value={scene.description}
                                  placeholder="연출 상세 설명"
                                  onChange={(e) => {
                                    const updated = [...formData.personalWorks];
                                    if (updated[wIdx].genreScenes) {
                                      updated[wIdx].genreScenes![sIdx].description = e.target.value;
                                      setFormData({ ...formData, personalWorks: updated });
                                    }
                                  }}
                                  className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 5: Commercial Analyses */}
            {activeTab === 'analyses' && (
              <div className="space-y-8 text-xs">
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 space-y-1">
                  <div className="font-bold text-sky-900 text-sm">상업 웹툰 분석 리포트 (Analysis) 전체 텍스트 편집</div>
                  <p className="text-slate-600 leading-relaxed">
                    〈아카데미에서 살아남기〉, 〈시든 꽃에 눈물을〉, 〈연상녀클럽〉/〈샤MONEY즘〉의 원작명, 장르, 연재 플랫폼, 리포트 제목, 요약문, PD 결론 및 세부 분석 항목을 모두 수정할 수 있습니다.
                  </p>
                </div>

                {formData.analyses.map((ana, aIdx) => (
                  <div key={ana.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-600 font-bold bg-sky-50 border border-sky-200 px-2.5 py-1 rounded">
                          REPORT 0{aIdx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-base">
                          〈{ana.originalWork}〉
                        </span>
                        <span className="text-slate-500 text-xs">({ana.genre})</span>
                      </div>
                    </div>

                    {/* Main Work Info */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">
                            원작 웹소설 / 대상작 <span className="text-sky-600 font-normal">(예: 아카데미에서 살아남기)</span>
                          </label>
                          <input
                            type="text"
                            value={ana.originalWork}
                            onChange={(e) => {
                              const updated = [...formData.analyses];
                              updated[aIdx].originalWork = e.target.value;
                              setFormData({ ...formData, analyses: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">장르 및 각색 유형</label>
                          <input
                            type="text"
                            value={ana.genre}
                            onChange={(e) => {
                              const updated = [...formData.analyses];
                              updated[aIdx].genre = e.target.value;
                              setFormData({ ...formData, analyses: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">연재 플랫폼</label>
                          <input
                            type="text"
                            value={ana.platform}
                            onChange={(e) => {
                              const updated = [...formData.analyses];
                              updated[aIdx].platform = e.target.value;
                              setFormData({ ...formData, analyses: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">리포트 메인 제목</label>
                        <input
                          type="text"
                          value={ana.title}
                          onChange={(e) => {
                            const updated = [...formData.analyses];
                            updated[aIdx].title = e.target.value;
                            setFormData({ ...formData, analyses: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">분석 요약 (Summary)</label>
                        <textarea
                          rows={3}
                          value={ana.summary}
                          onChange={(e) => {
                            const updated = [...formData.analyses];
                            updated[aIdx].summary = e.target.value;
                            setFormData({ ...formData, analyses: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">PD 핵심 결론 (Key Takeaway)</label>
                        <textarea
                          rows={2}
                          value={ana.keyTakeaway}
                          onChange={(e) => {
                            const updated = [...formData.analyses];
                            updated[aIdx].keyTakeaway = e.target.value;
                            setFormData({ ...formData, analyses: updated });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg font-medium leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Detailed Analysis Breakdown (Pacing, Visual Mood, Commercial Structure) */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4">
                      <div className="font-bold text-slate-800 text-xs">
                        심층 분석 세부 항목 (각색 방식, 시각적 무드, 상업성)
                      </div>

                      {/* 1. Pacing Analysis */}
                      {ana.pacingAnalysis && ana.pacingAnalysis.length > 0 && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                          <span className="font-bold text-sky-700">1. 각색 방식 및 씬 페이스 조절 분석</span>
                          {ana.pacingAnalysis.map((pItem, pIdx) => (
                            <div key={pIdx} className="space-y-1">
                              <input
                                type="text"
                                value={pItem.topic}
                                placeholder="소주제"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].pacingAnalysis[pIdx].topic = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={pItem.details}
                                placeholder="상세 분석 내용"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].pacingAnalysis[pIdx].details = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 2. Visual Mood Strategy */}
                      {ana.visualMoodStrategy && ana.visualMoodStrategy.length > 0 && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                          <span className="font-bold text-sky-700">2. 시각적 무드 및 연출 기획 분석</span>
                          {ana.visualMoodStrategy.map((vItem, vIdx) => (
                            <div key={vIdx} className="space-y-1">
                              <input
                                type="text"
                                value={vItem.topic}
                                placeholder="소주제"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].visualMoodStrategy[vIdx].topic = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={vItem.details}
                                placeholder="상세 분석 내용"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].visualMoodStrategy[vIdx].details = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. Commercial Structure */}
                      {ana.commercialStructure && ana.commercialStructure.length > 0 && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                          <span className="font-bold text-sky-700">3. 상업적 스토리텔링 구조 및 타겟팅 분석</span>
                          {ana.commercialStructure.map((cItem, cIdx) => (
                            <div key={cIdx} className="space-y-1">
                              <input
                                type="text"
                                value={cItem.topic}
                                placeholder="소주제"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].commercialStructure[cIdx].topic = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={cItem.details}
                                placeholder="상세 분석 내용"
                                onChange={(e) => {
                                  const updated = [...formData.analyses];
                                  updated[aIdx].commercialStructure[cIdx].details = e.target.value;
                                  setFormData({ ...formData, analyses: updated });
                                }}
                                className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions: Backup, Reset, Export */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>백업 다운로드 (JSON)</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>JSON 불러오기</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('모든 데이터를 최초 기본값으로 초기화하시겠습니까?')) {
                      onReset();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기본 데이터로 초기화</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

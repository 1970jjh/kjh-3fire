
import React, { useEffect, useState } from 'react';
import { SimulationState, UserProfile } from '../types';
import { SCENARIO_DETAILS, STEPS, getImagesForTeam } from '../constants';
import { FiveWhys, LogicTreeInput } from './AnalysisTools';
import { 
  AlertCircle, FileText, CheckSquare, TrendingUp, 
  Info, Lightbulb, MessageSquare, FileWarning, Play, Siren, ArrowRight, FolderOpen, X, ZoomIn, Check
} from 'lucide-react';

interface SimulationContainerProps {
  state: SimulationState;
  updateState: (newState: Partial<SimulationState>) => void;
  userProfile?: UserProfile;
  totalTeams: number; 
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({ state, updateState, userProfile, totalTeams }) => {
  const { currentStep, data } = state;
  const currentStepInfo = STEPS.find(s => s.id === currentStep);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Siren Effect & TTS Hook
  useEffect(() => {
    if (currentStep === 'intro') {
      let osc: OscillatorNode | null = null;
      let lfo: OscillatorNode | null = null;
      let ctx: AudioContext | null = null;

      const playSiren = () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          
          ctx = new AudioContext();
          osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sawtooth';
          gain.gain.value = 0.02; // Volume reduced

          // Siren effect: LFO
          lfo = ctx.createOscillator();
          lfo.type = 'triangle';
          lfo.frequency.value = 0.8; 
          
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 400; 
          
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          osc.frequency.value = 600; 

          osc.start();
          lfo.start();
        } catch (e) {
          console.error("Audio playback failed", e);
        }
      };

      const playAnnouncement = () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel previous
          const msg = new SpeechSynthesisUtterance();
          msg.text = "긴급 속보입니다. 제3공장에서 원인 미상의 화재가 발생했습니다. 현재 인명 피해와 생산 차질이 우려되는 상황입니다. 문제해결 팀은 즉시 현장 정보를 확인하고 대응책을 수립해주시기 바랍니다.";
          msg.lang = 'ko-KR';
          msg.rate = 1.1;
          msg.pitch = 1.0;
          msg.volume = 1.0;
          window.speechSynthesis.speak(msg);
        }
      };

      playSiren();
      // Delay TTS slightly to let siren start
      setTimeout(playAnnouncement, 1000);

      return () => {
        try {
          if (osc) osc.stop();
          if (lfo) lfo.stop();
          if (ctx) ctx.close();
          window.speechSynthesis.cancel();
        } catch(e) { /* ignore cleanup errors */ }
      };
    }
  }, [currentStep]);

  // Helper to render the Step Guide Box
  const StepGuide = () => {
    if (!currentStepInfo || currentStep === 'intro' || currentStep === 'report') return null;
    return (
      <div className="bg-slate-800 text-white p-4 rounded-xl mb-6 shadow-md mx-auto max-w-lg text-center">
        <div className="flex flex-col items-center gap-2">
          <Lightbulb className="text-yellow-400" size={24} />
          <div>
            <h4 className="font-bold text-sm text-yellow-400 mb-1">Step Goal: {currentStepInfo.goal}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{currentStepInfo.guide}</p>
          </div>
        </div>
      </div>
    );
  };

  // Helper to render Context Data (Interviews, Reports)
  const ContextCards = () => {
    if (!currentStepInfo?.contextData) return null;
    return (
      <div className="mb-6 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
          <Info size={14}/> 참고 자료 (Context Data)
        </h4>
        <div className="flex flex-col gap-3">
          {currentStepInfo.contextData.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border-l-4 text-sm shadow-sm ${
              item.type === 'interview' ? 'bg-blue-50 border-blue-400' :
              item.type === 'report' ? 'bg-slate-100 border-slate-500' :
              'bg-orange-50 border-orange-400'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2 font-bold opacity-80">
                {item.type === 'interview' && <MessageSquare size={16} />}
                {item.type === 'report' && <FileText size={16} />}
                {item.type === 'email' && <FileWarning size={16} />}
                <span>{item.source}</span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-center">"{item.content}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIntro = () => {
    return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-4 bg-slate-900 relative overflow-hidden">
      {/* Background Image: Industrial Complex */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&q=80&w=1600" 
            alt="Industrial Complex"
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6">
        
        <div className="animate-pulse mb-8">
            <div className="bg-red-600 text-white text-lg md:text-xl font-black px-6 py-2 rounded-full inline-flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <Siren className="animate-spin-slow" /> NEWS 속보
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2 drop-shadow-2xl tracking-tight font-noto">
            제3공장<br/>
            <span className="text-red-500">화재사고 발생</span>
        </h1>
        
        <p className="text-slate-300 mt-4 text-sm md:text-base font-medium">
             {SCENARIO_DETAILS.date} | 긴급 상황
        </p>

        {userProfile && (
            <div className="mt-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-600">
                <p className="text-slate-300 text-sm">
                    참여: <span className="text-white font-bold">{userProfile.groupName}</span> | 
                    <span className="text-white font-bold ml-1">제{userProfile.teamId}조 {userProfile.name}</span>
                </p>
            </div>
        )}

      </div>

      {/* Bottom Button Area */}
      <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
        <button 
            onClick={() => setShowInfoCard(true)}
            className="w-full bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-bounce-subtle border-b-4 border-red-800"
        >
            화재사고 문제해결 시작 <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
  };

  const renderFactFinding = () => (
    <div className="space-y-4 md:space-y-6 text-center">
      <StepGuide />
      <ContextCards />

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-base md:text-lg mb-4 flex items-center justify-center gap-2">
            <FileText className="text-slate-500" /> 수집된 정보 (Facts)
        </h3>
        <p className="text-xs text-slate-500 mb-4">위의 참고 자료와 <strong>수령한 정보 카드</strong>를 바탕으로 확인된 사실만 기록하세요.</p>
        
        {/* Button to re-open Info Cards */}
        <button 
            onClick={() => setShowInfoCard(true)}
            className="mb-6 w-full py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
            <FolderOpen size={18} /> 우리 조 정보 카드 다시보기
        </button>

        <div className="space-y-3">
        {data.facts.map((fact, idx) => (
          <div key={idx} className="flex gap-2 items-start">
             <span className="bg-slate-100 text-slate-500 font-bold px-2 py-2 rounded text-xs md:text-sm w-8 text-center flex-shrink-0 mt-0.5">{idx + 1}</span>
             <div className="flex-1 relative">
                <textarea 
                    value={fact}
                    onChange={(e) => {
                        const newFacts = [...data.facts];
                        newFacts[idx] = e.target.value;
                        updateState({ data: { ...data, facts: newFacts } });
                    }}
                    className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none overflow-hidden min-h-[50px] text-left"
                    placeholder="팩트를 입력하세요..."
                    rows={2}
                />
                <button 
                    onClick={() => {
                        const newFacts = data.facts.filter((_, i) => i !== idx);
                        updateState({ data: { ...data, facts: newFacts } });
                    }}
                    className="absolute right-2 top-2 text-slate-300 hover:text-red-500 p-1 bg-white rounded-full"
                >
                    ×
                </button>
             </div>
          </div>
        ))}
        </div>
        <button 
            onClick={() => updateState({ data: { ...data, facts: [...data.facts, ''] } })}
            className="mt-4 w-full py-3 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
        >
            + 새로운 사실(Fact) 추가
        </button>
      </div>
    </div>
  );

  const renderProblemDefinition = () => (
    <div className="space-y-6">
        <StepGuide />
        <ContextCards />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl border-t-4 border-red-500 shadow-sm text-center">
                <h3 className="font-bold text-base md:text-lg mb-2 text-slate-800">1. 인명 사고 문제 정의</h3>
                <p className="text-xs md:text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded">
                    <strong>Tip:</strong> 사고 발생 사실(Fact)과 안전해야 할 기준(Standard) 사이의 차이를 기술하세요.
                </p>
                <textarea 
                    className="w-full h-32 md:h-40 p-3 text-sm border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-red-500 outline-none text-left"
                    placeholder="예: 안전 수칙을 준수해야 하는 작업 환경에서, 과부하 점검 중 화상 사고 발생..."
                    value={data.problemDefinition.humanIssue}
                    onChange={(e) => updateState({ 
                        data: { ...data, problemDefinition: { ...data.problemDefinition, humanIssue: e.target.value } } 
                    })}
                />
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl border-t-4 border-orange-500 shadow-sm text-center">
                <h3 className="font-bold text-base md:text-lg mb-2 text-slate-800">2. 생산/납기 문제 정의</h3>
                <p className="text-xs md:text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded">
                    <strong>Tip:</strong> 납기일(8/12)까지 필요한 목표 수량과 현재 예상되는 부족분을 수치로 표현하세요.
                </p>
                <textarea 
                    className="w-full h-32 md:h-40 p-3 text-sm border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 outline-none text-left"
                    placeholder="예: 8월 12일 납기까지 4,000 unit 생산 부족 예상..."
                    value={data.problemDefinition.productionIssue}
                    onChange={(e) => updateState({ 
                        data: { ...data, problemDefinition: { ...data.problemDefinition, productionIssue: e.target.value } } 
                    })}
                />
            </div>
        </div>
    </div>
  );

  const renderRootCause = () => (
    <div className="space-y-6 md:space-y-8">
        <StepGuide />
        <ContextCards />

        <FiveWhys 
            whys={data.rootCause.whys} 
            onChange={(idx, val) => {
                const newWhys = [...data.rootCause.whys];
                newWhys[idx] = val;
                updateState({ data: { ...data, rootCause: { ...data.rootCause, whys: newWhys } } });
            }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <LogicTreeInput 
                title="직접/근본 원인 (Direct Cause)"
                colorClass="bg-red-50 border-red-100"
                placeholder="예: 전력 사용량 초과 (16,500W)"
                items={data.rootCause.directCauses}
                onAdd={() => updateState({ data: { ...data, rootCause: { ...data.rootCause, directCauses: [...data.rootCause.directCauses, ''] } } })}
                onRemove={(idx) => {
                    const next = data.rootCause.directCauses.filter((_, i) => i !== idx);
                    updateState({ data: { ...data, rootCause: { ...data.rootCause, directCauses: next } } });
                }}
                onChange={(idx, val) => {
                    const next = [...data.rootCause.directCauses];
                    next[idx] = val;
                    updateState({ data: { ...data, rootCause: { ...data.rootCause, directCauses: next } } });
                }}
            />
            <LogicTreeInput 
                title="영향 요인 (Contributing Factors)"
                colorClass="bg-orange-50 border-orange-100"
                placeholder="예: 소화기 미작동, 출구 목재 적재"
                items={data.rootCause.indirectCauses}
                onAdd={() => updateState({ data: { ...data, rootCause: { ...data.rootCause, indirectCauses: [...data.rootCause.indirectCauses, ''] } } })}
                onRemove={(idx) => {
                    const next = data.rootCause.indirectCauses.filter((_, i) => i !== idx);
                    updateState({ data: { ...data, rootCause: { ...data.rootCause, indirectCauses: next } } });
                }}
                onChange={(idx, val) => {
                    const next = [...data.rootCause.indirectCauses];
                    next[idx] = val;
                    updateState({ data: { ...data, rootCause: { ...data.rootCause, indirectCauses: next } } });
                }}
            />
        </div>
    </div>
  );

  const renderSolution = () => (
    <div className="space-y-6">
        <StepGuide />

        <div className="bg-green-50 p-4 md:p-6 rounded-xl border border-green-100 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="bg-green-100 p-2 rounded-full text-green-700 hidden md:block">
                <TrendingUp size={24} />
            </div>
            <div>
                <h3 className="font-bold text-green-900 mb-1 flex items-center justify-center md:justify-start gap-2">
                    <TrendingUp className="md:hidden" size={20}/>
                    Upstream (업스트림) 전략이란?
                </h3>
                <p className="text-green-800 text-sm leading-relaxed">
                    문제가 발생한 후 수습하는 'Downstream' 방식에서 벗어나, 문제의 근원을 찾아 사전에 예방하는 'Upstream' 방식으로 접근해야 합니다.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <LogicTreeInput 
                title="1. 즉각적인 해결 및 처리 (Downstream)"
                colorClass="bg-white border-slate-200 shadow-sm"
                placeholder="예: 산재 처리, 타 공장 생산 활용"
                items={data.solutions.immediate}
                onAdd={() => updateState({ data: { ...data, solutions: { ...data.solutions, immediate: [...data.solutions.immediate, ''] } } })}
                onRemove={(idx) => {
                    const next = data.solutions.immediate.filter((_, i) => i !== idx);
                    updateState({ data: { ...data, solutions: { ...data.solutions, immediate: next } } });
                }}
                onChange={(idx, val) => {
                    const next = [...data.solutions.immediate];
                    next[idx] = val;
                    updateState({ data: { ...data, solutions: { ...data.solutions, immediate: next } } });
                }}
            />
             <LogicTreeInput 
                title="2. 재발 방지 및 예방 (Upstream)"
                colorClass="bg-indigo-50 border-indigo-100 shadow-sm"
                placeholder="예: 설비 증설, 안전 프로세스 개선"
                items={data.solutions.prevention}
                onAdd={() => updateState({ data: { ...data, solutions: { ...data.solutions, prevention: [...data.solutions.prevention, ''] } } })}
                onRemove={(idx) => {
                    const next = data.solutions.prevention.filter((_, i) => i !== idx);
                    updateState({ data: { ...data, solutions: { ...data.solutions, prevention: next } } });
                }}
                onChange={(idx, val) => {
                    const next = [...data.solutions.prevention];
                    next[idx] = val;
                    updateState({ data: { ...data, solutions: { ...data.solutions, prevention: next } } });
                }}
            />
        </div>
    </div>
  );

  const renderReport = () => (
    <div className="bg-white paper-shadow border border-slate-200 p-6 md:p-12 max-w-4xl mx-auto rounded-xl mb-10">
        <div className="border-b-2 border-slate-800 pb-4 mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-900">문제해결 보고서</h1>
            <p className="text-slate-500 mt-2 text-sm">작성일: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="mb-8">
            <h2 className="text-lg font-bold border-l-4 border-slate-800 pl-3 mb-4">1. 현상 파악 (Fact)</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm md:text-base">
                {data.facts.length > 0 ? data.facts.map((f, i) => <li key={i}>{f}</li>) : <li className="text-slate-400 italic">입력된 정보 없음</li>}
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold border-l-4 border-slate-800 pl-3 mb-4">2. 문제 정의</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                <div className="bg-slate-50 p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-xs text-slate-500 uppercase">인명 사고</h3>
                    <p>{data.problemDefinition.humanIssue || '-'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-xs text-slate-500 uppercase">생산 차질</h3>
                    <p>{data.problemDefinition.productionIssue || '-'}</p>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold border-l-4 border-slate-800 pl-3 mb-4">3. 원인 분석</h2>
            <div className="space-y-4 text-sm md:text-base">
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h3 className="font-bold text-red-800 mb-2">근본 원인 (Root Cause)</h3>
                    <ul className="list-disc pl-5">
                        {data.rootCause.directCauses.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <h3 className="font-bold text-orange-800 mb-2">영향 요인</h3>
                    <ul className="list-disc pl-5">
                        {data.rootCause.indirectCauses.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                 </div>
                 <div className="text-sm text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl">
                    <strong>* 5 Whys Analysis:</strong><br/>
                    {data.rootCause.whys.filter(Boolean).map((w,i) => <span key={i}>{i+1}. {w} <br/></span>)}
                 </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold border-l-4 border-slate-800 pl-3 mb-4">4. 해결 대책</h2>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-base">
                <div className="border border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-slate-700">즉각 대응 (Action Plan)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.solutions.immediate.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-indigo-900">재발 방지 (Upstream)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.solutions.prevention.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>
        </section>
        
        <div className="mt-8 text-center print:hidden">
            <button 
                className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors w-full md:w-auto font-bold"
                onClick={() => window.print()}
            >
                보고서 제출 및 인쇄
            </button>
        </div>
    </div>
  );

  // Prepare images for the global modal
  const teamImages = userProfile 
      ? getImagesForTeam(userProfile.teamId, totalTeams) 
      : [];

  return (
    <>
        {(() => {
            switch (currentStep) {
                case 'intro': return renderIntro();
                case 'fact-finding': return renderFactFinding();
                case 'problem-definition': return renderProblemDefinition();
                case 'root-cause': return renderRootCause();
                case 'solution': return renderSolution();
                case 'report': return renderReport();
                default: return <div>Unknown Step</div>;
            }
        })()}

        {/* Global Info Card Modal */}
        {showInfoCard && (
            <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-2xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                    <div className="bg-slate-900 text-white p-5 flex justify-between items-center flex-shrink-0">
                        <div>
                        <h3 className="font-bold flex items-center gap-2 text-lg">
                            <FolderOpen size={20} className="text-yellow-400"/>
                            {userProfile ? `제${userProfile.teamId}조 정보 카드` : '조 정보'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {currentStep === 'intro' ? '수령한 정보 카드를 확인하고 문제해결을 시작하세요.' : '팀원들과 공유된 정보 카드를 다시 확인하세요.'}
                        </p>
                        </div>
                        <button onClick={() => setShowInfoCard(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-4 bg-slate-100 flex-1 overflow-y-auto">
                        {userProfile ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {teamImages.map((imgUrl, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer bg-white"
                                        onClick={() => setSelectedImage(imgUrl)}
                                    >
                                        <img 
                                            src={imgUrl} 
                                            alt={`Info Card ${idx + 1}`} 
                                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={32}/>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                ))}
                                {teamImages.length === 0 && (
                                    <div className="col-span-full text-center text-slate-500 py-10">
                                        할당된 이미지가 없습니다.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center mt-10">로그인 정보가 없습니다.</p>
                        )}
                    </div>
                    
                    {/* Only show the "Enter Situation Room" button on the Intro step */}
                    {currentStep === 'intro' && (
                        <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                            <button 
                                onClick={() => {
                                    updateState({ currentStep: 'fact-finding', isTimerRunning: true });
                                    setShowInfoCard(false);
                                }}
                                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-pulse"
                            >
                                정보 확인 완료 및 상황실 입장 <ArrowRight size={20}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Full Screen Image Lightbox */}
        {selectedImage && (
            <div 
                className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                    onClick={() => setSelectedImage(null)}
                >
                    <X size={32} />
                </button>
                <img 
                    src={selectedImage} 
                    alt="Full Size Info" 
                    className="max-w-full max-h-full object-contain rounded shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        )}
    </>
  );
};

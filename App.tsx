
import React, { useState, useEffect } from 'react';
import { MobileLayout } from './components/MobileLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { SimulationContainer } from './components/SimulationContainer';
import { ReportWriter } from './components/ReportWriter';
import { SimulationState, StepId, UserRole, SessionConfig, UserProfile } from './types';
import { INITIAL_TIME } from './constants';
import { Monitor, Smartphone, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useLearnerSession } from './hooks/useFirebaseSession';

const initialState: SimulationState = {
  currentStep: 'intro',
  timeLeft: INITIAL_TIME,
  isTimerRunning: false,
  data: {
    facts: [
      '8월 4일 오전 10:30분경 화재 발생',
      '제3공장에서 발생',
      '생산팀 박계장 전치 4주 화상',
    ],
    problemDefinition: {
      humanIssue: '',
      productionIssue: ''
    },
    rootCause: {
      whys: ['', '', '', '', ''],
      directCauses: [],
      indirectCauses: []
    },
    solutions: {
      immediate: [],
      prevention: []
    }
  }
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>(initialState);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showReportWriter, setShowReportWriter] = useState(false);

  // Firebase session hook for learners
  const {
    availableSessions,
    sessionConfig,
    loading: sessionLoading,
    joinSession,
    updateProgress,
    leaveSession
  } = useLearnerSession();

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (simulationState.isTimerRunning && simulationState.timeLeft > 0) {
      interval = setInterval(() => {
        setSimulationState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulationState.isTimerRunning, simulationState.timeLeft]);

  // Update progress when step changes
  useEffect(() => {
    if (userProfile && simulationState.currentStep) {
      updateProgress(simulationState.currentStep);
    }
  }, [simulationState.currentStep, userProfile]);

  const handleStepChange = (step: StepId) => {
    setSimulationState(prev => ({ ...prev, currentStep: step }));
  };

  const updateState = (newState: Partial<SimulationState>) => {
    setSimulationState(prev => ({ ...prev, ...newState }));
  };

  // Role Selection Screen
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 flex-col">
        <div className="max-w-4xl w-full flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <AlertTriangle className="text-red-500" size={40} />
              FireSim
            </h1>
            <p className="text-slate-400 text-lg">제3공장 화재사고 문제해결 시뮬레이션</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setRole('learner')}
              className="group bg-slate-800 hover:bg-red-600 border-2 border-slate-700 hover:border-red-500 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="bg-slate-700 group-hover:bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors">
                <Smartphone className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">학습자 모드</h2>
              <p className="text-slate-400 group-hover:text-red-100">모바일 환경에 최적화된<br/>시뮬레이션 교육을 진행합니다.</p>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="group bg-slate-800 hover:bg-blue-600 border-2 border-slate-700 hover:border-blue-500 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="bg-slate-700 group-hover:bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors">
                <Monitor className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">강사/관리자 모드</h2>
              <p className="text-slate-400 group-hover:text-blue-100">PC 환경에서 학습자들의<br/>진행 상황을 모니터링합니다.</p>
            </button>
          </div>
        </div>
        <div className="mt-8">
            <p className="text-xs font-bold text-blue-500 opacity-80">JJ Creative 교육연구소</p>
        </div>
      </div>
    );
  }

  // Admin View
  if (role === 'admin') {
    return (
        <AdminDashboard
            onSwitchToLearner={() => setRole('learner')}
        />
    );
  }

  // Learner View: Session Code Entry (No sessions or not joined)
  if (role === 'learner' && !userProfile) {
      return (
          <LearnerSessionJoin
            availableSessions={availableSessions}
            loading={sessionLoading}
            onJoin={async (sessionId, profile) => {
              await joinSession(sessionId, profile);
              setUserProfile(profile);
            }}
            onBack={() => setRole(null)}
          />
      );
  }

  // Learner View: Report Writer
  if (showReportWriter) {
    return (
      <ReportWriter
        userProfile={userProfile || undefined}
        onClose={() => setShowReportWriter(false)}
      />
    );
  }

  // Learner View: Main Simulation (After Login)
  return (
    <MobileLayout
      currentStep={simulationState.currentStep}
      timeLeft={simulationState.timeLeft}
      onStepChange={handleStepChange}
      onSwitchToAdmin={() => setRole('admin')}
      onWriteReport={() => setShowReportWriter(true)}
      maxAllowedStepIndex={sessionConfig?.currentStageIndex || 0}
    >
      <SimulationContainer
        state={simulationState}
        updateState={updateState}
        userProfile={userProfile || undefined}
        totalTeams={sessionConfig?.totalTeams || 6}
      />
    </MobileLayout>
  );
};

// New component for session joining with code
const LearnerSessionJoin: React.FC<{
    availableSessions: Record<string, SessionConfig & { id: string }>;
    loading: boolean;
    onJoin: (sessionId: string, profile: UserProfile) => Promise<void>;
    onBack: () => void;
}> = ({ availableSessions, loading, onJoin, onBack }) => {
    const [sessionCode, setSessionCode] = useState('');
    const [name, setName] = useState('');
    const [teamId, setTeamId] = useState<number>(1);
    const [step, setStep] = useState<'code' | 'profile'>('code');
    const [selectedSession, setSelectedSession] = useState<(SessionConfig & { id: string }) | null>(null);
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);

    const handleCodeSubmit = () => {
      const code = sessionCode.toUpperCase().trim();
      const session = availableSessions[code];

      if (session) {
        setSelectedSession(session);
        setStep('profile');
        setError('');
      } else {
        setError('유효하지 않은 접속 코드입니다. 관리자에게 문의하세요.');
      }
    };

    const handleJoin = async () => {
      if (!name.trim()) {
        setError('이름을 입력해주세요.');
        return;
      }
      if (!selectedSession) return;

      setJoining(true);
      try {
        await onJoin(selectedSession.id, {
          name: name.trim(),
          teamId,
          groupName: selectedSession.groupName
        });
      } catch (err) {
        setError('입장에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setJoining(false);
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="text-center text-white">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p>세션 정보 불러오는 중...</p>
          </div>
        </div>
      );
    }

    // Step 1: Enter session code
    if (step === 'code') {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans flex-col">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold mb-1">FireSim 입장</h2>
                    <p className="opacity-90 text-sm">관리자에게 받은 접속 코드를 입력하세요.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">접속 코드</label>
                        <input
                            type="text"
                            value={sessionCode}
                            onChange={(e) => {
                              setSessionCode(e.target.value.toUpperCase());
                              setError('');
                            }}
                            placeholder="예: ABC123"
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-2xl text-center font-mono tracking-widest uppercase"
                            maxLength={6}
                            autoFocus
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                        )}
                    </div>

                    {/* Show available sessions for quick access (optional) */}
                    {Object.keys(availableSessions).length > 0 && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-xs text-slate-400 text-center mb-3">또는 오픈된 세션 선택</p>
                        <div className="space-y-2">
                          {Object.values(availableSessions).map((session) => (
                            <button
                              key={session.id}
                              onClick={() => {
                                setSelectedSession(session);
                                setSessionCode(session.id);
                                setStep('profile');
                              }}
                              className="w-full p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-left flex justify-between items-center"
                            >
                              <span className="font-bold text-slate-800">{session.groupName}</span>
                              <span className="text-xs text-slate-400 font-mono">{session.id}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                        onClick={handleCodeSubmit}
                        disabled={sessionCode.length < 4}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        다음 <ArrowRight size={20} />
                    </button>

                    <button onClick={onBack} className="w-full text-slate-400 text-sm py-2 hover:text-slate-600 transition-colors">
                        ← 처음으로 돌아가기
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xs font-bold text-blue-500 opacity-80">JJ Creative 교육연구소</p>
            </div>
        </div>
      );
    }

    // Step 2: Enter profile info
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans flex-col">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold mb-1">FireSim 입장</h2>
                    <p className="opacity-90 text-sm">교육에 참여할 정보를 입력하세요.</p>
                </div>
                <div className="p-8 space-y-6">
                    {/* Session Info */}
                    <div className="bg-slate-100 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 font-bold mb-1">접속 세션</p>
                      <p className="font-bold text-slate-900">{selectedSession?.groupName}</p>
                      <p className="text-xs text-slate-400 font-mono">{selectedSession?.id}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">조 선택 (Team)</label>
                        <select
                            value={teamId}
                            onChange={(e) => setTeamId(Number(e.target.value))}
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg bg-white"
                        >
                            {Array.from({ length: selectedSession?.totalTeams || 6 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}조</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">이름 (Name)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setError('');
                            }}
                            placeholder="본인의 이름을 입력하세요"
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg"
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={joining}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        {joining ? (
                          <><Loader2 className="animate-spin" size={20} /> 입장 중...</>
                        ) : (
                          <>입장하기 <ArrowRight size={20} /></>
                        )}
                    </button>

                    <button
                      onClick={() => setStep('code')}
                      className="w-full text-slate-400 text-sm py-2 hover:text-slate-600 transition-colors"
                    >
                        ← 코드 다시 입력
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xs font-bold text-blue-500 opacity-80">JJ Creative 교육연구소</p>
            </div>
        </div>
    );
};

export default App;

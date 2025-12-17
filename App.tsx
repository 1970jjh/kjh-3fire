
import React, { useState, useEffect } from 'react';
import { MobileLayout } from './components/MobileLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { SimulationContainer } from './components/SimulationContainer';
import { SimulationState, StepId, UserRole, SessionConfig, UserProfile } from './types';
import { INITIAL_TIME } from './constants';
import { Monitor, Smartphone, AlertTriangle, Users, ArrowRight } from 'lucide-react';

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
  
  // Session State (Shared between Admin and Learners in this standalone app)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
      isOpen: false,
      groupName: '',
      totalTeams: 6,
      currentStageIndex: 0 // Intro
  });

  // Learner User State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
        />
    );
  }

  // Learner View: Waiting Room (Session not open)
  if (role === 'learner' && !sessionConfig.isOpen) {
      return (
          <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center flex-col">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Monitor className="text-slate-400" size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">세션 대기 중</h2>
                  <p className="text-slate-500 text-sm mb-6">
                      관리자가 아직 앱을 오픈하지 않았습니다.<br/>
                      잠시만 기다려주세요.
                  </p>
                  <button onClick={() => setRole(null)} className="text-slate-400 underline text-sm">돌아가기</button>
              </div>
              <div className="mt-8">
                <p className="text-xs font-bold text-blue-600 opacity-80">JJ Creative 교육연구소</p>
            </div>
          </div>
      );
  }

  // Learner View: Login/Join Screen
  if (role === 'learner' && sessionConfig.isOpen && !userProfile) {
      return (
          <LearnerLogin 
            config={sessionConfig} 
            onJoin={(profile) => setUserProfile(profile)} 
            onBack={() => setRole(null)}
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
      maxAllowedStepIndex={sessionConfig.currentStageIndex}
    >
      <SimulationContainer 
        state={simulationState} 
        updateState={updateState} 
        userProfile={userProfile || undefined}
        totalTeams={sessionConfig.totalTeams}
      />
    </MobileLayout>
  );
};

// Sub-component for Learner Login
const LearnerLogin: React.FC<{
    config: SessionConfig;
    onJoin: (profile: UserProfile) => void;
    onBack: () => void;
}> = ({ config, onJoin, onBack }) => {
    const [name, setName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>(''); // For simulation purposes
    const [teamId, setTeamId] = useState<number>(1);

    // Auto-select the only available group in this demo
    useEffect(() => {
        setSelectedGroup(config.groupName);
    }, [config.groupName]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans flex-col">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold mb-1">FireSim 입장</h2>
                    <p className="opacity-90 text-sm">교육에 참여할 정보를 입력하세요.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">과정/그룹 선택 (Group)</label>
                        <select 
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg bg-slate-50 font-bold text-slate-900"
                        >
                            <option value={config.groupName}>{config.groupName} (현재 오픈됨)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">조 선택 (Team)</label>
                        <select 
                            value={teamId}
                            onChange={(e) => setTeamId(Number(e.target.value))}
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg bg-white"
                        >
                            {Array.from({ length: config.totalTeams }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}조</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">이름 (Name)</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="본인의 이름을 입력하세요"
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg"
                        />
                    </div>

                    <button 
                        onClick={() => {
                            if (name.trim()) {
                                onJoin({ name, teamId, groupName: config.groupName });
                            } else {
                                alert("이름을 입력해주세요.");
                            }
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        입장하기 <ArrowRight size={20} />
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
};

export default App;

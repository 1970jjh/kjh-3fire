
import React, { useState } from 'react';
import { BarChart3, Users, CheckCircle, AlertTriangle, Search, Filter, MoreHorizontal, Smartphone, Play, Settings, Lock, Trash2, LogOut, ArrowRight, ChevronRight, Unlock } from 'lucide-react';
import { StudentProgress, SessionConfig } from '../types';
import { STEPS } from '../constants';

interface AdminDashboardProps {
    onSwitchToLearner: () => void;
    sessionConfig: SessionConfig;
    setSessionConfig: (config: SessionConfig) => void;
}

// Mock Data
const MOCK_STUDENTS: StudentProgress[] = [
  { id: '1', name: '김철수', step: 'report', status: 'completed', lastActive: '방금 전', score: 92 },
  { id: '2', name: '이영희', step: 'root-cause', status: 'active', lastActive: '2분 전' },
  { id: '3', name: '박민수', step: 'problem-definition', status: 'stuck', lastActive: '15분 전' },
  { id: '4', name: '최지우', step: 'solution', status: 'active', lastActive: '5분 전' },
  { id: '5', name: '정우성', step: 'intro', status: 'active', lastActive: '1분 전' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToLearner, sessionConfig, setSessionConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [setupData, setSetupData] = useState({
      groupName: '',
      totalTeams: 6
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '6749467') {
        setIsAuthenticated(true);
    } else {
        alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleStartSession = () => {
      if(!setupData.groupName) {
          alert("그룹명(교육과정명)을 입력해주세요.");
          return;
      }
      setSessionConfig({
          isOpen: true,
          groupName: setupData.groupName,
          totalTeams: setupData.totalTeams,
          currentStageIndex: 0 // Start at Intro
      });
  };

  const handleDeleteSession = () => {
      if(window.confirm("정말로 현재 교육 그룹 세션을 종료하고 삭제하시겠습니까? 모든 진행 데이터가 초기화됩니다.")) {
          setSessionConfig({
              isOpen: false,
              groupName: '',
              totalTeams: 6,
              currentStageIndex: 0
          });
          setSetupData({ groupName: '', totalTeams: 6 });
      }
  };

  const advanceStage = () => {
    if (sessionConfig.currentStageIndex < STEPS.length - 1) {
      if(window.confirm(`'${STEPS[sessionConfig.currentStageIndex + 1].title}' 단계를 오픈하시겠습니까?`)) {
          setSessionConfig({
            ...sessionConfig,
            currentStageIndex: sessionConfig.currentStageIndex + 1
          });
      }
    }
  };

  const rollbackStage = () => {
    if (sessionConfig.currentStageIndex > 0) {
        if(window.confirm("이전 단계로 되돌리시겠습니까? 학습자들의 진행이 제한될 수 있습니다.")) {
            setSessionConfig({
                ...sessionConfig,
                currentStageIndex: sessionConfig.currentStageIndex - 1
            });
        }
    }
  };

  // 1. Login Screen
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">관리자 접속</h1>
                    <p className="text-slate-500 text-sm mt-2">안전한 교육 운영을 위해 인증이 필요합니다.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl text-center text-lg tracking-widest focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                            placeholder="PASSCODE"
                            autoFocus
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        접속하기 <ArrowRight size={20} />
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <button onClick={onSwitchToLearner} className="text-sm text-slate-400 hover:text-slate-600 underline">
                        학습자 모드로 돌아가기
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // 2. Session Setup View (Create Group)
  if (!sessionConfig.isOpen) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
              <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-white p-8 pb-0 text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Settings size={32} />
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">새로운 교육 그룹 생성</h1>
                      <p className="text-slate-500">교육 과정명과 조(Team) 수를 설정하여<br/>새로운 세션을 시작하세요.</p>
                  </div>
                  <div className="p-8 space-y-8 flex-1">
                      <div>
                          <label className="block text-sm font-bold text-slate-800 mb-2">교육 과정명 (그룹명)</label>
                          <input 
                              type="text" 
                              value={setupData.groupName}
                              onChange={(e) => setSetupData({...setupData, groupName: e.target.value})}
                              placeholder="예: 2024 신입사원 문제해결 과정"
                              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-slate-50 focus:bg-white"
                          />
                      </div>
                      <div>
                          <div className="flex justify-between items-end mb-4">
                              <label className="block text-sm font-bold text-slate-800">조(Team) 편성 수</label>
                              <span className="text-2xl font-black text-blue-600">{setupData.totalTeams}<span className="text-base font-normal text-slate-400 ml-1">개조</span></span>
                          </div>
                          <input 
                              type="range" 
                              min="1" 
                              max="12" 
                              step="1"
                              value={setupData.totalTeams}
                              onChange={(e) => setSetupData({...setupData, totalTeams: parseInt(e.target.value)})}
                              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                              <span>1조</span>
                              <span>12조</span>
                          </div>
                      </div>

                      <div className="pt-4">
                          <button 
                              onClick={handleStartSession}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                          >
                              <Play size={20} fill="currentColor" /> 교육 세션 시작 (그룹 생성)
                          </button>
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400">JJ Creative 교육연구소</p>
                  </div>
              </div>
          </div>
      );
  }

  // 3. Admin Dashboard View (Manage/Delete)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-10 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">FS</div>
            FireSim Admin
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl bg-slate-100 text-slate-900">
            <BarChart3 size={18} /> 대시보드
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users size={18} /> 학습자 관리
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CheckCircle size={18} /> 평가 및 피드백
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-100 space-y-2">
            <button 
                onClick={handleDeleteSession}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
                <Trash2 size={16} /> 그룹 삭제 (세션 종료)
            </button>
            <button 
                onClick={onSwitchToLearner}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
                <Smartphone size={16} /> 학습자 모드 확인
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Session Active</span>
                </div>
                <h1 className="font-bold text-lg text-slate-900">{sessionConfig.groupName}</h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 font-bold uppercase">Total Teams</p>
                    <p className="font-bold text-slate-800">{sessionConfig.totalTeams}개조 운영 중</p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <Settings size={20} />
                </div>
            </div>
        </header>

        <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
            
            {/* Stage Control Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                     <div 
                        className="h-full bg-slate-900 transition-all duration-500" 
                        style={{ width: `${((sessionConfig.currentStageIndex + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
                    <div>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">현재 진행 단계 (Stage Control)</h2>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-slate-900">{STEPS[sessionConfig.currentStageIndex].title}</h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Unlock size={12}/> Open
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{STEPS[sessionConfig.currentStageIndex].description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={rollbackStage}
                            disabled={sessionConfig.currentStageIndex === 0}
                            className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            이전 단계
                        </button>
                        <button 
                            onClick={advanceStage}
                            disabled={sessionConfig.currentStageIndex === STEPS.length - 1}
                            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                            다음 단계 오픈 <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Live Users</span>
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">24<span className="text-lg text-slate-400 font-medium ml-1">/ 30</span></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Progress</span>
                        <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                             <BarChart3 size={16} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">68%</div>
                    <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[68%] rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stuck Users</span>
                        <div className="bg-orange-100 text-orange-700 p-1.5 rounded-lg">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">3<span className="text-lg text-slate-400 font-medium ml-1">명</span></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</span>
                        <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">
                            <CheckCircle size={16} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">5<span className="text-lg text-slate-400 font-medium ml-1">명</span></div>
                </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="font-bold text-lg text-slate-800">학습자 현황 모니터링</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white transition-colors" 
                                placeholder="이름 검색" 
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">
                            <Filter size={16} /> 필터
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold">이름</th>
                                <th className="px-6 py-4 font-bold">현재 단계</th>
                                <th className="px-6 py-4 font-bold">상태</th>
                                <th className="px-6 py-4 font-bold">마지막 활동</th>
                                <th className="px-6 py-4 font-bold">점수 (예측)</th>
                                <th className="px-6 py-4 font-bold text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_STUDENTS.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                            {STEPS.find(s => s.id === student.step)?.shortTitle || student.step}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.status === 'completed' && <span className="text-green-600 font-bold flex items-center gap-1.5"><CheckCircle size={14}/> 완료</span>}
                                        {student.status === 'active' && <span className="text-blue-600 font-bold flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/> 진행중</span>}
                                        {student.status === 'stuck' && <span className="text-orange-500 font-bold flex items-center gap-1.5"><AlertTriangle size={14}/> 지연됨</span>}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{student.lastActive}</td>
                                    <td className="px-6 py-4 font-black text-slate-800">{student.score ? `${student.score}점` : '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-300 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-xs font-bold text-blue-600 opacity-60">JJ Creative 교육연구소 Admin System</p>
            </div>
        </div>
      </main>
    </div>
  );
};

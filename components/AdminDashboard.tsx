
import React, { useState } from 'react';
import { BarChart3, Users, CheckCircle, AlertTriangle, Search, Filter, MoreHorizontal, Smartphone, Play, Settings, Lock, Trash2, ArrowRight, ChevronRight, Unlock, ArrowLeft, Plus, Building2, ChevronLeft } from 'lucide-react';
import { SessionConfig } from '../types';
import { STEPS } from '../constants';
import { useAdminSessions } from '../hooks/useFirebaseSession';

interface AdminDashboardProps {
    onSwitchToLearner: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToLearner }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [setupData, setSetupData] = useState({
      groupName: '',
      totalTeams: 6
  });

  const {
    sessions,
    selectedSessionId,
    selectedSession,
    selectedSessionLearners,
    loading,
    createNewSession,
    updateSessionConfig,
    removeSession,
    selectSession
  } = useAdminSessions();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '6749467') {
        setIsAuthenticated(true);
    } else {
        alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleCreateSession = async () => {
      if(!setupData.groupName) {
          alert("그룹명(회사명)을 입력해주세요.");
          return;
      }
      try {
        await createNewSession({
          isOpen: true,
          groupName: setupData.groupName,
          totalTeams: setupData.totalTeams,
          currentStageIndex: 0
        });
        setSetupData({ groupName: '', totalTeams: 6 });
        setShowCreateForm(false);
      } catch (err) {
        alert("그룹 생성에 실패했습니다. 다시 시도해주세요.");
      }
  };

  const handleDeleteSession = async (sessionId: string, groupName: string) => {
      if(window.confirm(`"${groupName}" 그룹을 정말 삭제하시겠습니까?\n모든 학습자 데이터가 삭제됩니다.`)) {
          await removeSession(sessionId);
      }
  };

  const advanceStage = async (sessionId: string, currentIndex: number) => {
    if (currentIndex < STEPS.length - 1) {
      if(window.confirm(`'${STEPS[currentIndex + 1].title}' 단계를 오픈하시겠습니까?`)) {
          await updateSessionConfig(sessionId, {
            currentStageIndex: currentIndex + 1
          });
      }
    }
  };

  const rollbackStage = async (sessionId: string, currentIndex: number) => {
    if (currentIndex > 0) {
        if(window.confirm("이전 단계로 되돌리시겠습니까?")) {
            await updateSessionConfig(sessionId, {
                currentStageIndex: currentIndex - 1
            });
        }
    }
  };

  // Convert learners object to array
  const learnersArray = Object.entries(selectedSessionLearners).map(([id, data]: [string, any]) => ({
    id,
    name: data.name,
    teamId: data.teamId,
    step: data.currentStep || 'intro',
    lastActive: data.lastActive ? new Date(data.lastActive).toLocaleTimeString('ko-KR') : '-',
    status: data.currentStep === 'report' ? 'completed' : 'active'
  }));

  const sessionsArray = Object.values(sessions);

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

  // 2. Group Detail View (When a session is selected)
  if (selectedSessionId && selectedSession) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => selectSession(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-green-600 uppercase">Active</span>
                </div>
                <h1 className="font-bold text-xl text-slate-900">{selectedSession.groupName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">참여 조</p>
                <p className="font-bold text-slate-800">{selectedSession.totalTeams}개조</p>
              </div>
              <button
                onClick={() => handleDeleteSession(selectedSessionId, selectedSession.groupName)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="그룹 삭제"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Stage Control */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((selectedSession.currentStageIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">현재 진행 단계</h2>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-slate-900">{STEPS[selectedSession.currentStageIndex].title}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <Unlock size={12}/> Open
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{STEPS[selectedSession.currentStageIndex].description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => rollbackStage(selectedSessionId, selectedSession.currentStageIndex)}
                  disabled={selectedSession.currentStageIndex === 0}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  이전 단계
                </button>
                <button
                  onClick={() => advanceStage(selectedSessionId, selectedSession.currentStageIndex)}
                  disabled={selectedSession.currentStageIndex === STEPS.length - 1}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  다음 단계 오픈 <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-xs font-bold uppercase">접속자</span>
                <Users size={16} className="text-green-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{learnersArray.length}<span className="text-sm text-slate-400 ml-1">명</span></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-xs font-bold uppercase">평균 진행</span>
                <BarChart3 size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {learnersArray.length > 0
                  ? Math.round(learnersArray.reduce((acc, l) => acc + (STEPS.findIndex(s => s.id === l.step) + 1), 0) / learnersArray.length / STEPS.length * 100)
                  : 0}%
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-xs font-bold uppercase">활성 조</span>
                <AlertTriangle size={16} className="text-orange-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {new Set(learnersArray.map(l => l.teamId)).size}
                <span className="text-sm text-slate-400 ml-1">/ {selectedSession.totalTeams}조</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 text-xs font-bold uppercase">완료</span>
                <CheckCircle size={16} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {learnersArray.filter(l => l.step === 'report').length}<span className="text-sm text-slate-400 ml-1">명</span>
              </div>
            </div>
          </div>

          {/* Learners Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800">학습자 현황 ({learnersArray.length}명)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 font-bold">조</th>
                    <th className="px-5 py-3 font-bold">이름</th>
                    <th className="px-5 py-3 font-bold">현재 단계</th>
                    <th className="px-5 py-3 font-bold">상태</th>
                    <th className="px-5 py-3 font-bold">마지막 활동</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {learnersArray.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                        아직 접속한 학습자가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    learnersArray.map(learner => (
                      <tr key={learner.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                            {learner.teamId}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-900">{learner.name}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            {STEPS.find(s => s.id === learner.step)?.shortTitle || learner.step}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {learner.status === 'completed' ? (
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> 완료</span>
                          ) : (
                            <span className="text-blue-600 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/> 진행중</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-500">{learner.lastActive}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Groups List View (Main Dashboard)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-xl font-bold">FS</div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">FireSim 관리자</h1>
              <p className="text-xs text-slate-400">교육 그룹 관리</p>
            </div>
          </div>
          <button
            onClick={onSwitchToLearner}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Smartphone size={18} /> 학습자 모드
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Create Group Section */}
        {showCreateForm ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-900">새 그룹 생성</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                취소
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">그룹명 (회사명/과정명)</label>
                <input
                  type="text"
                  value={setupData.groupName}
                  onChange={(e) => setSetupData({...setupData, groupName: e.target.value})}
                  placeholder="예: 삼성전자 신입사원 과정"
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-sm font-bold text-slate-700">조(Team) 수</label>
                  <span className="text-xl font-black text-blue-600">{setupData.totalTeams}<span className="text-sm font-normal text-slate-400 ml-1">개조</span></span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={setupData.totalTeams}
                  onChange={(e) => setSetupData({...setupData, totalTeams: parseInt(e.target.value)})}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1조</span>
                  <span>12조</span>
                </div>
              </div>
              <button
                onClick={handleCreateSession}
                disabled={loading || !setupData.groupName}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? '생성 중...' : <><Play size={20} /> 그룹 생성하기</>}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-8 mb-8 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
              <Plus size={28} className="text-blue-600" />
            </div>
            <span className="font-bold text-slate-600 group-hover:text-blue-600">새 그룹 생성하기</span>
          </button>
        )}

        {/* Groups List */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Building2 size={20} />
            운영 중인 그룹 ({sessionsArray.length}개)
          </h2>

          {sessionsArray.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-600 mb-2">아직 생성된 그룹이 없습니다</h3>
              <p className="text-sm text-slate-400">위의 버튼을 눌러 새 그룹을 생성하세요</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessionsArray.map((session) => {
                const sessionLearners = Object.keys(session).filter(k => k === 'learners').length > 0 ? [] : [];
                return (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold text-green-600">운영중</span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">{session.groupName}</h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id, session.groupName);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {session.totalTeams}개조
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 size={14} />
                          {STEPS[session.currentStageIndex]?.shortTitle}
                        </span>
                      </div>

                      <button
                        onClick={() => selectSession(session.id)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        관리하기 <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-blue-600 opacity-60">JJ Creative 교육연구소</p>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Clock, Menu, ChevronLeft, ChevronRight, Save, LogOut, Monitor, Lock } from 'lucide-react';
import { STEPS } from '../constants';
import { StepId } from '../types';

interface MobileLayoutProps {
  currentStep: StepId;
  timeLeft: number;
  onStepChange: (step: StepId) => void;
  onSwitchToAdmin: () => void;
  maxAllowedStepIndex: number;
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ currentStep, timeLeft, onStepChange, onSwitchToAdmin, maxAllowedStepIndex, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 600;
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const canProceed = currentStepIndex < maxAllowedStepIndex;
  
  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      if (canProceed) {
        onStepChange(STEPS[currentStepIndex + 1].id);
        window.scrollTo(0, 0);
      } else {
        alert("다음 단계가 아직 오픈되지 않았습니다. 관리자의 안내를 기다려주세요.");
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onStepChange(STEPS[currentStepIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  // Intro step has its own full screen layout, but we still wrap it.
  // We hide the bottom navigation for intro to use the custom start button.
  const isIntro = currentStep === 'intro';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800 pb-20">
      {/* Mobile Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-red-500">FireSim</span>
            <span className="text-xs text-slate-400">| 제3공장</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono ${
            isUrgent ? 'bg-red-600 animate-pulse' : 'bg-slate-800'
          }`}>
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-red-500 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Step Title & Menu */}
        <div className="bg-white text-slate-900 p-3 border-b border-slate-200 flex justify-between items-center shadow-sm relative">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Step {currentStepIndex} / {STEPS.length - 1}</span>
            <h1 className="font-bold text-sm sm:text-base">{STEPS[currentStepIndex].title}</h1>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-400 hover:text-slate-900 p-2"
          >
             <Menu size={24} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-full right-2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={onSwitchToAdmin}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
              >
                <Monitor size={16} className="text-slate-400"/> 관리자 모드 전환
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> 종료 (초기화)
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 w-full max-w-lg mx-auto relative" onClick={() => setIsMenuOpen(false)}>
        {children}
        <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-blue-600 opacity-80">JJ Creative 교육연구소</p>
        </div>
      </main>

      {/* Bottom Navigation (Hidden on Intro) */}
      {!isIntro && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-3 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
          <button 
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`p-3 rounded-xl border border-slate-200 ${
              currentStepIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft />
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentStepIndex === STEPS.length - 1}
            className={`flex-1 rounded-xl font-bold py-3 px-4 shadow-md active:scale-[0.98] transition-transform flex justify-center items-center gap-2 ${
                currentStepIndex === STEPS.length - 1 ? 'bg-red-600 text-white' : 
                canProceed ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {currentStepIndex === STEPS.length - 1 ? (
              <>제출하기 <Save size={18}/></>
            ) : canProceed ? (
              <>다음 단계 <ChevronRight size={18}/></>
            ) : (
                <><Lock size={16}/> 대기 중</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

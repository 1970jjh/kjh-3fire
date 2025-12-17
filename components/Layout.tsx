import React from 'react';
import { Clock, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { STEPS } from '../constants';
import { StepId } from '../types';

interface LayoutProps {
  currentStep: StepId;
  timeLeft: number;
  onStepChange: (step: StepId) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentStep, timeLeft, onStepChange, children }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 600; // Last 10 mins

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:h-screen sticky top-0 md:fixed overflow-y-auto z-20">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xl mb-1">
            <AlertTriangle className="h-6 w-6" />
            <span>FireSim</span>
          </div>
          <p className="text-slate-400 text-xs">제3공장 문제해결 시뮬레이션</p>
        </div>
        <nav className="p-4 space-y-2">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const currentIndex = STEPS.findIndex(s => s.id === currentStep);
            const isCompleted = STEPS.findIndex(s => s.id === step.id) < currentIndex;

            return (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-red-600' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={14} /> : index}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Sticky Header with Timer */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {STEPS.find(s => s.id === currentStep)?.title}
            </h1>
            <p className="text-sm text-slate-500 hidden sm:block">
              {STEPS.find(s => s.id === currentStep)?.description}
            </p>
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
            isUrgent ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-2xl font-bold tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

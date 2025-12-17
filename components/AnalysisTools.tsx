import React from 'react';
import { ArrowDown, GitBranch } from 'lucide-react';

interface FiveWhysProps {
  whys: string[];
  onChange: (index: number, value: string) => void;
}

export const FiveWhys: React.FC<FiveWhysProps> = ({ whys, onChange }) => {
  return (
    <div className="space-y-4 bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <GitBranch className="text-blue-600" />
        5 Whys 분석
      </h3>
      <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6">
        표면적인 원인에서 시작하여 '왜?'라는 질문을 반복해 근본적인 원인을 찾아내세요.
      </p>
      
      {whys.map((why, index) => (
        <div key={index} className="relative">
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
            <div className="flex-shrink-0 md:w-16 md:pt-2 md:text-right font-bold text-slate-400 text-xs md:text-sm uppercase">
              {index === 0 ? 'Problem' : `Why ${index}?`}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={why}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={index === 0 ? "발생한 문제는 무엇인가요?" : "그것은 왜 발생했나요?"}
                className="w-full p-3 text-sm md:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          {index < whys.length - 1 && (
            <div className="ml-4 md:ml-24 my-1 md:my-2 text-slate-300 flex justify-start md:justify-center w-8">
              <ArrowDown size={16} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const LogicTreeInput: React.FC<{ 
  title: string; 
  items: string[]; 
  onAdd: () => void;
  onChange: (idx: number, val: string) => void;
  onRemove: (idx: number) => void;
  placeholder?: string;
  colorClass?: string;
}> = ({ title, items, onAdd, onChange, onRemove, placeholder, colorClass = "bg-slate-100" }) => {
  return (
    <div className={`p-4 md:p-5 rounded-xl border border-transparent ${colorClass}`}>
      <h4 className="font-bold text-slate-700 mb-3 text-sm md:text-base">{title}</h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="flex-1 p-2 md:p-3 text-sm border border-white/50 bg-white/80 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={item}
              onChange={(e) => onChange(idx, e.target.value)}
              placeholder={placeholder}
            />
            <button 
              onClick={() => onRemove(idx)}
              className="text-slate-400 hover:text-red-500 px-2 h-full"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button 
        onClick={onAdd}
        className="mt-3 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1 py-1"
      >
        + 항목 추가
      </button>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { ReportData, UserProfile } from '../types';
import {
  FileText, Users, Eye, Search, Lightbulb, Shield, Target,
  ArrowLeft, Download, CheckCircle, AlertTriangle, Wrench, RefreshCw
} from 'lucide-react';

interface ReportWriterProps {
  userProfile?: UserProfile;
  onClose: () => void;
}

const initialReportData: ReportData = {
  title: '',
  teamMembers: '',
  situation: '',
  problemDef: '',
  rootCause: '',
  solution: '',
  prevention: '',
};

export const ReportWriter: React.FC<ReportWriterProps> = ({ userProfile, onClose }) => {
  const [reportData, setReportData] = useState<ReportData>(initialReportData);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ReportData, value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      window.print();
    }
  };

  const isFormComplete = () => {
    return reportData.title && reportData.teamMembers &&
           reportData.situation && reportData.problemDef &&
           reportData.rootCause && reportData.solution && reportData.prevention;
  };

  // Input Form View
  const renderForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="flex justify-between items-center p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">돌아가기</span>
          </button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            보고서 작성
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Form Content */}
      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {/* 보고서 타이틀 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <FileText size={18} className="text-blue-500" />
            보고서 타이틀
          </label>
          <input
            type="text"
            value={reportData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="예: 제3공장 화재사고 분석 보고서"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base"
          />
        </div>

        {/* 팀원 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Users size={18} className="text-green-500" />
            팀원
          </label>
          <input
            type="text"
            value={reportData.teamMembers}
            onChange={(e) => handleChange('teamMembers', e.target.value)}
            placeholder="예: 홍길동, 김철수, 이영희"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base"
          />
        </div>

        {/* 1. 현상파악 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Eye size={18} className="text-purple-500" />
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs mr-1">1</span>
            현상파악
          </label>
          <textarea
            value={reportData.situation}
            onChange={(e) => handleChange('situation', e.target.value)}
            placeholder="발생한 사고의 현상과 상황을 객관적으로 기술하세요..."
            rows={4}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
          />
        </div>

        {/* 2. 문제정의 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Search size={18} className="text-orange-500" />
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs mr-1">2</span>
            문제정의
          </label>
          <textarea
            value={reportData.problemDef}
            onChange={(e) => handleChange('problemDef', e.target.value)}
            placeholder="해결해야 할 핵심 문제가 무엇인지 명확하게 정의하세요..."
            rows={4}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
          />
        </div>

        {/* 3. 원인규명 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Lightbulb size={18} className="text-yellow-500" />
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs mr-1">3</span>
            원인규명
          </label>
          <textarea
            value={reportData.rootCause}
            onChange={(e) => handleChange('rootCause', e.target.value)}
            placeholder="문제의 근본 원인을 분석하여 기술하세요..."
            rows={4}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
          />
        </div>

        {/* 4. 해결방안 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Wrench size={18} className="text-blue-500" />
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs mr-1">4</span>
            해결방안
          </label>
          <textarea
            value={reportData.solution}
            onChange={(e) => handleChange('solution', e.target.value)}
            placeholder="즉각적인 해결 방안과 조치 사항을 기술하세요..."
            rows={4}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
          />
        </div>

        {/* 5. 재발방지대책 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Shield size={18} className="text-red-500" />
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs mr-1">5</span>
            재발방지대책
          </label>
          <textarea
            value={reportData.prevention}
            onChange={(e) => handleChange('prevention', e.target.value)}
            placeholder="같은 문제가 재발하지 않도록 하는 예방 대책을 기술하세요..."
            rows={4}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
          />
        </div>

        <div className="pt-4">
          <p className="text-xs text-center text-blue-600 font-bold opacity-80">JJ Creative 교육연구소</p>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <button
          onClick={() => setShowPreview(true)}
          disabled={!isFormComplete()}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isFormComplete()
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={20} />
          보고서 미리보기
        </button>
      </div>
    </div>
  );

  // Bento Grid Preview View
  const renderPreview = () => (
    <div className="min-h-screen bg-slate-900 print:bg-white">
      {/* Header - Hidden on print */}
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center print:hidden">
        <button
          onClick={() => setShowPreview(false)}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>수정하기</span>
        </button>
        <h1 className="font-bold">보고서 미리보기</h1>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <Download size={18} />
          PDF 저장
        </button>
      </header>

      {/* Bento Grid Report */}
      <div ref={reportRef} className="p-4 md:p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">

          {/* Report Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 print:bg-slate-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500 p-2 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">문제해결 보고서</p>
                <h1 className="text-2xl md:text-3xl font-bold">{reportData.title}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-4">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{userProfile?.groupName} 제{userProfile?.teamId}조</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} />
                <span>팀원: {reportData.teamMembers}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Content */}
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 현상파악 - Full Width */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-500 text-white p-2 rounded-xl">
                  <Eye size={20} />
                </div>
                <h3 className="font-bold text-purple-900 text-lg">1. 현상파악</h3>
              </div>
              <p className="text-purple-800 leading-relaxed whitespace-pre-wrap">{reportData.situation}</p>
            </div>

            {/* 문제정의 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-500 text-white p-2 rounded-xl">
                  <Search size={20} />
                </div>
                <h3 className="font-bold text-orange-900 text-lg">2. 문제정의</h3>
              </div>
              <p className="text-orange-800 leading-relaxed whitespace-pre-wrap">{reportData.problemDef}</p>
            </div>

            {/* 원인규명 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-5 border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500 text-white p-2 rounded-xl">
                  <Lightbulb size={20} />
                </div>
                <h3 className="font-bold text-yellow-900 text-lg">3. 원인규명</h3>
              </div>
              <p className="text-yellow-800 leading-relaxed whitespace-pre-wrap">{reportData.rootCause}</p>
            </div>

            {/* 해결방안 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500 text-white p-2 rounded-xl">
                  <Wrench size={20} />
                </div>
                <h3 className="font-bold text-blue-900 text-lg">4. 해결방안</h3>
              </div>
              <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">{reportData.solution}</p>
            </div>

            {/* 재발방지대책 */}
            <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-500 text-white p-2 rounded-xl">
                  <Shield size={20} />
                </div>
                <h3 className="font-bold text-red-900 text-lg">5. 재발방지대책</h3>
              </div>
              <p className="text-red-800 leading-relaxed whitespace-pre-wrap">{reportData.prevention}</p>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <RefreshCw size={14} />
              <span>FireSim 문제해결 시뮬레이션</span>
              <span className="text-blue-600 font-bold">| JJ Creative 교육연구소</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only download button at bottom */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        >
          <Download size={20} />
          PDF로 저장하기
        </button>
      </div>
    </div>
  );

  return showPreview ? renderPreview() : renderForm();
};

export default ReportWriter;

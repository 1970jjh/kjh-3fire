
export type StepId = 'intro' | 'fact-finding' | 'problem-definition' | 'root-cause' | 'solution' | 'report';
export type UserRole = 'learner' | 'admin' | null;

export interface SessionConfig {
  isOpen: boolean;
  groupName: string; // e.g., "신입사원 3기"
  totalTeams: number; // 1 ~ 12
  currentStageIndex: number; // 0 ~ 5 (Index of STEPS)
}

export interface UserProfile {
  name: string;
  groupName: string;
  teamId: number;
}

export interface SimulationState {
  currentStep: StepId;
  timeLeft: number; // seconds
  isTimerRunning: boolean;
  data: {
    facts: string[];
    problemDefinition: {
      humanIssue: string;
      productionIssue: string;
    };
    rootCause: {
      whys: string[]; // For 5 Whys
      directCauses: string[];
      indirectCauses: string[];
    };
    solutions: {
      immediate: string[];
      prevention: string[]; // Upstream
    };
  };
}

export interface StepContent {
  id: StepId;
  title: string;
  shortTitle: string;
  description: string;
  goal: string; // 학습 목표
  guide: string; // 수행 가이드
  contextData?: { // 시나리오 상황 자료 (인터뷰, 데이터 등)
    type: 'interview' | 'report' | 'email';
    source: string;
    content: string;
  }[];
}

// Mock type for Admin Dashboard
export interface StudentProgress {
  id: string;
  name: string;
  step: StepId;
  status: 'active' | 'completed' | 'stuck';
  lastActive: string;
  score?: number;
}

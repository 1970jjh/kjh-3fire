import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, push, update, remove } from 'firebase/database';
import { SessionConfig } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoGGT84cYnRk0NP7kfwtkHc121xZ4PBBI",
  authDomain: "kjh-3fire.firebaseapp.com",
  projectId: "kjh-3fire",
  storageBucket: "kjh-3fire.firebasestorage.app",
  messagingSenderId: "1000592652450",
  appId: "1:1000592652450:web:6f36c27f020a21147afffb",
  databaseURL: "https://kjh-3fire-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Session Reference
const sessionsRef = ref(database, 'sessions');

// Create or Update Session
export const createSession = async (sessionId: string, config: SessionConfig): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await set(sessionRef, {
    ...config,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
};

// Update Session Config
export const updateSession = async (sessionId: string, updates: Partial<SessionConfig>): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await update(sessionRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

// Delete Session
export const deleteSession = async (sessionId: string): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await remove(sessionRef);
};

// Subscribe to a specific session
export const subscribeToSession = (
  sessionId: string,
  callback: (config: SessionConfig | null) => void
): (() => void) => {
  const sessionRef = ref(database, `sessions/${sessionId}`);

  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        isOpen: data.isOpen || false,
        groupName: data.groupName || '',
        totalTeams: data.totalTeams || 6,
        currentStageIndex: data.currentStageIndex || 0
      });
    } else {
      callback(null);
    }
  });

  return () => off(sessionRef);
};

// Subscribe to all active sessions (for learner to see available groups)
export const subscribeToAllSessions = (
  callback: (sessions: Record<string, SessionConfig & { id: string }>) => void
): (() => void) => {
  const unsubscribe = onValue(sessionsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const sessions: Record<string, SessionConfig & { id: string }> = {};
      Object.keys(data).forEach(key => {
        if (data[key].isOpen) {
          sessions[key] = { ...data[key], id: key };
        }
      });
      callback(sessions);
    } else {
      callback({});
    }
  });

  return () => off(sessionsRef);
};

// Generate a simple session ID
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register learner to session
export const registerLearner = async (
  sessionId: string,
  learnerData: { name: string; teamId: number; groupName: string }
): Promise<string> => {
  const learnersRef = ref(database, `sessions/${sessionId}/learners`);
  const newLearnerRef = push(learnersRef);
  await set(newLearnerRef, {
    ...learnerData,
    joinedAt: Date.now(),
    currentStep: 'intro'
  });
  return newLearnerRef.key || '';
};

// Update learner progress
export const updateLearnerProgress = async (
  sessionId: string,
  learnerId: string,
  step: string
): Promise<void> => {
  const learnerRef = ref(database, `sessions/${sessionId}/learners/${learnerId}`);
  await update(learnerRef, {
    currentStep: step,
    lastActive: Date.now()
  });
};

// Subscribe to learners in a session (for admin dashboard)
export const subscribeToLearners = (
  sessionId: string,
  callback: (learners: Record<string, any>) => void
): (() => void) => {
  const learnersRef = ref(database, `sessions/${sessionId}/learners`);

  const unsubscribe = onValue(learnersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });

  return () => off(learnersRef);
};

export { database, app };

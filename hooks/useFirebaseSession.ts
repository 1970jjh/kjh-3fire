import { useState, useEffect, useCallback } from 'react';
import { SessionConfig } from '../types';
import {
  createSession,
  updateSession,
  deleteSession,
  subscribeToSession,
  subscribeToAllSessions,
  subscribeToLearners,
  generateSessionId,
  registerLearner,
  updateLearnerProgress
} from '../lib/firebase';

// Hook for Admin to manage multiple sessions
export const useAdminSessions = () => {
  const [sessions, setSessions] = useState<Record<string, SessionConfig & { id: string }>>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionLearners, setSelectedSessionLearners] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to all sessions
  useEffect(() => {
    const unsub = subscribeToAllSessions((data) => {
      setSessions(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Subscribe to selected session's learners
  useEffect(() => {
    if (!selectedSessionId) {
      setSelectedSessionLearners({});
      return;
    }

    const unsub = subscribeToLearners(selectedSessionId, (data) => {
      setSelectedSessionLearners(data);
    });

    return () => unsub();
  }, [selectedSessionId]);

  // Create new session
  const createNewSession = useCallback(async (config: SessionConfig) => {
    setLoading(true);
    setError(null);
    try {
      const newId = generateSessionId();
      await createSession(newId, config);
      return newId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update session
  const updateSessionConfig = useCallback(async (sessionId: string, updates: Partial<SessionConfig>) => {
    setError(null);
    try {
      await updateSession(sessionId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete session
  const removeSession = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      await deleteSession(sessionId);
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [selectedSessionId]);

  // Select a session to view details
  const selectSession = useCallback((sessionId: string | null) => {
    setSelectedSessionId(sessionId);
  }, []);

  return {
    sessions,
    selectedSessionId,
    selectedSession: selectedSessionId ? sessions[selectedSessionId] : null,
    selectedSessionLearners,
    loading,
    error,
    createNewSession,
    updateSessionConfig,
    removeSession,
    selectSession
  };
};

// Hook for Learner to join and participate in session
export const useLearnerSession = () => {
  const [availableSessions, setAvailableSessions] = useState<Record<string, SessionConfig & { id: string }>>({});
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [learnerId, setLearnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to all available sessions
  useEffect(() => {
    const unsub = subscribeToAllSessions((sessions) => {
      setAvailableSessions(sessions);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Subscribe to current session changes
  useEffect(() => {
    if (!currentSessionId) return;

    const unsub = subscribeToSession(currentSessionId, (config) => {
      setSessionConfig(config);
    });

    return () => unsub();
  }, [currentSessionId]);

  // Join a session
  const joinSession = useCallback(async (
    sessionId: string,
    learnerData: { name: string; teamId: number; groupName: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const id = await registerLearner(sessionId, learnerData);
      setCurrentSessionId(sessionId);
      setLearnerId(id);
      localStorage.setItem('learner_session_id', sessionId);
      localStorage.setItem('learner_id', id);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update progress
  const updateProgress = useCallback(async (step: string) => {
    if (!currentSessionId || !learnerId) return;
    try {
      await updateLearnerProgress(currentSessionId, learnerId, step);
    } catch (err: any) {
      console.error('Failed to update progress:', err);
    }
  }, [currentSessionId, learnerId]);

  // Leave session
  const leaveSession = useCallback(() => {
    setCurrentSessionId(null);
    setLearnerId(null);
    setSessionConfig(null);
    localStorage.removeItem('learner_session_id');
    localStorage.removeItem('learner_id');
  }, []);

  return {
    availableSessions,
    currentSessionId,
    sessionConfig,
    learnerId,
    loading,
    error,
    joinSession,
    updateProgress,
    leaveSession
  };
};

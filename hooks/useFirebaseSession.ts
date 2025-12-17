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

// Hook for Admin to manage session
export const useAdminSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    // Try to restore from localStorage
    return localStorage.getItem('admin_session_id');
  });
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [learners, setLearners] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to session changes
  useEffect(() => {
    if (!sessionId) return;

    const unsubSession = subscribeToSession(sessionId, (config) => {
      setSessionConfig(config);
    });

    const unsubLearners = subscribeToLearners(sessionId, (data) => {
      setLearners(data);
    });

    return () => {
      unsubSession();
      unsubLearners();
    };
  }, [sessionId]);

  // Create new session
  const createNewSession = useCallback(async (config: SessionConfig) => {
    setLoading(true);
    setError(null);
    try {
      const newId = generateSessionId();
      await createSession(newId, config);
      setSessionId(newId);
      localStorage.setItem('admin_session_id', newId);
      return newId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update session
  const updateSessionConfig = useCallback(async (updates: Partial<SessionConfig>) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await updateSession(sessionId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Close/Delete session
  const closeSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      await deleteSession(sessionId);
      setSessionId(null);
      setSessionConfig(null);
      localStorage.removeItem('admin_session_id');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return {
    sessionId,
    sessionConfig,
    learners,
    loading,
    error,
    createNewSession,
    updateSessionConfig,
    closeSession
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

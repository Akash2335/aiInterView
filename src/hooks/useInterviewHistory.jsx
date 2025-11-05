import { useState, useEffect, useCallback, useMemo } from 'react';

// Cache for localStorage data to avoid repeated parsing
const storageCache = new Map();

export const useInterviewHistory = (language, loadWhenComplete = false) => {
  const [history, setHistory] = useState([]);
  const [learningProgress, setLearningProgress] = useState({});

  // Memoized storage keys to prevent unnecessary changes
  const storageKey = useMemo(() => 'interviewHistory', []);
  const learningProgressKey = useMemo(() => 'learningProgress', []);

  // Optimized localStorage parsing with caching
  const getStoredHistory = useCallback(() => {
    if (storageCache.has(storageKey)) {
      return storageCache.get(storageKey);
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        storageCache.set(storageKey, []);
        return [];
      }

      const parsed = JSON.parse(saved);
      let result = [];

      if (Array.isArray(parsed)) {
        result = parsed;
      } else if (parsed?.data && Array.isArray(parsed.data)) {
        result = parsed.data;
      }

      storageCache.set(storageKey, result);
      return result;
    } catch (error) {
      console.error('Error parsing interview history:', error);
      storageCache.set(storageKey, []);
      return [];
    }
  }, [storageKey]);

  // Initialize history and learning progress from localStorage
  useEffect(() => {
    const storedHistory = getStoredHistory();
    setHistory(storedHistory);

    // Load learning progress
    try {
      const savedProgress = localStorage.getItem(learningProgressKey);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setLearningProgress(parsedProgress);
      }
    } catch (error) {
      console.error('Error parsing learning progress:', error);
      setLearningProgress({});
    }
  }, [getStoredHistory, learningProgressKey]);

  // Memoized history data getter
  const getHistoryData = useCallback(() => {
    return Array.isArray(history) ? history : [];
  }, [history]);

  // Memoized history length
  const historyLength = useMemo(() => {
    return getHistoryData().length;
  }, [getHistoryData]);

  // Optimized duplicate check using Set for O(1) lookup
  const createItemIdentifier = useCallback((item) => {
    return `${item.question}-${item.answer}`.toLowerCase();
  }, []);

  // Optimized add to history with batched updates
  const addToHistory = useCallback((item) => {
    setHistory(prev => {
      const currentData = Array.isArray(prev) ? prev : [];
      
      // Fast duplicate check
      const identifier = createItemIdentifier(item);
      const isDuplicate = currentData.some(existingItem => 
        createItemIdentifier(existingItem) === identifier
      );
      
      if (isDuplicate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Duplicate question found, skipping:', item.question);
        }
        return currentData;
      }
      
      // Limit history size to prevent memory issues
      const newHistory = [...currentData, item];
      return newHistory.slice(-1000); // Keep last 1000 items
    });
  }, [createItemIdentifier]);

  // Clear history with cache invalidation
  const clearHistory = useCallback(() => {
    setHistory([]);
    storageCache.delete(storageKey);
    localStorage.setItem(storageKey, JSON.stringify([]));
  }, [storageKey]);

  // Memoized score calculation function
  const calculateOverallScore = useCallback(() => {
    const historyData = getHistoryData();
    if (historyData.length === 0) return 0;

    let total = 0;
    let validScores = 0;

    for (const item of historyData) {
      const score = item.performanceScore;
      if (typeof score === 'number' && score >= 0 && score <= 10) {
        total += score;
        validScores++;
      }
    }

    if (validScores === 0) return 0;

    const average = total / validScores;
    return Math.min(10, Math.max(0, Math.round(average * 10) / 10));
  }, [getHistoryData]);

  // Memoized total duration calculation
  const getTotalDuration = useCallback(() => {
    const historyData = getHistoryData();
    let total = 0;
    
    for (const item of historyData) {
      total += item.duration || 0;
    }
    
    return total;
  }, [getHistoryData]);

  // Debounced localStorage saving
  useEffect(() => {
    const historyData = getHistoryData();
    
    if (historyData.length > 0) {
      storageCache.set(storageKey, historyData);
      localStorage.setItem(storageKey, JSON.stringify(historyData));
    } else {
      storageCache.set(storageKey, []);
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
  }, [history, storageKey, getHistoryData]);

  // Optimized duplicate removal
  const removeDuplicates = useCallback(() => {
    setHistory(prev => {
      const currentData = Array.isArray(prev) ? prev : [];
      const seen = new Set();
      const uniqueItems = [];

      for (const item of currentData) {
        const identifier = createItemIdentifier(item);
        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueItems.push(item);
        }
      }

      return uniqueItems;
    });
  }, [createItemIdentifier]);

  // Generate session ID (memoized factory)
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }, []);

  // Additional optimization: Get history by language filter
  const getHistoryByLanguage = useCallback((targetLanguage) => {
    const historyData = getHistoryData();
    if (!targetLanguage) return historyData;
    
    return historyData.filter(item => item.language === targetLanguage);
  }, [getHistoryData]);

  // Batch add multiple items
  const batchAddToHistory = useCallback((items) => {
    if (!Array.isArray(items)) return;

    setHistory(prev => {
      const currentData = Array.isArray(prev) ? prev : [];
      const seen = new Set(currentData.map(createItemIdentifier));
      const newItems = [];

      for (const item of items) {
        const identifier = createItemIdentifier(item);
        if (!seen.has(identifier)) {
          seen.add(identifier);
          newItems.push(item);
        }
      }

      if (newItems.length === 0) return currentData;

      const updatedHistory = [...currentData, ...newItems];
      return updatedHistory.slice(-1000); // Keep last 1000 items
    });
  }, [createItemIdentifier]);

  // Learning progress management
  const getLearningProgress = useCallback((lang) => {
    return learningProgress[lang] || { lastQuestionIndex: 0, lastUpdated: null };
  }, [learningProgress]);

  const updateLearningProgress = useCallback((lang, questionIndex) => {
    setLearningProgress(prev => {
      const updated = {
        ...prev,
        [lang]: {
          lastQuestionIndex: questionIndex,
          lastUpdated: new Date().toISOString()
        }
      };
      localStorage.setItem(learningProgressKey, JSON.stringify(updated));
      return updated;
    });
  }, [learningProgressKey]);

  const resetLearningProgress = useCallback((lang) => {
    setLearningProgress(prev => {
      const updated = { ...prev };
      delete updated[lang];
      localStorage.setItem(learningProgressKey, JSON.stringify(updated));
      return updated;
    });
  }, [learningProgressKey]);

  const clearAllLearningProgress = useCallback(() => {
    setLearningProgress({});
    localStorage.removeItem(learningProgressKey);
  }, [learningProgressKey]);

  return {
    history: getHistoryData(),
    historyLength,
    addToHistory,
    batchAddToHistory,
    clearHistory,
    calculateOverallScore,
    getTotalDuration,
    removeDuplicates,
    generateSessionId,
    getHistoryByLanguage,
    // Learning progress methods
    getLearningProgress,
    updateLearningProgress,
    resetLearningProgress,
    clearAllLearningProgress
  };
};

export default useInterviewHistory;
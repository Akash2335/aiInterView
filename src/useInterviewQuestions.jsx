import { useState, useEffect, useRef } from 'react';

// Cache for storing loaded questions to prevent redundant fetches
const questionsCache = new Map();

// Pre-defined fallback questions to avoid runtime computation
const FALLBACK_QUESTIONS = {
  c: [
    {
      id: 1,
      question: "What is the difference between `==` and `.Equals()` in C#?",
      category: "csharp",
      answer: "`==` is an operator that compares references for reference types and values for value types. `.Equals()` is a virtual method that typically compares values."
    },
    {
      id: 2,
      question: "Explain boxing and unboxing with examples.",
      category: "csharp",
      answer: "Boxing is converting a value type to object type (heap allocation). Unboxing is converting object type back to value type."
    }
  ],
  react: [
    {
      id: 1,
      question: "What is the difference between state and props?",
      category: "react",
      answer: "State is internal mutable data, props are external immutable data passed from parent components."
    }
  ],
  javascript: [
    {
      id: 1,
      question: "What is the difference between let, const, and var?",
      category: "javascript",
      answer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned."
    }
  ],
  python: [
    {
      id: 1,
      question: "What are Python decorators and how do you use them?",
      category: "python",
      answer: "Decorators are functions that modify the behavior of other functions without changing their code."
    }
  ]
};

// Default fallback for unknown languages
const DEFAULT_FALLBACK = [];

/**
 * Optimized hook for loading interview questions with caching and error handling
 * @param {string} language - Programming language for questions
 * @returns {Array} Array of questions
 */
const useInterviewQuestions = (language = 'c') => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const languageRef = useRef(language);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Skip if language hasn't changed and we already have questions
    if (languageRef.current === language && questions.length > 0) {
      setLoading(false);
      return;
    }

    languageRef.current = language;
    
    const loadQuestions = async () => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        const cacheKey = `${language}-questions`;
        if (questionsCache.has(cacheKey)) {
          const cachedQuestions = questionsCache.get(cacheKey);
          setQuestions(cachedQuestions);
          setLoading(false);
          return;
        }

        const startTime = performance.now();
        
        const response = await fetch(`/questions/${language}.json`, {
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=300' // 5 minutes cache
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const loadTime = performance.now() - startTime;

        // Handle different JSON structures efficiently
        const questionsArray = Array.isArray(data) 
          ? data 
          : (Array.isArray(data.data) ? data.data : []);

        if (questionsArray.length > 0) {
          // Validate question structure
          const validQuestions = questionsArray.filter(q => 
            q && typeof q === 'object' && q.id && q.question && q.answer
          );

          if (validQuestions.length !== questionsArray.length) {
            console.warn(`Some questions for ${language} have invalid structure`);
          }

          setQuestions(validQuestions);
          questionsCache.set(cacheKey, validQuestions);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Loaded ${validQuestions.length} ${language} questions in ${loadTime.toFixed(1)}ms`);
          }
        } else {
          throw new Error('No valid questions found in response');
        }

      } catch (error) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
          return;
        }

        console.error(`❌ Error loading ${language} questions:`, error);
        setError(error.message);
        
        // Use fallback questions
        const fallbackQuestions = FALLBACK_QUESTIONS[language] || DEFAULT_FALLBACK;
        setQuestions(fallbackQuestions);
        
        // Cache fallback to prevent repeated errors
        questionsCache.set(`${language}-questions`, fallbackQuestions);
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };

    loadQuestions();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [language, questions.length]); // Added questions.length to dependency array

  // Return questions array directly for backward compatibility
  return questions;
};

// Named export for additional functionality
export const useInterviewQuestionsWithState = (language = 'c') => {
  const questions = useInterviewQuestions(language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // You could add additional state management here if needed
  return { questions, loading, error };
};

// Utility function to preload questions
export const preloadQuestions = async (language) => {
  const cacheKey = `${language}-questions`;
  
  if (questionsCache.has(cacheKey)) {
    return questionsCache.get(cacheKey);
  }

  try {
    const response = await fetch(`/questions/${language}.json`);
    if (!response.ok) throw new Error('Failed to load');
    
    const data = await response.json();
    const questionsArray = Array.isArray(data) ? data : (data.data || []);
    
    questionsCache.set(cacheKey, questionsArray);
    return questionsArray;
  } catch (error) {
    console.warn(`Preload failed for ${language}:`, error);
    return FALLBACK_QUESTIONS[language] || DEFAULT_FALLBACK;
  }
};

// Utility function to clear cache
export const clearQuestionsCache = () => {
  questionsCache.clear();
};

// Utility function to get cache stats
export const getCacheStats = () => {
  return {
    size: questionsCache.size,
    keys: Array.from(questionsCache.keys())
  };
};

export default useInterviewQuestions;
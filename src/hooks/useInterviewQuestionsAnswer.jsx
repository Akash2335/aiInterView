import { useState, useEffect } from 'react';

export const useInterviewQuestionsAnswer = (language) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/questions/${language}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle both direct array and { data: [] } formats
        if (Array.isArray(data)) {
          setQuestions(data);
        } else if (data && Array.isArray(data.data)) {
          setQuestions(data.data);
        } else {
          throw new Error('Invalid data format: expected array or { data: [] }');
        }
        
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (language) {
      loadQuestions();
    }
  }, [language]);

  // Get all questions
  const getAllQuestions = () => {
    return questions;
  };

  // Get questions by category
  const getQuestionsByCategory = (category) => {
    return questions.filter(q => q.category === category);
  };

  // Get questions by difficulty
  const getQuestionsByDifficulty = (difficulty) => {
    return questions.filter(q => q.difficulty === difficulty);
  };

  // Get unique categories
  const getCategories = () => {
    return [...new Set(questions.map(q => q.category))].filter(Boolean);
  };

  // Get unique difficulties
  const getDifficulties = () => {
    return [...new Set(questions.map(q => q.difficulty))].filter(Boolean);
  };

  // Get question by ID
  const getQuestionById = (id) => {
    return questions.find(q => q.id === id);
  };

  // Search questions by text, tags, or category
  const searchQuestions = (searchTerm) => {
    if (!searchTerm) return questions;
    
    const term = searchTerm.toLowerCase();
    return questions.filter(q => 
      q.question.toLowerCase().includes(term) ||
      (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term))) ||
      q.category.toLowerCase().includes(term) ||
      q.difficulty.toLowerCase().includes(term) ||
      (q.answer && q.answer.toLowerCase().includes(term))
    );
  };

  // Get random question
  const getRandomQuestion = () => {
    if (questions.length === 0) return null;
    return questions[Math.floor(Math.random() * questions.length)];
  };

  // Get questions count
  const getQuestionsCount = () => {
    return questions.length;
  };

  return {
    questions,
    loading,
    error,
    getAllQuestions,
    getQuestionsByCategory,
    getQuestionsByDifficulty,
    getCategories,
    getDifficulties,
    getQuestionById,
    searchQuestions,
    getRandomQuestion,
    getQuestionsCount
  };
};

export default useInterviewQuestionsAnswer;
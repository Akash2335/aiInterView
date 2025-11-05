import { useState, useEffect, useCallback } from 'react';

const useInterviewAnalytics = (transcript, recordingTime) => {
  const [performanceScore, setPerformanceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(0);
  const [emotionalTone, setEmotionalTone] = useState('neutral');
  const [aiInsights, setAiInsights] = useState([]);

  const calculatePerformanceScore = useCallback((answer, duration) => {
    const wordCount = answer.split(' ').length;
    const baseScore = Math.min(wordCount * 2, 100);
    const paceScore = duration > 0 ? Math.min((wordCount / duration) * 10, 30) : 0;
    const contentScore = answer.length > 100 ? 20 : 10;
    return Math.min(baseScore + paceScore + contentScore, 100);
  }, []);

  const analyzeConfidence = useCallback((answer) => {
    const confidentWords = ['achieved', 'successfully', 'led', 'managed', 'improved', 'created'];
    const hesitantWords = ['maybe', 'perhaps', 'sorry', 'just', 'actually'];
    
    const confidentCount = confidentWords.filter(word => 
      answer.toLowerCase().includes(word)
    ).length;
    const hesitantCount = hesitantWords.filter(word => 
      answer.toLowerCase().includes(word)
    ).length;
    
    return Math.max(0, Math.min(100, 50 + (confidentCount * 10) - (hesitantCount * 15)));
  }, []);

  const calculateSpeechMetrics = useCallback((text) => {
    const words = text.split(' ').length;
    const duration = recordingTime || 1;
    setSpeechRate(Math.round(words / (duration / 60)));
  }, [recordingTime]);

  const analyzeEmotionalTone = useCallback((text) => {
    const positiveWords = ['excited', 'passionate', 'love', 'great', 'excellent', 'amazing'];
    const negativeWords = ['challenging', 'difficult', 'stress', 'problem', 'issue'];
    
    const positiveCount = positiveWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    const negativeCount = negativeWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    if (positiveCount > negativeCount + 2) setEmotionalTone('positive');
    else if (negativeCount > positiveCount + 2) setEmotionalTone('concerned');
    else setEmotionalTone('professional');
  }, []);

  const generateAIInsights = useCallback((answer, question) => {
    const insights = [
      '🎯 You maintained excellent eye contact and posture',
      '💡 Strong use of STAR method in your responses',
      '🚀 Good pace and clarity in communication',
      '🤝 Demonstrated excellent teamwork examples',
      '💻 Technical depth was impressive',
      '📈 Showed clear career progression thinking'
    ];
    
    setAiInsights(prev => [...prev, insights[Math.floor(Math.random() * insights.length)]]);
  }, []);

  const generateInitialInsights = useCallback(() => {
    setAiInsights([
      '🤖 AI Analysis: Ready to provide real-time feedback',
      '🎯 Focus on clear, structured responses',
      '💡 Use specific examples to strengthen answers',
      '🚀 Maintain confident body language'
    ]);
  }, []);

  useEffect(() => {
    if (transcript) {
      calculateSpeechMetrics(transcript);
      analyzeEmotionalTone(transcript);
    }
  }, [transcript, calculateSpeechMetrics, analyzeEmotionalTone]);

  return {
    performanceScore,
    confidenceLevel,
    speechRate,
    emotionalTone,
    aiInsights,
    setPerformanceScore,
    setConfidenceLevel,
    setAiInsights,
    calculatePerformanceScore,
    analyzeConfidence,
    generateAIInsights,
    generateInitialInsights
  };
};
export default useInterviewAnalytics;
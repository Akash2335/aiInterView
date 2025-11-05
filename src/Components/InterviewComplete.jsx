import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileArchive, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import UltimateJsonViewer from './UltimateJsonViewer';
import { populateInterviewHistory } from '../simulateInterview';

const InterviewComplete = ({ 
  history = [], 
  exportJSON = () => console.log('Export JSON clicked'), 
  exportPDF = () => console.log('Export PDF clicked'), 
  reset = () => console.log('Reset clicked'), 
  param = 'csharp',
  calculateOverallScore 
}) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);

  // Memoized duplicate removal and score calculation
  // In your InterviewComplete component, update the score calculation:

const { uniqueHistory, overallScore, duplicatesCount } = useMemo(() => {
  const safeHistory = Array.isArray(history) ? history : [];
  
  if (safeHistory.length === 0) {
    return { uniqueHistory: [], overallScore: 0, duplicatesCount: 0 };
  }

  const seen = new Set();
  const filtered = [];
  let totalScore = 0;
  let validScoresCount = 0;

  for (const item of safeHistory) {
    if (!item || typeof item !== 'object') continue;
    
    const question = String(item.question || '').trim().toLowerCase();
    const answer = String(item.answer || '').trim().toLowerCase();
    const identifier = `${question}-${answer}`;
    
    if (seen.has(identifier)) continue;
    
    seen.add(identifier);
    filtered.push(item);

    // FIX: Check for performanceScore and ensure it's a valid number
    const score = item.performanceScore;

    if (typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100) {
      totalScore += score;
      validScoresCount++;
    }
  }

  const averageScore = validScoresCount > 0
    ? Math.round((totalScore / validScoresCount) * 10) / 10  // Round to 1 decimal
    : 0;

  return {
    uniqueHistory: filtered,
    overallScore: averageScore,
    duplicatesCount: safeHistory.length - filtered.length
  };
}, [history]);
  
  // Simulate loading for better UX and populate sample data if needed
  useEffect(() => {
    // Populate sample interview history if empty (for demo purposes)
    const existingData = localStorage.getItem('interviewHistory');
    if (!existingData || existingData === '[]') {
      populateInterviewHistory(true);
    }

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Memoized utility functions
const formatScore = useCallback((score) => {
  if (typeof score !== 'number') return 'N/A';
  // Round to 1 decimal place and ensure it's a clean number
  const rounded = Math.round(score * 10) / 10;
  return `${rounded}/10`;
}, []);
  
  const getScoreColor = useCallback((score) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }, []);

  const getItemScoreColor = useCallback((score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }, []);

  // Handler functions
  const handleExportJSON = useCallback(() => {
    exportJSON(uniqueHistory);
  }, [exportJSON, uniqueHistory]);

  const handleShowAnswers = useCallback(() => {
    setShowAnswers(true);
  }, []);

  const handleBackToResults = useCallback(() => {
    setShowAnswers(false);
  }, []);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Processing your results...</p>
        </motion.div>
      </div>
    );
  }

  if (showAnswers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToResults}
            className="flex items-center gap-2 mb-6 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
          >
            <ArrowLeft size={18} />
            Back to Results
          </motion.button>
          <UltimateJsonViewer language={param} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              Interview Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-lg"
            >
              Great job completing the interview session
            </motion.p>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {uniqueHistory.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  Questions Answered
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`px-6 py-4 rounded-xl border ${getScoreColor(overallScore)}`}>
                <div className="text-3xl font-bold">
                  {formatScore(overallScore)}
                </div>
                <div className="text-sm mt-1">Overall Score</div>
              </div>
            </div>

            {duplicatesCount > 0 && (
              <div className="text-center">
                <div className="bg-amber-50 dark:bg-amber-900/30 px-6 py-4 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="text-3xl font-bold text-amber-600 dark:amber-400">
                    {duplicatesCount}
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                    Duplicates Cleaned
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportJSON}
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
            >
              <FileText size={20} />
              Export JSON
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportPDF}
              className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
            >
              <FileArchive size={20} />
              Export PDF
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowAnswers}
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
            >
              <FileText size={20} />
              View All Questions
            </motion.button>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Interview History
          </h3>
          
          {uniqueHistory.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No interview history available
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Complete an interview to see your results here
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {uniqueHistory.map((item, idx) => (
                  <motion.div
                    key={`${item.id || idx}-${item.question}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-white text-lg mb-2 line-clamp-2">
                          {item.question || 'No question text'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {item.answer || 'No answer provided'}
                        </p>
                      </div>
                      {item.performanceScore !== undefined && item.performanceScore !== null && (
                        <div className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${getItemScoreColor(item.performanceScore)}`}>
                          {formatScore(item.performanceScore)}
                        </div>
                      )}
                    </div>
                    
                    {item.feedback && (
                      <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          <span className="font-semibold">💡 AI Feedback:</span> {item.feedback}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        >
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-3 mx-auto bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
            >
              <RefreshCw size={20} />
              Start New Interview
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InterviewComplete;
// src/components/ModernQADisplay.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Brain, User, Bot, Target, Clock, TrendingUp, MessageSquare, Sparkles, Play, Pause, Copy, Share2, Zap, Eye, EyeOff 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ModernQADisplay = ({
  currentQuestion,
  userAnswer,
  transcript,
  isRecording,
  recordingTime,
  performanceScore,
  onPlayQuestion,
  onPlayAnswer,
  className = ''
}) => {
  const [isAnswerPlaying, setIsAnswerPlaying] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const speakingRef = useRef(null);

  // Metrics
  const wordCount = useMemo(() => userAnswer?.split(' ').length || 0, [userAnswer]);
  const answerDuration = recordingTime || 0;
  const wordsPerMinute = useMemo(() => answerDuration > 0 ? Math.round((wordCount / answerDuration) * 60) : 0, [wordCount, answerDuration]);

  // Speech synthesis
  const speakText = (text, type) => {
    if (!text) return;
    if (speakingRef.current === type) {
      window.speechSynthesis.cancel();
      speakingRef.current = null;
      type === 'question' ? setIsQuestionPlaying(false) : setIsAnswerPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => {
      speakingRef.current = type;
      type === 'question' ? setIsQuestionPlaying(true) : setIsAnswerPlaying(true);
    };
    utterance.onend = () => {
      speakingRef.current = null;
      setIsQuestionPlaying(false);
      setIsAnswerPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
    type === 'question' ? onPlayQuestion?.() : onPlayAnswer?.();
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch {
      toast.error('Copy failed!');
    }
  };

  const shareQA = async () => {
    const shareData = { title: 'Interview Q&A', text: `Q: ${currentQuestion}\nA: ${userAnswer || transcript}` };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await copyToClipboard(`${currentQuestion}\n\n${userAnswer || transcript}`, 'Q&A');
      toast.success('Shared successfully!');
    } catch {}
  };

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white/90 to-blue-50/80 dark:from-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
              Q&A Session
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Real-time interview dialogue
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowAnalysis(!showAnalysis)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20 hover:bg-white/70 transition"
          >
            {showAnalysis ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>
          <motion.button
            onClick={shareQA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20 hover:bg-white/70 transition"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Question */}
        <motion.div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-6 border border-blue-200/30 dark:border-blue-400/20 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  AI Interviewer
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-green-500 rounded-full"/>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Asking the question</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button onClick={() => copyToClipboard(currentQuestion, 'Question')} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className="p-2 bg-white dark:bg-gray-600 rounded-lg border hover:bg-gray-50">
                <Copy className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={() => speakText(currentQuestion, 'question')} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className={`p-2 rounded-lg border flex items-center gap-2 ${isQuestionPlaying ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-900/30' : 'bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900/30 hover:bg-blue-200'}`}>
                {isQuestionPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              </motion.button>
            </div>
          </div>
          <p className="pl-8 text-gray-800 dark:text-gray-200 text-lg">{currentQuestion || 'Waiting for question...'}</p>
          {isRecording && <motion.div className="pl-8 flex items-center gap-2 mt-2 text-orange-600 dark:text-orange-400 animate-pulse">● Listening...</motion.div>}
        </motion.div>

        {/* Answer */}
        <motion.div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-6 border border-green-200/30 dark:border-green-400/20 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-600 dark:text-green-400"/>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  Your Response {userAnswer && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Submitted</span>}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{userAnswer ? 'Answer recorded' : 'Speak your answer'}</p>
              </div>
            </div>
            {userAnswer && <div className="flex gap-2">
              <motion.button onClick={() => copyToClipboard(userAnswer, 'Answer')} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className="p-2 bg-white dark:bg-gray-600 rounded-lg border hover:bg-gray-50"><Copy className="w-4 h-4"/></motion.button>
              <motion.button onClick={() => speakText(userAnswer, 'answer')} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className={`p-2 rounded-lg border flex items-center gap-2 ${isAnswerPlaying ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-900/30' : 'bg-green-100 border-green-300 text-green-600 dark:bg-green-900/30 hover:bg-green-200'}`}>
                {isAnswerPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              </motion.button>
            </div>}
          </div>
          {userAnswer ? <p className="pl-8 text-gray-800 dark:text-gray-200 text-lg bg-green-50/50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800">{userAnswer}</p> :
          <p className="pl-8 text-gray-600 dark:text-gray-400 text-center py-6">{isRecording ? 'Speak now...' : 'Click start to answer.'}</p>}
        </motion.div>

        {/* Performance */}
        <AnimatePresence>
          {showAnalysis && (userAnswer || transcript) && (
            <motion.div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-200/30 dark:border-purple-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">AI Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time performance metrics</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{performanceScore || '--'}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-center gap-1"><Target className="w-3 h-3"/> Score</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{wordCount}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-center gap-1"><MessageSquare className="w-3 h-3"/> Words</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{answerDuration}s</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-center gap-1"><Clock className="w-3 h-3"/> Duration</div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-white/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wordsPerMinute}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-center gap-1"><TrendingUp className="w-3 h-3"/> WPM</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ModernQADisplay;

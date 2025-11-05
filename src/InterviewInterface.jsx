import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Hooks
import useInterviewQuestions from './useInterviewQuestions';
import useInterviewAnalytics from './hooks/useInterviewAnalytics';
import useInterviewHistory from './hooks/useInterviewHistory';
import useSpeechRecognition from './hooks/useSpeechRecognition';

// Components
import CameraRecorder from './CameraRecorder';
import DraggableCamera from './DraggableCamera';
import ProgressBar from './Components/ProgressBar';
import Microphone from './Components/Microphone';
import InterviewComplete from './Components/InterviewComplete';
import TranscriptDisplay from './Components/TranscriptDisplay';
import AIFeedback from './Components/AIFeedback';
import QuestionPanel from './Components/Question/QuestionPanel';
import ControlButtons from './Components/InterviewControls/ControlButtons';
import KeyboardShortcuts from './Components/UI/KeyboardShortcuts';
import AnalyticsDashboard from './Components/Analytics/AnalyticsDashboard';
import AICorner from './Components/UI/AICorner';
import { DarkModeContext } from './App';

// Utils
import { exportJSON, exportPDF } from './utils/exportUtils';
import { shouldAskFollowUp, pickFollowUp, generateAdvancedFeedback } from './utils/questionUtils';
import { speakWithEmotion, speak, initializeAudioAnalysis } from './utils/speechUtils';

const InterviewInterface = () => {
  const { language, mode } = useParams();
  const { darkMode } = useContext(DarkModeContext);

  // ----------------- STATE -----------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoURL, setVideoURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [isAnswerStart, setIsAnswerStart] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState([]); // Store answers during interview
  const [nextQuestionAlreadySpoken, setNextQuestionAlreadySpoken] = useState(false); // Track if next question was already spoken

  // Combined camera state
  const [cameraState, setCameraState] = useState({
    isCameraOn: false,
    isRecording: false,
    videoURL: null,
    showPreview: false
  });

  const timerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // ----------------- MEMOIZED VALUES (needed before hooks) -----------------
  const isLearningMode = useMemo(() => mode === 'learn', [mode]);

  // ----------------- CUSTOM HOOKS -----------------
  const baseQuestions = useInterviewQuestions(language);

  // Load interview history when interview is complete OR in learning mode (for progress tracking)
  const interviewHistory = useInterviewHistory(language, interviewComplete || isLearningMode);
  const {
    history,
    addToHistory,
    clearHistory,
    calculateOverallScore,
    getTotalDuration,
    batchAddToHistory,
    getLearningProgress,
    updateLearningProgress
  } = interviewHistory;
  
  const {
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
  } = useInterviewAnalytics(transcript, recordingTime);

  // ----------------- MEMOIZED VALUES -----------------
  const questions = useMemo(() => baseQuestions || [], [baseQuestions]);
  const currentQuestion = useMemo(() => questions[currentIndex] || {}, [questions, currentIndex]);
  const isInterviewComplete = useMemo(() => currentIndex >= questions.length, [currentIndex, questions.length]);

  // ----------------- EFFECT: Save all answers when interview completes -----------------
  useEffect(() => {
    if (isInterviewComplete && !interviewComplete) {
      setInterviewComplete(true);
      if (sessionAnswers.length > 0) {
        // Batch add all session answers to history
        if (batchAddToHistory) {
          batchAddToHistory(sessionAnswers);
        } else {
          // Fallback: add individually
          sessionAnswers.forEach(answer => addToHistory(answer));
        }
        toast.success('🎉 Interview Complete! Saving your results...');
      } else {
        toast.success('🎉 Interview Complete!');
      }
    }
  }, [isInterviewComplete, sessionAnswers, interviewComplete, batchAddToHistory, addToHistory]);

  // ----------------- SPEECH RECOGNITION -----------------
  const handleTranscriptUpdate = useCallback((newTranscript) => {
    setTranscript(newTranscript);
    finalTranscriptRef.current = newTranscript;
    if (newTranscript.trim()) setHasSpoken(true);
  }, []);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const answer = finalTranscriptRef.current?.trim();

    // In learn mode, allow proceeding without speech
    if (!isLearningMode && !answer) return toast.error('🎤 Please speak your answer before submitting!');

    const currentQuestionText = currentQuestion?.question || '';
    const feedback = isLearningMode && !answer
      ? 'Learning mode: No speech provided - reviewing question and answer.'
      : generateAdvancedFeedback(answer, currentQuestionText);

    // Batch state updates
    const newPerformanceScore = isLearningMode && !answer ? 0 : calculatePerformanceScore(answer, recordingTime);
    const newConfidenceLevel = isLearningMode && !answer ? 0 : analyzeConfidence(answer);

    setAiFeedback(feedback);
    setPerformanceScore(newPerformanceScore);
    setConfidenceLevel(newConfidenceLevel);

    // Store answer in session (not in history yet)
    const answerData = {
      question: currentQuestionText,
      answer: answer || '(No speech - learning mode)',
      feedback,
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      performanceScore: newPerformanceScore,
      confidenceLevel: newConfidenceLevel,
      emotionalTone,
      wordCount: answer ? answer.split(' ').length : 0,
      language
    };

    setSessionAnswers(prev => [...prev, answerData]);

    // Non-blocking operations
    if (answer) {
      Promise.resolve().then(() => {
        generateAIInsights(answer, currentQuestionText);
      });
    }

    // Reset states
    setTranscript('');
    setRecordingTime(0);
    setIsAnswerStart(false);
    setHasSpoken(false);

    // In learning mode, update progress after answering
    if (isLearningMode && updateLearningProgress) {
      updateLearningProgress(language, currentIndex + 1);
    }

    setTimeout(() => moveToNext(answer), 2000);
  }, [
    currentQuestion,
    recordingTime,
    emotionalTone,
    isLearningMode,
    calculatePerformanceScore,
    analyzeConfidence,
    generateAIInsights,
    setPerformanceScore,
    setConfidenceLevel
  ]);

  const { startListening, stopListening } = useSpeechRecognition(handleTranscriptUpdate, handleStopListening);

  // ----------------- INITIALIZATION -----------------
  useEffect(() => {
    if (questions.length > 0) {
      // In learning mode, resume from stored progress
      if (isLearningMode && getLearningProgress) {
        const progress = getLearningProgress(language);
        if (progress && progress.lastQuestionIndex > 0) {
          setCurrentIndex(progress.lastQuestionIndex);
          toast.success(`📚 Resuming from Question ${progress.lastQuestionIndex + 1}`);
        }
      }

      const initTimer = setTimeout(() => {
        setLoading(false);
        generateInitialInsights();
      }, 500);

      return () => clearTimeout(initTimer);
    }
  }, [questions.length, generateInitialInsights, isLearningMode, getLearningProgress, language]);

  // ----------------- HANDLERS -----------------
  const handleStartListening = useCallback(() => {
    if (!questions.length) return toast.error('🤖 AI is still preparing your questions...');
    
    const started = startListening();
    if (started) {
      setIsListening(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
      initializeAudioAnalysis();
    }
  }, [questions.length, startListening]);

  const handleStartAnswer = useCallback(() => {
    if (!isLearningMode && !recording && !videoURL) return toast.error('🎥 Please start camera recording first!');

    setIsAnswerStart(true);
    const questionText = currentQuestion?.question || '';

    if (!questionText) return handleStartListening();

    // Reset the flag for new question
    setNextQuestionAlreadySpoken(false);

    // In learning mode, skip speaking the question
    if (!isLearningMode) {
      // Randomly decide to speak single question or multiple questions
      const speakMultiple = Math.random() > 0.5; // 50% chance for multiple
      let textToSpeak = questionText;
      let estimatedSpeechTime = Math.max(questionText.split(' ').length * 500, 1000);

      if (speakMultiple && currentIndex < questions.length - 1) {
        // Speak current and next question
        const nextQuestion = questions[currentIndex + 1]?.question || '';
        if (nextQuestion) {
          textToSpeak = `${questionText}. Next question: ${nextQuestion}`;
          estimatedSpeechTime = Math.max((questionText + nextQuestion).split(' ').length * 500, 2000);
          setNextQuestionAlreadySpoken(true); // Mark that next question was already spoken
        }
      }

      // Speak question(s) and start listening after estimated time
      speak(textToSpeak);
      const listenTimer = setTimeout(() => {
        if (!isListening) handleStartListening();
      }, estimatedSpeechTime);

      return () => clearTimeout(listenTimer);
    } else {
      // In learning mode, start listening immediately without speaking
      if (!isListening) handleStartListening();
    }
  }, [recording, videoURL, currentQuestion, handleStartListening, isListening, questions, currentIndex, isLearningMode]);

  const moveToNext = useCallback((answer) => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      setCameraState(prev => ({ ...prev, isCameraOn: false }));
      speak('Congratulations! You have completed the interview successfully.');
      setCurrentIndex(nextIndex);
      return;
    }

    let newQuestions = [...questions];
    const currentQ = questions[currentIndex];
    const followUps = currentQ.followUps || [];

    if (shouldAskFollowUp(answer) && followUps.length) {
      const followUp = pickFollowUp(answer, followUps);
      newQuestions = [
        ...questions.slice(0, currentIndex + 1),
        { question: followUp, category: 'Follow-up', isFollowUp: true },
        ...questions.slice(currentIndex + 1)
      ];
      toast.success('🔍 AI generated a follow-up question!');
      setNextQuestionAlreadySpoken(false); // Reset flag since follow-up is a new question
    }

    setCurrentIndex(nextIndex);

    // Only speak the next question if it wasn't already spoken in the multiple question mode
    if (!nextQuestionAlreadySpoken) {
      speakWithEmotion(newQuestions[nextIndex]?.question || '');
    }
  }, [currentIndex, questions, nextQuestionAlreadySpoken]);

  const resetInterview = useCallback(() => {
    // Cleanup resources
    if (videoURL) URL.revokeObjectURL(videoURL);
    if (timerRef.current) clearInterval(timerRef.current);
    
    window.speechSynthesis.cancel();
    stopListening();

    // Reset states
    setTranscript('');
    setAiFeedback('');
    setCurrentIndex(0);
    setRecordingTime(0);
    setVideoURL(null);
    setIsAnswerStart(false);
    setIsListening(false);
    setPerformanceScore(0);
    setConfidenceLevel(0);
    setAiInsights([]);
    setInterviewComplete(false); // Reset interview complete flag
    setSessionAnswers([]); // Clear session answers
    setNextQuestionAlreadySpoken(false); // Reset the flag
    setCameraState({
      isCameraOn: false,
      isRecording: false,
      videoURL: null,
      showPreview: false
    });

    if (interviewComplete) {
      clearHistory();
    }
    toast.success('🔄 Interview reset!');
  }, [videoURL, stopListening, setPerformanceScore, setConfidenceLevel, setAiInsights, clearHistory, interviewComplete]);

  const handleVideoData = useCallback((blob) => {
    if (videoURL) URL.revokeObjectURL(videoURL);
    const url = URL.createObjectURL(blob);
    setVideoURL(url);
    toast.success('📹 Video recorded successfully!');
  }, [videoURL]);

  const toggleAnalytics = useCallback(() => {
    setShowAnalytics(prev => !prev);
  }, []);

  const closeKeyboardShortcuts = useCallback(() => {
    setKeyboardShortcuts(false);
  }, []);

  // ----------------- CLEANUP -----------------
  useEffect(() => {
    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL);
      stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, [videoURL, stopListening]);

  // ----------------- RENDER -----------------\
  // Loading Screen Spinner 
if (loading) {
  const loadingBg = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
    : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50';
  
  return (
    <div className={`min-h-screen ${loadingBg} flex items-center justify-center p-4`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center flex flex-col items-center justify-center"
      >
        <div className="relative mb-6">
          {/* Spinner */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          {/* Crown positioned absolutely in the center of the spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
        >
          Initializing AI-Powered Interview...
        </motion.p>
        
        {/* Loading dots */}
        <motion.div className="flex space-x-1 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Analytics Dashboard - Only show when interview is complete */}
      {isInterviewComplete && interviewComplete && (
        <AnalyticsDashboard
          showAnalytics={showAnalytics}
          overallScore={calculateOverallScore()}
          confidenceLevel={confidenceLevel}
          speechRate={speechRate}
          historyLength={history.length}
          aiInsights={aiInsights}
          onToggleAnalytics={toggleAnalytics}
        />
      )}

      {/* Progress Bar */}
      <AnimatePresence mode="wait">
        {questions.length > 0 && !isInterviewComplete && (
          <ProgressBar currentIndex={currentIndex} questions={questions} />
        )}
      </AnimatePresence>

      {/* Main Interview Content */}
      <AnimatePresence mode="wait">
        {!isInterviewComplete ? (
          <div className="flex flex-col xl:flex-row gap-8 mt-8">
            {/* Question Panel */}
            <div className="flex-1">
              <QuestionPanel
                question={currentQuestion.question}
                // lang={currentQuestion.lang}
                category={currentQuestion.category}
                answer={currentQuestion.answer}
                isLearningMode={isLearningMode}
                isFollowUp={currentQuestion.isFollowUp}
                hasCode={!!currentQuestion.code}
                recording={recording}
                darkMode={darkMode}
                onStartAnswer={handleStartAnswer}
                onStopAnswer={handleStopListening}
              >
                <ControlButtons
                  isListening={isListening}
                  recording={recording}
                  videoURL={videoURL}
                  hasSpoken={hasSpoken}
                  onStartAnswer={handleStartAnswer}
                  onStopAnswer={handleStopListening}
                  onReset={resetInterview}
                  isLearningMode={isLearningMode}
                />

                {recordingTime > 0 && (
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                    ⏱️ {recordingTime}s
                  </span>
                )}

                {!hasSpoken && isAnswerStart && (
                  <div className="text-red-500 font-bold mt-2 animate-pulse">
                    🎤 Please speak your answer...
                  </div>
                )}

                {!isLearningMode && (
                  <Microphone
                    isListening={isListening}
                    recording={recording}
                    stopListening={handleStopListening}
                    startListening={handleStartListening}
                  />
                )}
                
                <TranscriptDisplay transcript={transcript} />
                
                {isListening && <AIFeedback aiFeedback={aiFeedback} />}
              </QuestionPanel>
            </div>

            {/* Camera - Only show in interview mode */}
            {!isLearningMode && (
              <DraggableCamera>
                <CameraRecorder
                  onData={handleVideoData}
                  setRecordingState={setRecording}
                  videoURL={videoURL}
                  setVideoURL={setVideoURL}
                  cameraState={cameraState}
                  setCameraState={setCameraState}
                />
              </DraggableCamera>
            )}
          </div>
        ) : (
          // Only show InterviewComplete if interview was actually completed and saved
          interviewComplete && (
            <InterviewComplete
              history={history}
              exportJSON={() => exportJSON(
                history, 
                { 
                  overallScore: calculateOverallScore(), 
                  confidenceLevel, 
                  totalDuration: getTotalDuration(), 
                  emotionalTone, 
                  insights: aiInsights 
                }, 
                language
              )}
              exportPDF={() => exportPDF(
                history, 
                { 
                  overallScore: calculateOverallScore(), 
                  confidenceLevel, 
                  emotionalTone 
                }
              )}
              reset={resetInterview}
              param={language}
            />
          )
        )}
      </AnimatePresence>

      <KeyboardShortcuts isVisible={keyboardShortcuts} onClose={closeKeyboardShortcuts} />
      <AICorner />
    </div>
  );
};

export default React.memo(InterviewInterface);
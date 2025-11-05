import React, { useContext ,useState} from 'react';
import { motion } from 'framer-motion';
import { Mic,MicOff,SendHorizontal, RefreshCw, Download, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { DarkModeContext } from '../../App';

const ControlButtons = ({
  isListening,
  recording,
  videoURL,
  hasSpoken,
  onStartAnswer,
  onStopAnswer,
  onReset,
  onExportJSON,
  showKeyboardShortcuts,
  onToggleKeyboardShortcuts,
  isLearningMode
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [startButton, setStartButton] = useState(false);

  // Enhanced dark mode styles without white overload
  const darkModeStyles = {
    background: darkMode 
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
      : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    startButton: darkMode 
      ? "from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 border border-emerald-500/30" 
      : "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border border-emerald-400/30",
    stopButton: darkMode 
      ? "from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600/30" 
      : "from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black border border-gray-500/30",
    buttonOverlay: darkMode 
      ? "bg-white/5 group-hover:bg-white/10" 
      : "bg-white/20 group-hover:bg-white/30",
    shortcutsButton: darkMode 
      ? "from-blue-700 to-purple-800 hover:from-blue-600 hover:to-purple-700 border border-blue-500/30" 
      : "from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border border-blue-400/30",
    exportButton: darkMode 
      ? "from-green-700 to-emerald-800 hover:from-green-600 hover:to-emerald-700 border border-green-500/30" 
      : "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border border-green-400/30",
    resetButton: darkMode 
      ? "from-orange-700 to-red-800 hover:from-orange-600 hover:to-red-700 border border-orange-500/30" 
      : "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border border-orange-400/30",
    textColor: "text-white",
    shadow: darkMode 
      ? "shadow-2xl shadow-black/30" 
      : "shadow-2xl shadow-gray-400/20",
    glowEffect: darkMode 
      ? "shadow-lg shadow-green-500/20" 
      : "shadow-lg shadow-green-400/20"
  };

  const handleStartAnswer = () => {
    if (!isLearningMode && !recording && !videoURL) {
      toast.error('🎥 Please start camera recording first!');
      return;
    }
    setStartButton(true);
    onStartAnswer();
  };

  const handleStopAnswer = () => {
    if (!isLearningMode && !recording) {
      toast.error('🎥 Please start your camera before submitting!');
      return;
    }
    if (!isLearningMode && !hasSpoken) {
      toast.error('🎤 Please speak your answer before submitting!');
      return;
    }
    setStartButton(false);
    onStopAnswer();
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-8">
      {/* Start Answer Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartAnswer}
        className={`flex items-center gap-3 font-bold px-8 py-4 rounded-2xl transition-all duration-200 relative overflow-hidden group border ${darkModeStyles.startButton} ${darkModeStyles.shadow} ${darkModeStyles.glowEffect}`}
      >
        <div className={`absolute inset-0 transition-all duration-200 ${darkModeStyles.buttonOverlay}`}></div>
        <Mic className="w-6 h-6 relative z-10 text-white" />
        <span className="relative z-10 text-gray-600">Start Answer</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10"
        >
          {startButton ? 
             <MicOff className=" text-gray-400 animate-pulse" />
            :<Mic className="text-gray-400 animate-pulse" />
          }
        </motion.div>
        
        {/* Active listening indicator */}
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      {/* Stop Answer Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStopAnswer}
        className={`flex items-center gap-3 font-bold px-8 py-4 rounded-2xl transition-all duration-200 relative overflow-hidden group border ${darkModeStyles.stopButton} ${darkModeStyles.shadow}`}
      >
        <div className={`absolute inset-0 transition-all duration-200 ${darkModeStyles.buttonOverlay}`}></div>
        <span className="relative z-10 text-gray-600">Submit Answer</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10"
        >
        <SendHorizontal className=" relative z-10 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        {/* Keyboard Shortcuts Button */}
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleKeyboardShortcuts}
          className={`p-4 rounded-2xl text-white transition-all duration-300 border ${darkModeStyles.shadow} ${darkModeStyles.shortcutsButton}`}
          title="Keyboard Shortcuts"
        >
          <Code className="w-6 h-6" />
        </motion.button>

        {/* Export JSON Button */}
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onExportJSON}
          className={`p-4 rounded-2xl text-white transition-all duration-300 border ${darkModeStyles.shadow} ${darkModeStyles.exportButton}`}
          title="Export JSON"
        >
          <Download className="w-6 h-6" />
        </motion.button>

        {/* Reset Interview Button */}
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          className={`p-4 rounded-2xl text-white transition-all duration-300 border ${darkModeStyles.shadow} ${darkModeStyles.resetButton}`}
          title="Reset Interview"
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Enhanced Dark Mode Visual Effects */}
      {darkMode && (
        <>
          {/* Subtle background glow for floating buttons */}
          <div className="fixed bottom-8 right-8 w-20 h-48 bg-gradient-to-t from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl pointer-events-none z-40" />
          
          {/* Enhanced animated particles */}
          <div className="fixed bottom-8 right-8 pointer-events-none z-30">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0, 0.6, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                style={{
                  left: `${20 + Math.random() * 40}%`,
                  bottom: '15%',
                }}
              />
            ))}
          </div>

          {/* Subtle border glow effect */}
          <div className="fixed bottom-8 right-8 w-20 h-48 border border-blue-500/10 rounded-2xl pointer-events-none z-35" />
        </>
      )}

      {/* Light Mode Visual Enhancements */}
      {!darkMode && (
        <div className="fixed bottom-8 right-8 pointer-events-none z-30">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-blue-600/30 rounded-full"
              style={{
                left: `${20 + Math.random() * 40}%`,
                bottom: '10%',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlButtons;
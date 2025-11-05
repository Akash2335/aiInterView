import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageSquare, Volume2, Zap } from 'lucide-react';

// Pre-defined constants and configurations
const ANIMATION_CONFIG = {
  container: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  icon: {
    animate: { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  liveIndicator: {
    animate: { scale: [1, 1.5, 1] },
    transition: { duration: 2, repeat: Infinity }
  },
  shineEffect: {
    animate: { x: [-100, 400] },
    transition: { duration: 4, repeat: Infinity, repeatDelay: 3 }
  }
};

// Pre-calculated gradients and styles
const STYLES = {
  container: "relative mt-6 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 overflow-hidden group",
  backgroundGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
  textGradient: "bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent",
  transcriptGradient: "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
};

// Memoized particle component to prevent recreation
const FloatingParticle = React.memo(({ index }) => {
  const leftPosition = 20 + index * 30;
  
  return (
    <motion.div
      animate={{
        y: [0, -60, 0],
        x: [0, (Math.random() * 30 - 15), 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random(),
      }}
      className="absolute w-1 h-1 bg-green-400/40 rounded-full"
      style={{ left: `${leftPosition}%`, top: '90%' }}
    />
  );
});

FloatingParticle.displayName = 'FloatingParticle';

// Memoized background elements
const BackgroundElements = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full"
    />
    <motion.div
      animate={{ 
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-blue-500/8 to-cyan-500/8 rounded-full"
    />
    
    {/* Static grid pattern - no animation needed */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
  </div>
));

BackgroundElements.displayName = 'BackgroundElements';

// Memoized header component
const TranscriptHeader = React.memo(() => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="relative flex items-center gap-3 mb-4"
  >
    <motion.div
      {...ANIMATION_CONFIG.icon}
      className={`p-2 ${STYLES.backgroundGradient} rounded-xl shadow-lg`}
    >
      <MessageSquare className="w-5 h-5 text-white" />
    </motion.div>
    
    <div className="flex items-center gap-3">
      <h3 className={`text-lg font-bold ${STYLES.textGradient}`}>
        Voice Transcript
      </h3>
      
      <motion.div
        {...ANIMATION_CONFIG.liveIndicator}
        className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full"
      >
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">LIVE</span>
      </motion.div>
    </div>
  </motion.div>
));

TranscriptHeader.displayName = 'TranscriptHeader';

// Memoized transcript text with shine effect
const TranscriptText = React.memo(({ transcript }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="relative"
  >
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`text-xl md:text-2xl font-medium leading-relaxed ${STYLES.transcriptGradient}`}
    >
      {transcript}
    </motion.p>
    
    <motion.div
      {...ANIMATION_CONFIG.shineEffect}
      className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 opacity-30"
    />
  </motion.div>
));

TranscriptText.displayName = 'TranscriptText';

// Memoized footer stats
const TranscriptFooter = React.memo(({ transcript }) => {
  const stats = useMemo(() => ({
    wordCount: transcript.split(/\s+/).length,
    charCount: transcript.length
  }), [transcript]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-4 text-sm">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
        >
          <Mic className="w-4 h-4" />
          <span>{stats.wordCount} words</span>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
        >
          <Volume2 className="w-4 h-4" />
          <span>{stats.charCount} characters</span>
        </motion.div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full"
      >
        <Zap className="w-3 h-3" />
        AI Processing
      </motion.div>
    </motion.div>
  );
});

TranscriptFooter.displayName = 'TranscriptFooter';

// Main component
const TranscriptDisplay = ({ transcript }) => {
  // Early return with minimal computation
  if (!transcript) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        {...ANIMATION_CONFIG.container}
        whileHover={ANIMATION_CONFIG.hover}
        className={STYLES.container}
      >
        <BackgroundElements />
        <TranscriptHeader />
        <TranscriptText transcript={transcript} />
        <TranscriptFooter transcript={transcript} />
        
        {/* Floating Particles - only render when needed */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map(index => (
            <FloatingParticle key={index} index={index} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Export memoized component
export default React.memo(TranscriptDisplay);
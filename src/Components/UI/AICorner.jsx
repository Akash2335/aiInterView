import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const AICorner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-1  left-8 z-40"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/20"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-6 h-6 text-purple-500" />
          </motion.div>
          <div>
            <div className="text-sm font-semibold">AI Assistant</div>
            <div className="text-xs text-gray-500">Always learning</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AICorner;
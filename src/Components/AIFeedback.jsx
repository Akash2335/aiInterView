import React from 'react';
import { motion } from 'framer-motion';

const AIFeedback = ({ aiFeedback }) => {
  if (!aiFeedback) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-2 bg-purple-800/40 border border-purple-600 rounded-xl p-3"
    >
      <p className="text-purple-100">
        <strong>AI Feedback:</strong> {aiFeedback}
      </p>
    </motion.div>
  );
};

export default AIFeedback;

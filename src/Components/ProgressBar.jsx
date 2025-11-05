import { motion } from 'framer-motion';

const ProgressBar = ({ currentIndex, questions, duration = 0.6 }) => {
  if(questions===undefined)return
  const progress = Math.min((currentIndex + 1) / questions.length, 1) * 100;

  return (
    currentIndex < questions.length && (
      <div className="mb-6 text-center">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Start: {currentIndex + 1} </span>
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full"
          />
        </div>
      </div>
    )
  );
};

export default ProgressBar;
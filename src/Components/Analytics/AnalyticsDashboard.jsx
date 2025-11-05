import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Brain, Users, Lightbulb, BarChart3, TrendingUp, Sparkles, Cpu, Activity, Clock, Award } from 'lucide-react';

const AnalyticsDashboard = ({
  showAnalytics,
  overallScore,
  confidenceLevel,
  speechRate,
  historyLength,
  aiInsights,
  onToggleAnalytics
}) => {
  const [pulse, setPulse] = useState(false);
  // Pulsing effect for live data
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: <Target className="w-6 h-6" />,
      value: `${overallScore}%`,
      label: 'Overall Score',
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      delay: 0.1
    },
    {
      icon: <Zap className="w-6 h-6" />,
      value: `${confidenceLevel}%`,
      label: 'Confidence',
      gradient: 'from-green-500 via-emerald-500 to-green-600',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      delay: 0.2
    },
    {
      icon: <Brain className="w-6 h-6" />,
      value: speechRate,
      label: 'Words/Min',
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      delay: 0.3
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: historyLength,
      label: 'Questions',
      gradient: 'from-orange-500 via-red-500 to-orange-600',
      bgGradient: 'from-orange-500/20 to-red-500/20',
      delay: 0.4
    }
  ];

  return (
    <>
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={onToggleAnalytics}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 hover:shadow-3xl transition-all duration-500 group overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          
          {/* Live indicator */}
          <motion.div
            animate={{ scale: pulse ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Activity className="w-5 h-5 text-green-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-500 rounded-full blur-sm"
              />
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </motion.div>
          
          <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {showAnalytics ? 'Hide Analytics' : 'Show Live Analytics'}
          </span>
          
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </motion.div>

          {/* Shine effect */}
          <motion.div
            animate={{ x: [-100, 300] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mb-8 relative"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-xl" />
            
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-gray-700/30 overflow-hidden">
              {/* Animated grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                    style={{
                      left: `${10 + i * 12}%`,
                      top: '20%',
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25,
                        delay: stat.delay 
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { type: "spring", stiffness: 500, damping: 20 }
                      }}
                      className="relative group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className={`relative bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-2xl overflow-hidden`}>
                        {/* Icon with animation */}
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"
                        >
                          {stat.icon}
                        </motion.div>
                        
                        {/* Value with pulse */}
                        <motion.div
                          animate={{ scale: pulse ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl font-bold mb-1"
                        >
                          {stat.value}
                        </motion.div>
                        
                        <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                        
                        {/* Progress bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, delay: stat.delay + 0.5 }}
                          className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden"
                        >
                          <motion.div
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-full bg-white/50 w-1/2"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* AI Insights Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[size:20px_20px] opacity-50" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="flex items-center gap-3 mb-4"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl shadow-lg"
                      >
                        <Lightbulb className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-purple-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          AI Insights
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-medium"
                    >
                      {aiInsights[aiInsights.length - 1] || 'Provide detailed answers for better AI insights and personalized feedback...'}
                    </motion.div>
                    
                    {/* Live processing indicator */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center gap-2 mt-4 text-sm text-green-600 dark:text-green-400"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      <span className="font-semibold">Live AI Processing</span>
                      <Clock className="w-3 h-3 ml-2" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalyticsDashboard;
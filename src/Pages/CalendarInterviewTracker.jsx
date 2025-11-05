import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Filter,
  TrendingUp,
  Target,
  X,
  Sparkles,
  Award,
  Zap,
  BarChart3,
  Clock,
  Flame,
  Crown,
  Star,
  Trophy,
  Activity,
  Brain,
  Rocket,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { useInterviewHistory } from '../hooks/useInterviewHistory';

const CalendarInterviewTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [interviewData, setInterviewData] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'insights'
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  const languages = ["React", "JavaScript", "SQL", "CSharp", "Aws", "Testing", "NetCore", "EntityFramework", "LINQ", "AsyncAwaitQ", "AsyncAwaitBasic", "AsyncFollowUp", "AsyncPatterns", "cCollection", "cicdAction", "entityFramwork", "LINQAdvanced", "LINQQueryPractice", "NETCaseStudies", "NETCoreAWS", "NETFollowUp", "ReactFollowUp", "ReduxStateManagement", "SQLCaseStudies", "SQLQueryStudies", "CICD", "all"];

  // Theme styles
  const themeStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondary: 'text-gray-600',
      card: 'bg-white/95',
      border: 'border-gray-200',
      gradient: 'from-blue-600 to-purple-600'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      secondary: 'text-gray-300',
      card: 'bg-gray-800/95',
      border: 'border-gray-700',
      gradient: 'from-purple-600 to-pink-600'
    }
  };

  const currentTheme = themeStyles[theme];
  
  // Get real interview history data
  const { history } = useInterviewHistory(null, true);

  // Process real interview data for the calendar
  const processedData = useMemo(() => {
    const data = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Group interviews by date and language
    const interviewsByDate = {};

    history.forEach(item => {
      if (item.timestamp) {
        const interviewDate = new Date(item.timestamp);
        const interviewYear = interviewDate.getFullYear();
        const interviewMonth = interviewDate.getMonth();
        const interviewDay = interviewDate.getDate();

        // Only include interviews from the current month/year
        if (interviewYear === year && interviewMonth === month) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(interviewDay).padStart(2, '0')}`;
          const language = item.language || 'React'; // Default to React if no language specified

          if (!interviewsByDate[dateStr]) {
            interviewsByDate[dateStr] = {};
          }

          if (!interviewsByDate[dateStr][language]) {
            interviewsByDate[dateStr][language] = 0;
          }

          interviewsByDate[dateStr][language]++;
        }
      }
    });

    // Convert to the format expected by the calendar
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(year, month, day);
      const isWeekend = dateObj.getDay() === 5 || dateObj.getDay() === 6;
      const isToday = dateObj.toDateString() === new Date().toDateString();

      const dayInterviews = interviewsByDate[dateStr] || {};

      // For each language, add an entry
      languages.filter(lang => lang !== 'all').forEach(language => {
        const completed = dayInterviews[language] || 0;

        data.push({
          date: dateStr,
          completed,
          language,
          isWeekend,
          isToday,
          mood: completed > 0 ? 'productive' : 'rest'
        });
      });
    }

    return data;
  }, [currentDate, history]);

  useEffect(() => {
    setInterviewData(processedData);
  }, [processedData]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { firstDay, lastDay, daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = useMemo(() => 
    getDaysInMonth(currentDate), [currentDate]
  );

  const getCompletedInterviews = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = interviewData.filter(item => item.date === dateStr);
    
    if (selectedLanguage === 'all') {
      return dayData.reduce((sum, item) => sum + item.completed, 0);
    }
    
    return dayData.find(item => item.language === selectedLanguage)?.completed || 0;
  };

  const isWeekendDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getDay() === 5 || date.getDay() === 6;
  };

  const isWeekdayDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
  };

  const getDayDetails = (day) => {
    const completed = getCompletedInterviews(day);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = interviewData.filter(item => item.date === dateStr);
    const isWeekend = isWeekendDay(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    return { completed, details: dayData, isWeekend, isToday };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getProgressColor = (count, isToday = false, isWeekend = false) => {
    if (isToday) {
      return theme === 'light' 
        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/40 border-2 border-white'
        : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/40 border-2 border-gray-800';
    }
    if (isWeekend && count > 0) {
      return 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-xl shadow-orange-500/30 border-2 border-orange-300';
    }
    if (isWeekend) {
      return theme === 'light'
        ? 'bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-200 text-orange-800'
        : 'bg-gradient-to-br from-orange-900 to-red-900 border-2 border-orange-800 text-orange-200';
    }
    if (count === 0) return theme === 'light' 
      ? 'bg-white/90 border border-gray-200/60 hover:bg-gray-50/80' 
      : 'bg-gray-800/90 border border-gray-700/60 hover:bg-gray-700/80';
    if (count <= 3) return theme === 'light'
      ? 'bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200/60 shadow-sm'
      : 'bg-gradient-to-br from-green-900 to-emerald-900 border border-green-700/60 shadow-sm';
    if (count <= 6) return theme === 'light'
      ? 'bg-gradient-to-br from-green-200 to-emerald-300 border border-green-300/60 shadow-md'
      : 'bg-gradient-to-br from-green-800 to-emerald-800 border border-green-600/60 shadow-md';
    if (count <= 9) return theme === 'light'
      ? 'bg-gradient-to-br from-green-300 to-emerald-400 border border-green-400/60 shadow-lg'
      : 'bg-gradient-to-br from-green-700 to-emerald-700 border border-green-500/60 shadow-lg';
    return theme === 'light'
      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border border-green-500/60 shadow-xl'
      : 'bg-gradient-to-br from-green-600 to-emerald-600 border border-green-400/60 shadow-xl';
  };

  const { totalCompleted, averagePerDay, streakDays, bestDay, monthlyGoal } = useMemo(() => {
    const total = interviewData
      .filter(item => selectedLanguage === 'all' || item.language === selectedLanguage)
      .reduce((sum, item) => sum + item.completed, 0);

    const average = total / daysInMonth;
    const goal = 100; // Monthly goal

    let currentStreak = 0;
    let maxStreak = 0;
    let bestDayCount = 0;
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const completed = getCompletedInterviews(day);
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      if (completed > 0 && dayDate <= today) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        bestDayCount = Math.max(bestDayCount, completed);
      } else {
        currentStreak = 0;
      }
    }

    return {
      totalCompleted: total,
      averagePerDay: average,
      streakDays: maxStreak,
      bestDay: bestDayCount,
      monthlyGoal: goal,
      progress: (total / goal) * 100
    };
  }, [interviewData, selectedLanguage, daysInMonth, currentDate]);

  // Insights data
  const insights = useMemo(() => {
    const productiveDays = Array.from({ length: daysInMonth })
      .map((_, index) => {
        const day = index + 1;
        return { day, completed: getCompletedInterviews(day) };
      })
      .filter(day => day.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 3);

    const weekendPerformance = Array.from({ length: daysInMonth })
      .map((_, index) => {
        const day = index + 1;
        const isWeekend = isWeekendDay(day);
        return { day, completed: getCompletedInterviews(day), isWeekend };
      })
      .filter(day => day.isWeekend && day.completed > 0);

    const weekdayPerformance = Array.from({ length: daysInMonth })
      .map((_, index) => {
        const day = index + 1;
        const isWeekday = isWeekdayDay(day);
        return { day, completed: getCompletedInterviews(day), isWeekday };
      })
      .filter(day => day.isWeekday && day.completed > 0);

    const avgWeekend = weekendPerformance.reduce((sum, day) => sum + day.completed, 0) / (weekendPerformance.length || 1);
    const avgWeekday = weekdayPerformance.reduce((sum, day) => sum + day.completed, 0) / (weekdayPerformance.length || 1);

    return {
      topDays: productiveDays,
      weekendAverage: avgWeekend,
      weekdayAverage: avgWeekday,
      consistency: (productiveDays.length / daysInMonth) * 100
    };
  }, [interviewData, selectedLanguage, daysInMonth, currentDate]);

  const AchievementBadges = () => {
    const badges = [];
    
    if (streakDays >= 7) badges.push({ icon: <Flame className="w-3 h-3" />, text: '7-Day Streak', color: 'text-orange-500' });
    if (bestDay >= 10) badges.push({ icon: <Trophy className="w-3 h-3" />, text: 'Perfect Day', color: 'text-yellow-500' });
    if (totalCompleted >= 50) badges.push({ icon: <Award className="w-3 h-3" />, text: '50+ Solved', color: 'text-blue-500' });
    if (insights.weekendAverage >= 5) badges.push({ icon: <Coffee className="w-3 h-3" />, text: 'Weekend Warrior', color: 'text-green-500' });
    
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 text-xs ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.text}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      {/* Enhanced Floating Action Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          boxShadow: theme === 'light' 
            ? "0 20px 40px rgba(59, 130, 246, 0.4)"
            : "0 20px 40px rgba(147, 51, 234, 0.4)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCalendar(true)}
        className={`fixed right-6 top-20 z-50 w-14 h-14 rounded-2xl shadow-xl border-2 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 border-white/80' 
            : 'bg-gradient-to-br from-purple-500 to-pink-500 border-gray-800/80'
        } flex items-center justify-center group backdrop-blur-sm`}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Calendar className="w-6 h-6 text-white drop-shadow" />
        </motion.div>
        
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </motion.div>
      </motion.button>

      {/* Enhanced Calendar Popup */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${theme === 'light' ? 'bg-black/60' : 'bg-black/80'} backdrop-blur-lg z-50 flex items-center justify-center p-4`}
            onClick={() => setShowCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400,
              }}
              className={`${currentTheme.card} backdrop-blur-xl rounded-2xl shadow-2xl border ${currentTheme.border} w-full max-w-md overflow-hidden relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Header */}
              <div className={`relative bg-gradient-to-r ${currentTheme.gradient} p-4 text-white overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <Calendar className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-bold">Interview Calendar</h2>
                      <p className="text-white/80 text-xs">Level up your skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                      className="p-1 hover:bg-white/20 rounded-lg transition-all"
                    >
                      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCalendar(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Achievement Badges */}
                <AchievementBadges />
              </div>

              {/* View Toggle */}
              <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/80">
                <div className="flex bg-white/80 rounded-lg p-1 border border-gray-200/50 shadow">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('calendar')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      activeView === 'calendar' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📅 Calendar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('insights')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      activeView === 'insights' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📊 Insights
                  </motion.button>
                </div>
              </div>

              {activeView === 'calendar' ? (
                <>
                  {/* Quick Stats Bar */}
                  <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/80">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span className="font-semibold">{totalCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-600" />
                          <span className="font-semibold">{streakDays}d</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="font-semibold">{averagePerDay.toFixed(1)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowStats(!showStats)}
                        className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                      >
                        {showStats ? 'Hide' : 'Stats'}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Monthly Progress</span>
                        <span>{totalCompleted}/{monthlyGoal}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (totalCompleted / monthlyGoal) * 100)}%` }}
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full shadow"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats */}
                  {showStats && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3 py-2 border-b border-gray-200/50 bg-white/50"
                    >
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="font-bold text-gray-900">{totalCompleted}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="font-bold text-gray-900">{bestDay}</div>
                          <div className="text-gray-600">Best Day</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <div className="font-bold text-gray-900">{streakDays}</div>
                          <div className="text-gray-600">Streak</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded-lg">
                          <div className="font-bold text-gray-900">{insights.weekendAverage.toFixed(1)}</div>
                          <div className="text-gray-600">Weekend Avg</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Month Navigation */}
                  <div className="p-3 border-b border-gray-200/50 bg-white/80">
                    <div className="flex justify-between items-center mb-3">
                      <motion.h3 className="text-lg font-bold text-gray-900">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </motion.h3>
                      
                      <div className="flex items-center gap-1 bg-white/80 rounded-lg p-1 border border-gray-200/50 shadow">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigateMonth('prev')}
                          className="p-1 rounded transition-all"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentDate(new Date())}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-all"
                        >
                          Today
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigateMonth('next')}
                          className="p-1 rounded transition-all"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Language Filter */}
                    <div className="mb-2">
                      <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
                        {languages.map((language) => (
                          <motion.button
                            key={language}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedLanguage(language)}
                            className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedLanguage === language
                                ? 'bg-blue-500 text-white shadow'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {language === 'all' ? 'All' : language}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Calendar Grid */}
                  <div className="p-3 bg-gradient-to-br from-gray-50/50 to-white">
                    {/* Week Days Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div
                          key={index}
                          className={`text-center text-xs font-bold py-2 rounded-lg ${
                            index === 5 || index === 6
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'text-gray-500 bg-white/80'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: startingDay }).map((_, index) => (
                        <div 
                          key={`empty-${index}`} 
                          className="aspect-square rounded-lg bg-gray-100/30 border border-gray-200/30"
                        />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const { completed, isWeekend } = getDayDetails(day);
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        const isFuture = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) > new Date();
                        
                        return (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            whileHover={{ 
                              scale: isToday ? 1.05 : 1.1,
                              y: -2
                            }}
                            className={`
                              aspect-square rounded-lg p-1 relative overflow-hidden cursor-pointer text-xs
                              transition-all duration-200 backdrop-blur-sm
                              ${isFuture ? 'opacity-30 cursor-not-allowed' : ''}
                              ${getProgressColor(completed, isToday, isWeekend)}
                            `}
                            onHoverStart={() => !isFuture && setHoveredDay(`${currentDate.getMonth()}-${day}`)}
                            onHoverEnd={() => setHoveredDay(null)}
                          >
                            <div className={`font-semibold text-center ${
                              isToday ? 'text-white' : 
                              isWeekend ? 'text-orange-900' : 
                              completed > 0 ? 'text-gray-800' : 'text-gray-600'
                            }`}>
                              {day}
                            </div>

                            {completed > 0 && (
                              <div className="flex justify-center gap-0.5 mt-1">
                                {Array.from({ length: Math.min(completed, 3) }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full ${
                                      isToday ? 'bg-white/90' :
                                      isWeekend ? 'bg-orange-200' :
                                      'bg-green-500'
                                    }`}
                                  />
                                ))}
                                {completed > 3 && (
                                  <div className={`text-[8px] font-bold ${
                                    isToday ? 'text-white/90' :
                                    isWeekend ? 'text-orange-200' :
                                    'text-green-600'
                                  }`}>
                                    +{completed - 3}
                                  </div>
                                )}
                              </div>
                            )}

                            {isToday && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5"
                              >
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full border border-white"></div>
                              </motion.div>
                            )}

                            {isWeekend && completed > 0 && !isToday && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5"
                              >
                                <Flame className="w-2 h-2 text-orange-500" />
                              </motion.div>
                            )}

                            <AnimatePresence>
                              {hoveredDay === `${currentDate.getMonth()}-${day}` && !isFuture && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10"
                                >
                                  <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap shadow-xl border border-gray-700">
                                    <div className="font-semibold">
                                      {new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Target className="w-2 h-2 text-green-400" />
                                      {completed} interview{completed !== 1 ? 's' : ''}
                                    </div>
                                    {isToday && <div className="text-yellow-400 text-[10px]">● Today</div>}
                                    {isWeekend && <div className="text-orange-400 text-[10px]">● Weekend</div>}
                                  </div>
                                  <div className="absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Insights View */
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-bold text-center mb-4">📈 Your Learning Insights</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">Top Performing Days</span>
                      </div>
                      {insights.topDays.map((day, index) => (
                        <div key={day.day} className="flex justify-between items-center text-sm">
                          <span>Day {day.day}</span>
                          <span className="font-bold text-green-600">{day.completed} interviews</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Weekend Performance</span>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Average on weekends:</span>
                          <span className="font-bold text-orange-600">{insights.weekendAverage.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold">Weekday Performance</span>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Average on weekdays:</span>
                          <span className="font-bold text-blue-600">{insights.weekdayAverage.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">Consistency Score</span>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span>Active days:</span>
                          <span className="font-bold text-blue-600">{insights.consistency.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Legend */}
              <div className="p-3 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white/80">
                <div className="flex justify-center gap-3 text-[10px]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-400 rounded"></div>
                    <span className="text-gray-600">Weekend</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-300 rounded"></div>
                    <span className="text-gray-600">Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarInterviewTracker;
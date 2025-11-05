import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Brain,
  Target,
  Code,
  Play,
  Copy,
  Check,
  ChevronDown,
  Database,
  Cpu,
  Square,
  Circle,
  Terminal,
  FileCode,
  FileText
} from 'lucide-react';
import { DarkModeContext } from '../../App';

const QuestionPanel = ({ 
  question, 
  category, 
  isFollowUp,
  children,
  answer,
  isLearningMode,
  onStartAnswer,
  onStopAnswer,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [userCode, setUserCode] = useState('');
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Supported languages with their templates and execution simulators
  const languages = {
    javascript: {
      name: 'JavaScript',
      extension: 'js',
      template: `// Write your JavaScript code here
console.log('Hello, World!');

function calculate(a, b) {
  return a + b;
}

console.log('2 + 3 =', calculate(2, 3));

// Array example
const numbers = [1, 2, 3, 4, 5];
console.log('Numbers:', numbers);`,
      icon: <Square className="w-4 h-4 fill-yellow-400 stroke-yellow-600" />,
      color: 'from-yellow-500 to-orange-500'
    },
    csharp: {
      name: 'C#',
      extension: 'cs',
      template: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        int result = Calculate(2, 3);
        Console.WriteLine("2 + 3 = " + result);
        
        // List example
        List<int> numbers = new List<int> {1, 2, 3, 4, 5};
        Console.WriteLine("Numbers: " + string.Join(", ", numbers));
    }
    
    static int Calculate(int a, int b)
    {
        return a + b;
    }
}`,
      icon: <Square className="w-4 h-4 fill-purple-500 stroke-purple-700" />,
      color: 'from-purple-500 to-indigo-500'
    },
    sql: {
      name: 'SQL',
      extension: 'sql',
      template: `-- Write your SQL queries here
SELECT * FROM users;

-- Join example
SELECT 
    u.name,
    o.order_date,
    o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total_amount > 100;

-- Aggregation example
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department;`,
      icon: <Database className="w-4 h-4 text-blue-500" />,
      color: 'from-blue-500 to-cyan-500'
    },
    react: {
      name: 'React',
      extension: 'jsx',
      template: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// Component usage example
function App() {
  return (
    <div>
      <h1>My React App</h1>
      <Counter />
    </div>
  );
}

export default App;`,
      icon: <Cpu className="w-4 h-4 text-cyan-500" />,
      color: 'from-cyan-500 to-blue-500'
    }
  };

  // Dark mode styles
  const darkModeStyles = {
    background: darkMode ? "bg-gray-900/95" : "bg-white/95",
    border: darkMode ? "border-gray-700/30" : "border-white/30",
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-700",
    textTertiary: darkMode ? "text-gray-400" : "text-gray-600",
    questionGradient: darkMode ? "from-white via-cyan-200 to-purple-200" : "from-gray-900 via-blue-900 to-purple-900",
    answerBackground: darkMode ? "from-slate-900 via-purple-900 to-blue-900" : "from-white via-cyan-50 to-purple-100",
    answerText: darkMode ? "text-white" : "text-gray-800",
    particleColor: darkMode ? "bg-blue-400/30" : "bg-blue-600/30",
    gridPattern: darkMode ? "bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)]",
    radialGradient: darkMode ? "from-blue-500/20 via-transparent to-transparent" : "from-blue-500/15 via-transparent to-transparent",
    badgeGlow: darkMode ? "shadow-blue-500/30 group-hover:shadow-blue-500/50" : "shadow-blue-500/25 group-hover:shadow-blue-500/40",
    answerBadgeText: darkMode ? "text-gray-900" : "text-gray-800",
    shineEffect: darkMode ? "via-white/20" : "via-white/30",
    codeBackground: darkMode ? "bg-gray-800/90" : "bg-gray-100/90",
    codeText: darkMode ? "text-green-400" : "text-green-700",
    codeBorder: darkMode ? "border-gray-600" : "border-gray-300",
    outputBackground: darkMode ? "bg-gray-800" : "bg-gray-200",
    outputText: darkMode ? "text-gray-200" : "text-gray-800",
    dropdownBackground: darkMode ? "bg-gray-700" : "bg-white",
    dropdownBorder: darkMode ? "border-gray-600" : "border-gray-300",
    dropdownHover: darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
  };

  // Clear code editor when question changes
  useEffect(() => {
    setUserCode('');
    setCodeOutput('');
    setIsCodeVisible(false);
  }, [question]);
  // Language-specific code execution simulation
  const executeCode = async () => {
    if (!userCode.trim()) return;
    
    setIsRunning(true);
    setCodeOutput(`Running ${languages[selectedLanguage].name} code...`);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      let output = '';
      
      switch (selectedLanguage) {
        case 'javascript':
          output = simulateJavaScriptExecution(userCode);
          break;
        case 'csharp':
          output = simulateCSharpExecution(userCode);
          break;
        case 'sql':
          output = simulateSQLExecution(userCode);
          break;
        case 'react':
          output = simulateReactExecution(userCode);
          break;
        default:
          output = 'Language not supported for execution';
      }
      
      setCodeOutput(output);
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Simulation functions for different languages
  const simulateJavaScriptExecution = (code) => {
    const logs = code.match(/console\.log\(([^)]+)\)/g) || [];
    const outputs = logs.map(log => {
      try {
        const content = log.match(/console\.log\(([^)]+)\)/)[1];
        // Simple evaluation for basic expressions
        if (content.includes('calculate')) {
          return `> 2 + 3 = 5`;
        }
        if (content.includes('numbers')) {
          return `> Numbers: [1, 2, 3, 4, 5]`;
        }
        return `> ${content.replace(/['"]/g, '')}`;
      } catch (e) {
        return `> [JavaScript output]`;
      }
    });
    return outputs.join('\n') || 'JavaScript code executed successfully!';
  };

  const simulateCSharpExecution = (code) => {
    const lines = code.match(/Console\.WriteLine\([^)]+\)|Console\.Write\([^)]+\)/g) || [];
    const outputs = lines.map(line => {
      if (line.includes('WriteLine')) {
        const content = line.match(/Console\.WriteLine\(([^)]+)\)/)?.[1];
        if (content?.includes('Calculate')) {
          return `> 2 + 3 = 5`;
        }
        if (content?.includes('Numbers')) {
          return `> Numbers: 1, 2, 3, 4, 5`;
        }
        return `> ${content?.replace(/"/g, '') || 'C# output'}`;
      }
      return `> ${line.match(/Console\.Write\(([^)]+)\)/)?.[1]?.replace(/"/g, '') || 'C# output'}`;
    });
    return outputs.join('\n') || 'C# program compiled and executed successfully!';
  };

  const simulateSQLExecution = (code) => {
    // Extract SELECT queries
    const selectQueries = code.match(/SELECT[\s\S]*?(?=;|$)/gi) || [];
    
    if (selectQueries.length === 0) {
      return 'SQL query executed successfully (no results to display)';
    }

    const outputs = selectQueries.map((query, index) => {
      if (query.toLowerCase().includes('users')) {
        return `Query ${index + 1} Results:
+----+----------+-------------------+
| id | name     | email             |
+----+----------+-------------------+
| 1  | John Doe | john@example.com  |
| 2  | Jane Smith | jane@example.com|
+----+----------+-------------------+
(2 rows returned)`;
      } else if (query.toLowerCase().includes('employees')) {
        return `Query ${index + 1} Results:
+------------+----------------+-------------+
| department | employee_count | avg_salary  |
+------------+----------------+-------------+
| Engineering| 15             | 85000.00    |
| Sales      | 8              | 65000.00    |
| Marketing  | 5              | 70000.00    |
+------------+----------------+-------------+
(3 rows returned)`;
      } else if (query.toLowerCase().includes('orders')) {
        return `Query ${index + 1} Results:
+----+---------+------------+--------------+
| id | user_id | order_date | total_amount |
+----+---------+------------+--------------+
| 1  | 1       | 2024-01-15 | 150.00       |
| 2  | 2       | 2024-01-16 | 200.00       |
| 3  | 1       | 2024-01-17 | 75.00        |
+----+---------+------------+--------------+
(3 rows returned)`;
      } else {
        return `Query ${index + 1} executed successfully\n(Simulated database results)`;
      }
    });

    return outputs.join('\n\n');
  };

  const simulateReactExecution = (code) => {
    // Check for React components and hooks
    const hasUseState = code.includes('useState');
    const hasComponents = code.match(/function\s+\w+|class\s+\w+/g);
    const componentNames = hasComponents ? hasComponents.map(c => c.replace(/function\s+|class\s+/, '')) : [];

    let output = 'React Component Simulation:\n\n';
    
    if (componentNames.length > 0) {
      output += `✓ Components detected: ${componentNames.join(', ')}\n`;
    }
    
    if (hasUseState) {
      output += `✓ React Hooks: useState detected\n`;
    }
    
    if (code.includes('Counter')) {
      output += `\nCounter Component Preview:
<div className="counter">
  <h2>Counter: 0</h2>
  <button>Increment</button>
  <button>Decrement</button>
  <button>Reset</button>
</div>`;
    }
    
    output += `\n\n✅ React component would render successfully in a browser environment.`;

    return output;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const clearCode = () => {
    setUserCode('');
    setCodeOutput('');
  };

  const loadTemplate = () => {
    setUserCode(languages[selectedLanguage].template);
    setCodeOutput('');
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setIsLanguageDropdownOpen(false);
    setUserCode('');
    setCodeOutput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      className={`relative backdrop-blur-xl rounded-3xl shadow-2xl p-8 border overflow-hidden group transition-colors duration-300 ${darkModeStyles.background} ${darkModeStyles.border}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br ${
            darkMode 
              ? "from-blue-500/20 to-purple-600/20" 
              : "from-blue-500/15 to-purple-600/15"
          } rounded-full transition-colors duration-300`}
        />
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr ${
            darkMode 
              ? "from-cyan-500/15 to-emerald-500/15" 
              : "from-cyan-500/10 to-emerald-500/10"
          } rounded-full transition-colors duration-300`}
        />
        
        {/* Animated Grid Pattern */}
        <div className={`absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] transition-colors duration-300 ${darkModeStyles.gridPattern}`} />
      </div>

      {/* Ultra Category Badge */}
      <motion.div 
        initial={{ opacity: 0, x: -20, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        className={`relative inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold mb-8 shadow-2xl transition-all duration-300 ${darkModeStyles.badgeGlow}`}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl" />
        <motion.div
          animate={{ rotate: [0, 10, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 mr-3" />
        </motion.div>
        <span className="relative z-10">{category || 'Advanced'}</span>
        {isFollowUp && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Follow-up
          </motion.span>
        )}
      </motion.div>

      {/* Ultra Question */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`relative text-4xl md:text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent mb-10 leading-tight z-10 transition-colors duration-300 ${darkModeStyles.questionGradient}`}
      >
        {question || 'No question available'}
        {/* Shine effect */}
        <motion.div
          animate={{ x: [-100, 300] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className={`absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent ${darkModeStyles.shineEffect} to-transparent skew-x-12 transition-colors duration-300`}
        />
      </motion.h2>

      {/* Ultra Answer Section */}
      {isLearningMode && answer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative bg-gradient-to-br rounded-2xl p-8 mb-6 overflow-hidden group/answer transition-colors duration-300 ${darkModeStyles.answerBackground}`}
        >
          {/* Answer Background Effects */}
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] transition-colors duration-300 ${darkModeStyles.radialGradient}`} />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className={`absolute top-4 right-4 w-8 h-8 ${
              darkMode ? "bg-gray-800" : "bg-yellow-400/20"
            } rounded-full blur-sm transition-colors duration-300`}
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className={`text-lg font-bold flex items-center gap-2 transition-colors duration-300 ${darkModeStyles.answerBadgeText}`}>
                Expert Answer
                <Target className="w-4 h-4" />
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ 
                scale: 1.01,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className={`text-2xl md:text-3xl font-bold leading-relaxed transition-colors duration-300 ${darkModeStyles.answerText}`}
            >
              {answer || 'No answer available'}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Code Editor Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative mb-6"
      >
        {/* Code Editor Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCodeVisible(!isCodeVisible)}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold mb-4 transition-all duration-300 ${
            darkMode 
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" 
              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white"
          } shadow-lg`}
        >
          <Code className="w-5 h-5" />
          {isCodeVisible ? 'Hide Code Editor' : 'Write Your Code'}
          <motion.div
            animate={{ rotate: isCodeVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Code Editor */}
        {isCodeVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl overflow-hidden border-2 transition-colors duration-300 ${darkModeStyles.codeBorder}`}
          >
            {/* Editor Header with Language Selection */}
            <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="flex items-center gap-4">
                {/* Language Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${darkModeStyles.dropdownBorder} ${darkModeStyles.dropdownBackground}`}
                  >
                    <div className="flex items-center gap-2">
                      {languages[selectedLanguage].icon}
                      <span className="font-semibold">{languages[selectedLanguage].name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {isLanguageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-full left-0 mt-2 w-48 rounded-lg border shadow-xl z-50 ${darkModeStyles.dropdownBorder} ${darkModeStyles.dropdownBackground}`}
                    >
                      {Object.entries(languages).map(([key, lang]) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => handleLanguageChange(key)}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${darkModeStyles.dropdownHover} ${
                            selectedLanguage === key ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          {lang.icon}
                          <span className="font-medium">{lang.name}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <span className={`font-mono text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FileCode className="w-4 h-4" />
                  example.{languages[selectedLanguage].extension}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={loadTemplate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Template
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                  }`}
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearCode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                  }`}
                  title="Clear code"
                >
                  <span className="text-sm">Clear</span>
                </motion.button>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder={languages[selectedLanguage].template.split('\n').slice(0, 2).join('\n') + '...'}
              className={`w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none transition-colors duration-300 ${darkModeStyles.codeBackground} ${darkModeStyles.codeText}`}
              spellCheck="false"
            />

            {/* Code Actions */}
            <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={executeCode}
                disabled={isRunning || !userCode.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRunning || !userCode.trim()
                    ? 'bg-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${languages[selectedLanguage].color} hover:opacity-90`
                } text-white shadow-lg`}
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </motion.button>

              <div className="flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FileText className="w-3 h-3" />
                  {userCode.length} chars
                </span>
                <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Code className="w-3 h-3" />
                  {userCode.split('\n').length} lines
                </span>
              </div>
            </div>

            {/* Code Output */}
            {codeOutput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 font-mono text-sm whitespace-pre-wrap border-t transition-colors duration-300 ${darkModeStyles.outputBackground} ${darkModeStyles.outputText}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    <Circle className="w-3 h-3 fill-red-500 stroke-red-600" />
                    <Circle className="w-3 h-3 fill-yellow-500 stroke-yellow-600" />
                    <Circle className="w-3 h-3 fill-green-500 stroke-green-600" />
                  </div>
                  <span className="text-sm font-semibold ml-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    {selectedLanguage === 'sql' ? 'Query Results' : 'Output'}
                  </span>
                  <div className={`ml-2 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${languages[selectedLanguage].color} text-white flex items-center gap-1`}>
                    {languages[selectedLanguage].icon}
                    {languages[selectedLanguage].name}
                  </div>
                </div>
                {codeOutput}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Child components with enhanced container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 65 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${darkModeStyles.particleColor}`}
            style={{
              left: `${20 + i * 15}%`,
              top: '80%',
            }}
          />
        ))}
      </div>

      {/* Additional decorative elements for dark mode */}
      {darkMode && (
        <>
          {/* Subtle stars in dark mode */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl pointer-events-none" />
        </>
      )}
    </motion.div>
  );
};

export default QuestionPanel;
import React, { useState, useCallback, useRef, useContext, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Cloud, Zap, Cpu, Sparkles, ArrowRight, Star, Mic2, Video, Layers, Workflow, Database, GitBranch, Search, X, RotateCcw, BookOpen } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { DarkModeContext } from '../App';
import CalendarInterviewTracker from "../Pages/CalendarInterviewTracker";
import useInterviewHistory from '../hooks/useInterviewHistory';

const languages = [{
    id: 1, code: "Personal", label: "Personal Development", icon: <Code2 className="w-8 h-8" />,
    description: "Master C# programming with .NET ecosystem", lang: "C#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    stats: "100+ Questions", features: ["ASP.NET Core", "Entity Framework", "LINQ", "Blazor"]
},
    {
    id: 1, code: "Testing", label: "C# & .NET", icon: <Code2 className="w-8 h-8" />,
    description: "Master C# programming with .NET ecosystem", lang: "C#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    stats: "100+ Questions", features: ["ASP.NET Core", "Entity Framework", "LINQ", "Blazor"]
}, {
    id: 2, code: "Aws", label: "AWS Cloud", icon: <Cloud className="w-8 h-8" />,
    description: "Cloud infrastructure & serverless architecture", lang: "Aws",
    gradient: "from-orange-500 via-red-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    stats: "80+ Scenarios", features: ["EC2 & S3", "Lambda", "DynamoDB", "CloudFormation"]
}, {
    id: 3, code: "React", label: "React.js", icon: <Zap className="w-8 h-8" />,
    description: "Modern React development with hooks", lang: "C#",
    gradient: "from-cyan-500 via-blue-500 to-sky-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    stats: "120+ Challenges", features: ["Hooks", "State Management", "Performance", "Testing"]
}, {
    id: 4, code: "SQL", label: "SQL & Database Design", icon: <Database className="w-8 h-8" />,
    description: "Query optimization, relational modeling, and complex joins.", lang: "SQL",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    stats: "90+ Queries", features: ["Joins", "Stored Procedures", "Indexes", "Query Tuning"]
}, {
    id: 5, code: "CICD", label: "CI/CD & DevOps", icon: <GitBranch className="w-8 h-8" />,
    description: "Automate builds, testing, and deployments.", lang: "CICD",
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    stats: "70+ Scenarios", features: ["GitHub Actions", "Docker", "Kubernetes", "Pipelines"]
}, {
    id: 6, code: "NetCore", label: ".NET Core", icon: <Layers className="w-8 h-8" />,
    description: "Develop backend apps using .NET Core.", lang: "C#",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    stats: "60+ Concepts", features: ["DI", "Middleware", "REST APIs", "Logging"]
}, {
    id: 7, code: "EntityFramework", label: "Entity Framework", icon: <Database className="w-8 h-8" />,
    description: "Efficient ORM for .NET developers.", lang: "C#",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    stats: "50+ Scenarios", features: ["Code First", "Migrations", "LINQ", "Relationships"]
}, {
    id: 8, code: "LINQ", label: "LINQ", icon: <Workflow className="w-8 h-8" />,
    description: "Simplify data queries using LINQ.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    stats: "40+ Exercises", features: ["Select & Where", "Joins", "GroupBy", "Deferred Execution"]
}, {
    id: 9, code: "AsyncAwaitQ", label: "Async/Await", icon: <Zap className="w-8 h-8" />,
    description: "Master asynchronous programming patterns.", lang: "C#",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    stats: "35+ Concepts", features: ["Task Parallelism", "Async Patterns", "Error Handling", "Performance"]
}, {
    id: 10, code: "AsyncAwaitBasic", label: "Async Programming", icon: <Cpu className="w-8 h-8" />,
    description: "Advanced asynchronous programming techniques.", lang: "C#",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    stats: "45+ Scenarios", features: ["Task Management", "Cancellation", "Async Streams", "Best Practices"]
}, {
    id: 11, code: "AsyncFollowUp", label: "Async Follow-up", icon: <GitBranch className="w-8 h-8" />,
    description: "Deep dive into async programming concepts.", lang: "C#",
    gradient: "from-red-500 via-pink-500 to-rose-500",
    bgGradient: "from-red-500/10 to-pink-500/10",
    stats: "30+ Questions", features: ["Advanced Patterns", "Debugging", "Performance", "Real-world Scenarios"]
}, {
    id: 12, code: "AsyncPatterns", label: "Async Patterns", icon: <Workflow className="w-8 h-8" />,
    description: "Comprehensive async programming patterns.", lang: "C#",
    gradient: "from-rose-500 via-pink-500 to-purple-500",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    stats: "25+ Exercises", features: ["Pattern Matching", "Error Handling", "Optimization", "Case Studies"]
}, {
    id: 13, code: "CSharp", label: "C# Programming", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },
    {
    id: 13, code: "cCollection", label: "C# Collection", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },
    {
    id: 14, code: "cicdAction", label: "CI/CD Actions", icon: <GitBranch className="w-8 h-8" />,
    description: "GitHub Actions and advanced CI/CD pipelines.", lang: "CICD",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    stats: "40+ Workflows", features: ["GitHub Actions", "YAML Pipelines", "Automation", "Deployment"]
}, {
    id: 15, code: "entityFramwork", label: "Entity Framework Core", icon: <Database className="w-8 h-8" />,
    description: "Advanced Entity Framework Core features.", lang: "C#",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-green-500/10",
    stats: "45+ Scenarios", features: ["EF Core", "Migrations", "Performance", "Advanced Queries"]
}, {
    id: 16, code: "JavaScript", label: "JavaScript", icon: <Zap className="w-8 h-8" />,
    description: "Modern JavaScript development.", lang: "Js",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-amber-500/10",
    stats: "85+ Challenges", features: ["ES6+", "DOM Manipulation", "Async JS", "Modern Patterns"]
}, {
    id: 17, code: "LINQAdvanced", label: "LINQ Advanced", icon: <Workflow className="w-8 h-8" />,
    description: "Advanced LINQ queries and performance.", lang: "C#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    stats: "35+ Exercises", features: ["Performance", "Complex Queries", "Expression Trees", "Optimization"]
  },{
    id: 18, code: "LINQQueryPractice", label: "LINQ Query Practice", icon: <Workflow className="w-8 h-8" />,
    description: "Advanced LINQ queries and performance.", lang: "C#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    stats: "70+ Exercises", features: ["Performance", "Complex Queries", "Expression Trees", "Optimization"]
},
  {
    id: 19, code: "NETCaseStudies", label: ".NET Case Studies", icon: <Layers className="w-8 h-8" />,
    description: "Real-world .NET application scenarios.", lang: "C#",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-fuchsia-500/10",
    stats: "50+ Cases", features: ["Architecture", "Design Patterns", "Scalability", "Best Practices"]
}, {
    id: 20, code: "NETCoreAWS", label: ".NET Core with AWS", icon: <Cloud className="w-8 h-8" />,
    description: "Deploying .NET Core applications on AWS.", lang: "C#",
    gradient: "from-purple-500 via-blue-500 to-cyan-500",
    bgGradient: "from-purple-500/10 to-blue-500/10",
    stats: "40+ Scenarios", features: ["AWS Deployment", "Serverless", "Containers", "Cloud Patterns"]
}, {
    id: 21, code: "NETFollowUp", label: ".NET Follow-up", icon: <Code2 className="w-8 h-8" />,
    description: "Advanced .NET concepts and patterns.", lang: "C#",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    stats: "55+ Questions", features: ["Advanced Patterns", "Performance", "Security", "Architecture"]
}, {
    id: 22, code: "ReactFollowUp", label: "React Follow-up", icon: <Zap className="w-8 h-8" />,
    description: "Advanced React patterns and optimization.", lang: "React",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    bgGradient: "from-cyan-500/10 to-sky-500/10",
    stats: "65+ Challenges", features: ["Advanced Hooks", "Performance", "Testing", "State Management"]
}, {
    id: 23, code: "ReduxStateManagement", label: "Redux & State Management", icon: <Database className="w-8 h-8" />,
    description: "State management with Redux and alternatives.", lang: "React",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    bgGradient: "from-purple-500/10 to-violet-500/10",
    stats: "45+ Concepts", features: ["Redux Toolkit", "Middleware", "State Patterns", "Best Practices"]
}, {
    id: 24, code: "SQLCaseStudies", label: "SQL Case Studies", icon: <Database className="w-8 h-8" />,
    description: "Complex SQL scenarios and optimization.", lang: "SQL",
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    bgGradient: "from-teal-500/10 to-emerald-500/10",
    stats: "60+ Cases", features: ["Complex Queries", "Performance", "Indexing", "Real-world Scenarios"]
  },{
    id: 25, 
    code: "SQLQueryStudies", 
    label: "SQL Query Studies", 
    icon: <Database className="w-8 h-8" />,
    description: "Complex SQL scenarios and optimization.", lang: "SQL",
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    bgGradient: "from-teal-500/10 to-emerald-500/10",
    stats: "105+ Cases", 
    features: ["Complex Queries","Performance Tuning","Advanced Indexing", "Real-world Scenarios","Window Functions","Query Optimization"]
}
];

const LearningSelection = ["Learning", "Interview"];

const LanguageSelection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLearning, setIsLearning] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { darkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const navigationTimeoutRef = useRef(null);

    // Use interview history hook for learning progress
    const { getLearningProgress, resetLearningProgress } = useInterviewHistory();

    // Handle search from URL params
    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            setSearchQuery(search);
            setIsSearchOpen(true);
        }
    }, [searchParams]);

    // Filtered languages based on search
    const filteredLanguages = useMemo(() => {
        if (!searchQuery.trim()) return languages;
        const query = searchQuery.toLowerCase();
        return languages.filter(lang =>
            lang.label.toLowerCase().includes(query) ||
            lang.description.toLowerCase().includes(query) ||
            lang.features.some(feature => feature.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    const handleSelect = useCallback((code) => {
        if (isLearning === null) {
            toast.error("Please select Learning or Interview mode first.");
            return;
        }

        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }

        navigationTimeoutRef.current = setTimeout(() => {
            setSelectedCard(code);
            const mode = isLearning === "Learning" ? "learn" : "interview";
            navigate(`/inter/${code}/${mode}`);
        }, 150);
    }, [isLearning, navigate]);

    // Dark mode styles
    const darkModeStyles = {
        background: darkMode 
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
        cardBackground: darkMode 
            ? "bg-gray-800/80 backdrop-blur-xl border-gray-700/50" 
            : "bg-white/80 backdrop-blur-xl border-gray-200/50",
        cardHover: darkMode 
            ? "hover:bg-gray-700/80 hover:border-gray-600" 
            : "hover:bg-white/90 hover:border-gray-300",
        textPrimary: darkMode ? "text-white" : "text-gray-900",
        textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
        textTertiary: darkMode ? "text-gray-400" : "text-gray-500",
        badgeBackground: darkMode 
            ? "bg-gray-700/80 backdrop-blur-md border-gray-600" 
            : "bg-white/80 backdrop-blur-md border-gray-200",
        buttonActive: darkMode 
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl shadow-blue-500/30" 
            : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-400/30",
        buttonInactive: darkMode 
            ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-md border border-gray-600" 
            : "bg-white/70 text-gray-600 hover:bg-white/90 backdrop-blur-md border border-gray-300",
        borderColor: darkMode ? "border-gray-700" : "border-gray-200"
    };

    return (
      <div className={`min-h-screen ${darkModeStyles.background} relative overflow-hidden transition-colors duration-300`}>

        {/* CalendarSection */}
        <CalendarInterviewTracker />
            {/* Floating Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/4 left-1/4 w-96 h-96 ${
                        darkMode ? "bg-purple-500/10" : "bg-purple-400/20"
                    } rounded-full blur-3xl`}
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-3/4 right-1/4 w-80 h-80 ${
                        darkMode ? "bg-cyan-500/10" : "bg-cyan-400/20"
                    } rounded-full blur-3xl`}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-6xl w-full"
                >
                    {/* Header */}
                    <motion.div className="text-center mb-16">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-2xl ${darkModeStyles.badgeBackground} backdrop-blur-md border shadow-2xl transition-colors duration-300`}
                        >
                            <Sparkles className={`w-5 h-5 ${darkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                            <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"} tracking-wider`}>
                                AI-POWERED TECHNICAL INTERVIEWS
                            </span>
                        </motion.div>

                        <h1 className={`text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r ${
                            darkMode 
                                ? "from-white via-cyan-200 to-purple-200" 
                                : "from-gray-900 via-blue-600 to-purple-600"
                        } bg-clip-text text-transparent leading-tight`}>
                            Interv<span className={darkMode ? "text-red-500" : "text-red-600"}>iews</span> Master
                        </h1>

                        <p className={`text-xl ${darkModeStyles.textSecondary} max-w-2xl mx-auto`}>
                            Choose a domain to start your <span className={darkMode ? "text-cyan-400" : "text-cyan-600"}>AI-powered interview</span>
                        </p>
                    </motion.div>

                    {/* Learning/Interview Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-6 mb-12"
                    >
                        {LearningSelection.map((item, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setIsLearning(item)}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                    isLearning === item
                                        ? darkModeStyles.buttonActive
                                        : darkModeStyles.buttonInactive
                                }`}
                            >
                                {item}
                            </motion.button>
                        ))}

                        {/* Search Button */}
                        <motion.button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            whileHover={{
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 400, damping: 10 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className={`p-4 rounded-2xl transition-all duration-300 ${
                                isSearchOpen
                                    ? darkModeStyles.buttonActive
                                    : darkModeStyles.buttonInactive
                            }`}
                        >
                            <Search className="w-6 h-6" />
                        </motion.button>
                    </motion.div>

                    {/* Search Bar */}
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 max-w-md mx-auto"
                        >
                            <div className={`relative ${darkModeStyles.cardBackground} rounded-2xl p-4 backdrop-blur-xl border shadow-2xl`}>
                                <div className="flex items-center gap-3">
                                    <Search className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-indigo-600'}`} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search interview questions..."
                                        className={`flex-1 bg-transparent border-0 outline-none text-lg ${
                                            darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                        }`}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${
                                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Cards Grid */}
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <AnimatePresence>
                            {filteredLanguages.map((lang, index) => (
                                <motion.div
                                    key={lang.code}
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    onHoverStart={() => setHoveredCard(lang.code)}
                                    onHoverEnd={() => setHoveredCard(null)}
                                    className={`relative group cursor-pointer transition-transform duration-300 ${
                                        selectedCard === lang.code ? 'scale-95' : ''
                                    }`}
                                >
                                    <div className={`relative h-full ${darkModeStyles.cardBackground} ${darkModeStyles.cardHover} rounded-3xl border p-8 overflow-hidden transition-all duration-500`}>
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${lang.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        
                                        <div className="relative z-10">
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <motion.div
                                                    animate={hoveredCard === lang.code ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                                                    className={`p-3 rounded-2xl bg-gradient-to-r ${lang.gradient} shadow-lg`}
                                                >
                                                    {lang.icon}
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{
                                                        scale: 1.4,
                                                        x: [0, 8, 0],
                                                        transition: {
                                                            scale: { duration: 0.2 },
                                                            x: { duration: 0.6, ease: "easeInOut" }
                                                        }
                                                    }}
                                                >
                                                    <ArrowRight 
                                                        onClick={() => handleSelect(lang.code)} 
                                                        className={`w-6 h-6 ${
                                                            darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-500 group-hover:text-gray-700"
                                                        } transition-colors duration-300`} 
                                                    />
                                                </motion.div>
                                            </div>

                                            {/* Card Content */}
                                            <h3 className={`text-2xl font-bold ${darkModeStyles.textPrimary} mb-3`}>
                                                {lang.label}
                                            </h3>
                                            <p className={`${darkModeStyles.textSecondary} mb-6`}>
                                                {lang.description}
                                            </p>

                                            {/* Features List */}
                                            <div className="space-y-2 mb-6">
                                                {lang.features.map((f, i) => (
                                                    <motion.div 
                                                        key={f} 
                                                        className={`flex items-center gap-3 text-sm ${darkModeStyles.textTertiary}`}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${lang.gradient}`} />
                                                        {f}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Card Footer */}
                                            <div className={`flex items-center justify-between pt-4 border-t ${
                                                darkMode ? "border-gray-700" : "border-gray-200"
                                            }`}>
                                                <div className={`flex items-center gap-2 text-sm ${
                                                    darkMode ? "text-cyan-400" : "text-cyan-600"
                                                }`}>
                                                    <Star className="w-4 h-4" />
                                                    {lang.stats}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isLearning === "Learning" && getLearningProgress(lang.code) !== null && (
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className={`w-4 h-4 ${
                                                                darkMode ? "text-blue-400" : "text-blue-600"
                                                            }`} />
                                                            <span className={`text-xs ${
                                                                darkMode ? "text-blue-300" : "text-blue-700"
                                                            }`}>
                                                                Last: Q{getLearningProgress(lang.code) + 1}
                                                            </span>
                                                            <motion.button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    resetLearningProgress(lang.code);
                                                                    toast.success(`Reset progress for ${lang.label}`);
                                                                }}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className={`p-1 rounded-lg transition-colors ${
                                                                    darkMode ? "hover:bg-gray-600 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                                                                }`}
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                            </motion.button>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Mic2 className={`w-4 h-4 ${
                                                            darkMode ? "text-green-400" : "text-green-600"
                                                        }`} />
                                                        <Video className={`w-4 h-4 ${
                                                            darkMode ? "text-purple-400" : "text-purple-600"
                                                        }`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default LanguageSelection;
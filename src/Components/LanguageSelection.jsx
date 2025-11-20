import React, { useState, useCallback, useRef, useContext, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Cloud, Zap, Cpu,Globe, Sparkles, ArrowRight, Star, Mic2, Video, Layers, Workflow, Database, GitBranch, Search, X, RotateCcw, BookOpen, List, Grid3X3, Play, Users, Target, Rocket } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { DarkModeContext } from '../App';
import CalendarInterviewTracker from "../Pages/CalendarInterviewTracker";
import useInterviewHistory from '../hooks/useInterviewHistory';
import { AuthContext } from '../utils/AuthProvider';

const languages = [
    {
    id: 1, code: "Personal", label: "Personal Development", icon: <Code2 className="w-8 h-8" />,
    description: "Master C# programming with .NET ecosystem", lang: "C#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    stats: "100+ Questions", features: ["ASP.NET Core", "Entity Framework", "LINQ", "Blazor"]
},{
    id: 2, code: "Testing", label: "C# & .NET", icon: <Code2 className="w-8 h-8" />,
    description: "Master C# programming with .NET ecosystem", lang: "C#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    stats: "100+ Questions", features: ["ASP.NET Core", "Entity Framework", "LINQ", "Blazor"]
}, {
    id: 3, code: "Aws", label: "AWS Cloud", icon: <Cloud className="w-8 h-8" />,
    description: "Cloud infrastructure & serverless architecture", lang: "Aws",
    gradient: "from-orange-500 via-red-500 to-amber-500",
    bgGradient: "from-orange-500/20 to-red-500/20",
    stats: "80+ Scenarios", features: ["EC2 & S3", "Lambda", "DynamoDB", "CloudFormation"]
}, {
    id: 4, code: "React", label: "React.js", icon: <Zap className="w-8 h-8" />,
    description: "Modern React development with hooks", lang: "React",
    gradient: "from-cyan-500 via-blue-500 to-sky-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    stats: "120+ Challenges", features: ["Hooks", "State Management", "Performance", "Testing"]
}, {
    id: 5, code: "SQL", label: "SQL & Database Design", icon: <Database className="w-8 h-8" />,
    description: "Query optimization, relational modeling, and complex joins.", lang: "SQL",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    stats: "90+ Queries", features: ["Joins", "Stored Procedures", "Indexes", "Query Tuning"]
}, {
    id: 6, code: "CICD", label: "CI/CD & DevOps", icon: <GitBranch className="w-8 h-8" />,
    description: "Automate builds, testing, and deployments.", lang: "CICD",
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
    bgGradient: "from-indigo-500/20 to-blue-500/20",
    stats: "70+ Scenarios", features: ["GitHub Actions", "Docker", "Kubernetes", "Pipelines"]
}, {
    id: 7, code: "NetCore", label: ".NET Core", icon: <Layers className="w-8 h-8" />,
    description: "Develop backend apps using .NET Core.", lang: "C#",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/20 to-purple-500/20",
    stats: "60+ Concepts", features: ["DI", "Middleware", "REST APIs", "Logging"]
}, {
    id: 8, code: "EntityFramework", label: "Entity Framework", icon: <Database className="w-8 h-8" />,
    description: "Efficient ORM for .NET developers.", lang: "C#",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    stats: "50+ Scenarios", features: ["Code First", "Migrations", "LINQ", "Relationships"]
}, {
    id: 9, code: "LINQ", label: "LINQ", icon: <Workflow className="w-8 h-8" />,
    description: "Simplify data queries using LINQ.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    stats: "40+ Exercises", features: ["Select & Where", "Joins", "GroupBy", "Deferred Execution"]
}, {
    id: 10, code: "AsyncAwaitQ", label: "Async/Await", icon: <Zap className="w-8 h-8" />,
    description: "Master asynchronous programming patterns.", lang: "C#",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    stats: "35+ Concepts", features: ["Task Parallelism", "Async Patterns", "Error Handling", "Performance"]
}, {
    id: 11, code: "AsyncAwaitBasic", label: "Async Programming", icon: <Cpu className="w-8 h-8" />,
    description: "Advanced asynchronous programming techniques.", lang: "C#",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    stats: "45+ Scenarios", features: ["Task Management", "Cancellation", "Async Streams", "Best Practices"]
}, {
    id: 12, code: "AsyncFollowUp", label: "Async Follow-up", icon: <GitBranch className="w-8 h-8" />,
    description: "Deep dive into async programming concepts.", lang: "C#",
    gradient: "from-red-500 via-pink-500 to-rose-500",
    bgGradient: "from-red-500/20 to-pink-500/20",
    stats: "30+ Questions", features: ["Advanced Patterns", "Debugging", "Performance", "Real-world Scenarios"]
}, {
    id: 13, code: "AsyncPatterns", label: "Async Patterns", icon: <Workflow className="w-8 h-8" />,
    description: "Comprehensive async programming patterns.", lang: "C#",
    gradient: "from-rose-500 via-pink-500 to-purple-500",
    bgGradient: "from-rose-500/20 to-pink-500/20",
    stats: "25+ Exercises", features: ["Pattern Matching", "Error Handling", "Optimization", "Case Studies"]
}, {
    id: 14, code: "CSharp", label: "C# Programming", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },
    {
    id: 15, code: "Ccoding", label: "C# coding", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },    
    {
    id: 16, code: "ShapBasic", label: "C# Basic", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },
    {
    id: 17, code: "cCollection", label: "C# Collection", icon: <Code2 className="w-8 h-8" />,
    description: "Fundamental C programming concepts.", lang: "C#",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    stats: "55+ Problems", features: ["Pointers", "Memory Management", "Data Structures", "Algorithms"]
    },
    {
    id: 18, code: "cicdAction", label: "CI/CD Actions", icon: <GitBranch className="w-8 h-8" />,
    description: "GitHub Actions and advanced CI/CD pipelines.", lang: "CICD",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
    stats: "40+ Workflows", features: ["GitHub Actions", "YAML Pipelines", "Automation", "Deployment"]
}, {
    id: 19, code: "entityFramwork", label: "Entity Framework Core", icon: <Database className="w-8 h-8" />,
    description: "Advanced Entity Framework Core features.", lang: "C#",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bgGradient: "from-emerald-500/20 to-green-500/20",
    stats: "45+ Scenarios", features: ["EF Core", "Migrations", "Performance", "Advanced Queries"]
}, {
    id: 20, code: "JavaScript", label: "JavaScript", icon: <Zap className="w-8 h-8" />,
    description: "Modern JavaScript development.", lang: "Js",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    bgGradient: "from-yellow-500/20 to-amber-500/20",
    stats: "85+ Challenges", features: ["ES6+", "DOM Manipulation", "Async JS", "Modern Patterns"]
}, {
    id: 21, code: "LINQAdvanced", label: "LINQ Advanced", icon: <Workflow className="w-8 h-8" />,
    description: "Advanced LINQ queries and performance.", lang: "C#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    stats: "35+ Exercises", features: ["Performance", "Complex Queries", "Expression Trees", "Optimization"]
  },{
    id: 22, code: "LINQQueryPractice", label: "LINQ Query Practice", icon: <Workflow className="w-8 h-8" />,
    description: "Advanced LINQ queries and performance.", lang: "C#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    stats: "70+ Exercises", features: ["Performance", "Complex Queries", "Expression Trees", "Optimization"]
},
  {
    id: 23, code: "NETCaseStudies", label: ".NET Case Studies", icon: <Layers className="w-8 h-8" />,
    description: "Real-world .NET application scenarios.", lang: "C#",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-fuchsia-500/20",
    stats: "50+ Cases", features: ["Architecture", "Design Patterns", "Scalability", "Best Practices"]
}, {
    id: 24, code: "NETCoreAWS", label: ".NET Core with AWS", icon: <Cloud className="w-8 h-8" />,
    description: "Deploying .NET Core applications on AWS.", lang: "C#",
    gradient: "from-purple-500 via-blue-500 to-cyan-500",
    bgGradient: "from-purple-500/20 to-blue-500/20",
    stats: "40+ Scenarios", features: ["AWS Deployment", "Serverless", "Containers", "Cloud Patterns"]
}, {
    id: 25, code: "NETFollowUp", label: ".NET Follow-up", icon: <Code2 className="w-8 h-8" />,
    description: "Advanced .NET concepts and patterns.", lang: "C#",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/20 to-purple-500/20",
    stats: "55+ Questions", features: ["Advanced Patterns", "Performance", "Security", "Architecture"]
}, {
    id: 26, code: "ReactFollowUp", label: "React Follow-up", icon: <Zap className="w-8 h-8" />,
    description: "Advanced React patterns and optimization.", lang: "React",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    bgGradient: "from-cyan-500/20 to-sky-500/20",
    stats: "65+ Challenges", features: ["Advanced Hooks", "Performance", "Testing", "State Management"]
}, {
    id: 27, code: "ReduxStateManagement", label: "Redux & State Management", icon: <Database className="w-8 h-8" />,
    description: "State management with Redux and alternatives.", lang: "React",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    bgGradient: "from-purple-500/20 to-violet-500/20",
    stats: "45+ Concepts", features: ["Redux Toolkit", "Middleware", "State Patterns", "Best Practices"]
}, {
    id: 28, code: "SQLCaseStudies", label: "SQL Case Studies", icon: <Database className="w-8 h-8" />,
    description: "Complex SQL scenarios and optimization.", lang: "SQL",
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    bgGradient: "from-teal-500/20 to-emerald-500/20",
    stats: "60+ Cases", features: ["Complex Queries", "Performance", "Indexing", "Real-world Scenarios"]
  },{
    id: 29, 
    code: "SQLQueryStudies", 
    label: "SQL Query Studies", 
    icon: <Database className="w-8 h-8" />,
    description: "Complex SQL scenarios and optimization.", lang: "SQL",
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    bgGradient: "from-teal-500/20 to-emerald-500/20",
    stats: "105+ Cases", 
    features: ["Complex Queries","Performance Tuning","Advanced Indexing", "Real-world Scenarios","Window Functions","Query Optimization"]
},{
    id: 30,
    code: "Api",
    label: "API",
    icon: <Globe className="w-8 h-8" />,
    description: "RESTful API development, integration, and optimization.",
    lang: "JavaScript/TypeScript",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-purple-500/20",
    stats: "89+ Endpoints",
    features: ["REST Architecture", "Authentication", "Rate Limiting", "Documentation"]
}
];

const LearningSelection = ["Learning", "Interview"];

const LanguageSelection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLearning, setIsLearning] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const[viewLanguageBadge, setviewLanguageBadge] = useState([]);
    const { darkMode,Setscrolle,scrolle } = useContext(DarkModeContext);
    const { user } = useContext(AuthContext);
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

    useEffect(() => { 
        selectLnguge()
    }, []);
    // Filtered languages based on search and user permissions
    const filteredLanguages = useMemo(() => {
        // console.log(languages);
        let filtered = languages;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(lang =>
                lang.label.toLowerCase().includes(query) ||
                lang.description.toLowerCase().includes(query) ||
                lang.features.some(feature => feature.toLowerCase().includes(query))
            );
        }
        // Filter based on user permissions if user is logged in
        if (user && user.permissions) {
            filtered = filtered.filter(lang => user.permissions.includes(lang.code));
        }
        return filtered;
    }, [searchQuery, user]);

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

    // Ultra-modern dark mode styles with glass morphism
    const darkModeStyles = useMemo(() => ({
        background: darkMode 
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
        cardBackground: darkMode 
            ? "bg-gray-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl" 
            : "bg-white/70 backdrop-blur-2xl border border-gray-200/50 shadow-2xl",
        cardHover: darkMode 
            ? "hover:bg-gray-800/60 hover:border-white/20 hover:shadow-2xl hover:scale-105" 
            : "hover:bg-white/90 hover:border-gray-300/70 hover:shadow-2xl hover:scale-105",
        textPrimary: darkMode ? "text-white" : "text-gray-900",
        textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
        textTertiary: darkMode ? "text-gray-400" : "text-gray-500",
        badgeBackground: darkMode 
            ? "bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-white/10" 
            : "bg-gradient-to-r from-white/80 to-gray-100/80 backdrop-blur-xl border border-gray-200",
        buttonActive: darkMode 
            ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60" 
            : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50",
        buttonInactive: darkMode 
            ? "bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 backdrop-blur-xl border border-white/10 hover:border-white/20" 
            : "bg-white/60 text-gray-600 hover:bg-white/80 backdrop-blur-xl border border-gray-300/50 hover:border-gray-400",
        borderColor: darkMode ? "border-white/10" : "border-gray-200/50",
        glow: darkMode ? "shadow-2xl shadow-blue-500/20" : "shadow-2xl shadow-blue-400/20"
    }),[darkMode]);

    // Floating particles background
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${
                        darkMode ? "bg-blue-500/20" : "bg-blue-400/30"
                    }`}
                    style={{
                        width: Math.random() * 6 + 2,
                        height: Math.random() * 6 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
    const selectLnguge = () => {
        try {
            var lan = window.localStorage.getItem("learningProgress");
            if (!lan) return;
            var parsed = JSON.parse(lan);
            if (typeof parsed !== 'object' || parsed === null) return;
            var data = Object.keys(parsed);
            if (!Array.isArray(data)) return;
            setviewLanguageBadge(data);
        } catch (error) {
            console.error('Error parsing learningProgress:', error);
        }
    }
const RevisionLAnguageSelect=(language)=>{
    resetLearningProgress(language);
    setviewLanguageBadge(prev => prev.filter(lang => lang !== language));
    toast.success(`Removed ${language} from selected languages`);
}
    return (
      <div className={`min-h-screen ${darkModeStyles.background} relative overflow-hidden transition-all duration-700`}>
        {/* CalendarSection */}
        <CalendarInterviewTracker />
        
        {/* Advanced Background Elements */}
        <div className="absolute inset-0">
            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{ 
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className={`absolute top-1/4 left-1/4 w-96 h-96 ${
                    darkMode 
                        ? "bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20" 
                        : "bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-rose-400/30"
                } rounded-full blur-3xl`}
            />
            <motion.div
                animate={{ 
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                    scale: [1.2, 1, 1.2]
                }}
                transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className={`absolute top-3/4 right-1/4 w-80 h-80 ${
                    darkMode 
                        ? "bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20" 
                        : "bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-indigo-400/30"
                } rounded-full blur-3xl`}
            />
            
            {/* Floating Particles */}
            <FloatingParticles />
            
            {/* Grid Background */}
            <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] ${
                darkMode ? "opacity-20" : "opacity-10"
            }`} />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="max-w-7xl w-full"
            >
                {/* Enhanced Header */}
                <motion.div className="text-center mb-16">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-3xl ${darkModeStyles.badgeBackground} backdrop-blur-xl border ${darkModeStyles.glow} transition-all duration-500`}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className={`w-6 h-6 ${darkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                        </motion.div>
                        <span className={`text-sm font-bold ${darkMode ? "text-cyan-300" : "text-cyan-700"} tracking-widest uppercase`}>
                            Next-Gen AI Interview Platform
                        </span>
                        <Rocket className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                    </motion.div>

                    <motion.h1 
                        className={`text-7xl md:text-9xl font-black mb-8 bg-gradient-to-r ${
                            darkMode 
                                ? "from-white via-cyan-300 to-purple-300" 
                                : "from-gray-900 via-blue-700 to-purple-700"
                        } bg-clip-text text-transparent leading-tight`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Interv
                        <motion.span
                            animate={{ 
                                scale: [1, 1.1, 1],
                                color: darkMode ? ["#ef4444", "#f97316", "#ef4444"] : ["#dc2626", "#ea580c", "#dc2626"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mx-2"
                        >
                            iew
                        </motion.span>
                        Master
                    </motion.h1>

                    <motion.p 
                        className={`text-2xl ${darkModeStyles.textSecondary} max-w-3xl mx-auto leading-relaxed`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Transform your technical skills with our{" "}
                        <span className={`font-bold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                            AI-powered interview simulator
                        </span>
                        . Practice, learn, and excel in real-world scenarios.
                    </motion.p>
                </motion.div>

                {/* Enhanced Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    {/* Learning/Interview Selection */}
                    <div className="flex gap-4">
                        {LearningSelection.map((item, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setIsLearning(item)}
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 group overflow-hidden ${
                                    isLearning === item
                                        ? `${darkModeStyles.buttonActive} ${darkModeStyles.glow}`
                                        : darkModeStyles.buttonInactive
                                }`}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {item === "Learning" ? <BookOpen className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                    {item}
                                </span>
                                {isLearning === item && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-3">
                        {/* Search Button */}
                        <motion.button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                transition: { type: "spring", stiffness: 400, damping: 10 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className={`p-4 rounded-2xl transition-all duration-500 ${
                                isSearchOpen
                                    ? `${darkModeStyles.buttonActive} ${darkModeStyles.glow}`
                                    : darkModeStyles.buttonInactive
                            }`}
                        >
                            <Search className="w-6 h-6" />
                        </motion.button>

                        {/* View Mode Toggle */}
                        <motion.button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                transition: { type: "spring", stiffness: 400, damping: 10 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className={`p-4 rounded-2xl transition-all duration-500 ${darkModeStyles.buttonInactive}`}
                        >
                            {viewMode === 'grid' ? <List className="w-6 h-6" /> : <Grid3X3 className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Enhanced Search Bar */}
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="mb-8 max-w-2xl mx-auto"
                    >
                        <div className={`relative ${darkModeStyles.cardBackground} rounded-3xl p-6 backdrop-blur-2xl border ${darkModeStyles.glow} shadow-2xl`}>
                            <div className="flex items-center gap-4">
                                <Search className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-indigo-600'}`} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search technologies, concepts, or features..."
                                    className={`flex-1 bg-transparent border-0 outline-none text-xl font-medium ${
                                        darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                    }`}
                                    autoFocus
                                />
                                <motion.button
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-xl transition-colors ${
                                        darkMode ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Enhanced Results Count */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className={`text-lg ${darkModeStyles.textSecondary} font-medium`}>
                        <span className={`font-bold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                            {filteredLanguages.length}
                        </span> of {languages.length} technologies available
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                            darkMode ? "bg-gray-800/50 text-cyan-300" : "bg-blue-100 text-blue-700"
                        }`}>
                            {viewMode === 'grid' ? 'Grid View' : 'List View'}
                        </span>
                    </p>
                    </motion.div>
                   {/* Language selected Badge - Ultra Modern Design */}
<motion.div 
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
>
    {
        viewLanguageBadge.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
                {
                    viewLanguageBadge.map((language, index) => (
                        <motion.div
                            key={language}
                            className="relative group"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                duration: 0.4,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 120
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                y: -2
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Main Badge */}
                            <div className="relative">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
                                
                                {/* Badge Content */}
                                <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2.5 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                                    {/* Language Text */}
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm whitespace-nowrap" onClick={() => {
                                        setIsLearning("Learning");
                                        handleSelect(language);
                                    }}>
                                        {language}
                                    </span>
                                    
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </div>
                                
                                {/* Floating Particles */}
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-500 font-medium text-sm">No languages selected</span>
                </div>
            </motion.div>
        )
    }
</motion.div>
                {/* Ultra-Modern Languages Grid/List */}
                <motion.div 
                    className={`gap-6 mx-auto ${
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-8xl'
                            : 'flex flex-col max-w-5xl'
                    }`}
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredLanguages.map((lang, index) => (
                            <motion.div
                                key={lang.id}
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                transition={{ 
                                    delay: 0.1 + index * 0.03,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15
                                }}
                                whileHover={{ 
                                    scale: 1.02, 
                                    y: -8,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                onHoverStart={() => setHoveredCard(lang.code)}
                                onHoverEnd={() => setHoveredCard(null)}
                                className={`group cursor-pointer transition-all duration-500 ${
                                    selectedCard === lang.code ? 'scale-95' : ''
                                } ${viewMode === 'list' ? 'w-full' : ''}`}
                            >
                                <div className={`relative h-full ${darkModeStyles.cardBackground} ${darkModeStyles.cardHover} rounded-3xl border p-8 overflow-hidden transition-all duration-500 ${
                                    viewMode === 'list' ? 'flex items-center gap-8' : ''
                                }`}>
                                    {/* Animated Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${lang.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                                    
                                    {/* Floating Elements */}
                                    <motion.div
                                        className={`absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r ${lang.gradient} opacity-0 group-hover:opacity-100`}
                                        animate={hoveredCard === lang.code ? { scale: [0, 1.2, 1], rotate: [0, 180, 360] } : {}}
                                        transition={{ duration: 1 }}
                                    />
                                    
                                    <div className={`relative z-10 ${viewMode === 'list' ? 'flex items-center gap-8 w-full' : ''}`}>
                                        {/* Enhanced Card Header */}
                                        <div className={`flex items-center ${viewMode === 'list' ? 'gap-8 flex-1' : 'justify-between mb-8'}`}>
                                            <motion.div
                                                animate={hoveredCard === lang.code ? { 
                                                    scale: [1, 1.3, 1], 
                                                    rotate: [0, 10, -10, 0],
                                                    y: [0, -5, 0]
                                                } : {}}
                                                transition={{ duration: 0.6 }}
                                                className={`p-4 rounded-2xl bg-gradient-to-r ${lang.gradient} shadow-2xl ${
                                                    viewMode === 'list' ? 'flex-shrink-0' : ''
                                                }`}
                                            >
                                                {lang.icon}
                                            </motion.div>
                                            
                                            <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                                                <h3 className={`text-3xl font-bold ${darkModeStyles.textPrimary} mb-4 leading-tight`}>
                                                    {lang.label}
                                                </h3>
                                                <p className={`${darkModeStyles.textSecondary} ${viewMode === 'list' ? 'text-xl leading-relaxed' : 'text-lg mb-8 leading-relaxed'}`}>
                                                    {lang.description}
                                                </p>
                                            </div>

                                            <motion.div
                                                whileHover={{
                                                    scale: 1.6,
                                                    x: [0, 10, 0],
                                                    transition: {
                                                        scale: { duration: 0.2 },
                                                        x: { duration: 0.8, ease: "easeInOut" }
                                                    }
                                                }}
                                                className="relative"
                                            >
                                                <motion.div
                                                    animate={hoveredCard === lang.code ? { 
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 1, 0.5]
                                                    } : {}}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${lang.gradient} blur-md`}
                                                />
                                                <ArrowRight 
                                                    onClick={() => handleSelect(lang.code)} 
                                                    className={`relative w-8 h-8 ${
                                                        darkMode ? "text-gray-300 group-hover:text-white" : "text-gray-500 group-hover:text-gray-800"
                                                    } transition-colors duration-300`} 
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Enhanced Features List - Only show in grid mode */}
                                        {viewMode === 'grid' && (
                                            <div className="grid grid-cols-2 gap-3 mb-8">
                                                {lang.features.map((feature, i) => (
                                                    <motion.div 
                                                        key={i} 
                                                        className={`flex items-center gap-3 text-sm font-medium ${darkModeStyles.textTertiary} p-3 rounded-xl backdrop-blur-sm ${
                                                            darkMode ? "bg-white/5" : "bg-black/5"
                                                        }`}
                                                        whileHover={{ scale: 1.05, x: 5 }}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${lang.gradient}`} />
                                                        {feature}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Enhanced Card Footer */}
                                        <div className={`flex items-center justify-between pt-6 border-t ${darkModeStyles.borderColor}`}>
                                            <div className={`flex items-center gap-3 text-sm font-semibold ${
                                                darkMode ? "text-cyan-400" : "text-cyan-600"
                                            }`}>
                                                <motion.div
                                                    animate={{ rotate: [0, 360] }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Star className="w-5 h-5" />
                                                </motion.div>
                                                {lang.stats}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {isLearning === "Learning" && getLearningProgress(lang.code) !== null && (
                                                    <div className="flex items-center gap-3">
                                                        <BookOpen className={`w-5 h-5 ${
                                                            darkMode ? "text-blue-400" : "text-blue-600"
                                                        }`} />
                                                        <span className={`text-sm font-medium ${
                                                            darkMode ? "text-blue-300" : "text-blue-700"
                                                        }`}>
                                                            Progress: Q{getLearningProgress(lang.code) + 1}
                                                        </span>
                                                        <motion.button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                resetLearningProgress(lang.code);
                                                                toast.success(`Progress reset for ${lang.label}`);
                                                            }}
                                                            whileHover={{ scale: 1.2, rotate: 180 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className={`p-2 rounded-xl transition-colors ${
                                                                darkMode ? "hover:bg-gray-700/50 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                                                            }`}
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                )}
                                                <div className="flex gap-3">
                                                    <motion.div whileHover={{ scale: 1.2 }}>
                                                        <Mic2 className={`w-5 h-5 ${
                                                            darkMode ? "text-green-400" : "text-green-600"
                                                        }`} />
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.2 }}>
                                                        <Video className={`w-5 h-5 ${
                                                            darkMode ? "text-purple-400" : "text-purple-600"
                                                        }`} />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Enhanced Empty State */}
                {filteredLanguages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mb-6"
                        >
                            <Target className={`w-24 h-24 mx-auto ${
                                darkMode ? "text-gray-600" : "text-gray-400"
                            }`} />
                        </motion.div>
                        <p className={`text-2xl font-bold ${darkModeStyles.textSecondary} mb-4`}>
                            No matching technologies found
                        </p>
                        <p className={`text-lg ${darkModeStyles.textTertiary} mb-8 max-w-md mx-auto`}>
                            Try adjusting your search terms or browse all available technologies
                        </p>
                        <motion.button
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearchOpen(false);
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${darkModeStyles.buttonInactive}`}
                        >
                            Show All Technologies
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
      </div>
    );
};

export default  React.memo(LanguageSelection);
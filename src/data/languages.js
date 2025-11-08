import { Code2, Cloud, Zap, Cpu, Sparkles, ArrowRight, Star, Mic2, Video, Layers, Workflow, Database, GitBranch, Search, X, RotateCcw, BookOpen, List, Grid3X3, Play, Users, Target, Rocket } from "lucide-react";
const languages = [{
    id: 1, code: "Personal", label: "Personal Development", icon: <Code2 className="w-8 h-8" />,
    description: "Master C# programming with .NET ecosystem", lang: "C#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    stats: "100+ Questions", features: ["ASP.NET Core", "Entity Framework", "LINQ", "Blazor"]
},
{
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
    id: 15, code: "coding", label: "C# coding", icon: <Code2 className="w-8 h-8" />,
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
}
];
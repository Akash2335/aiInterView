import React, { useState, useEffect } from "react";
import { Clipboard, Check, ChevronDown, ChevronRight } from "lucide-react";
import useInterviewQuestionsAnswer from '../hooks/useInterviewQuestionsAnswer';
import { useParams } from 'react-router-dom';

const UltimateJsonViewer = ({ language }) => {
    const { code } = useParams();
    
    const {
        questions: jsonData,
        loading,
        error,
        getCategories,
        searchQuestions
    } = useInterviewQuestionsAnswer(language);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState("all");

    // Get unique categories using the hook's method
    const uniqueCategories = getCategories();

    // Set default selected category when categories are available
    useEffect(() => {
        if (uniqueCategories.length > 0 && !selectedCategory) {
            setSelectedCategory(uniqueCategories[0]);
        }
    }, [uniqueCategories, selectedCategory]);

    const filteredData = jsonData.filter(item => 
        item && 
        item.category === selectedCategory &&
        (item.question && item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (item.tags && Array.isArray(item.tags) && item.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase())) ||
         (item.difficulty && item.difficulty.toLowerCase().includes(searchTerm.toLowerCase())) ||
         // FIX: Use followUps (with capital U) to match your JSON
         (item.followUps && Array.isArray(item.followUps) && item.followUps.some(followUp => 
           followUp && followUp.toLowerCase().includes(searchTerm.toLowerCase())
         ))) &&
        (difficultyFilter === "all" || item.difficulty === difficultyFilter)
    );

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading questions...</p>
                    <p className="text-gray-400 text-sm mt-2">Loading data for: {language}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <Clipboard size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Questions</h2>
                    <p className="text-red-500 mb-4">{error}</p>
                    <p className="text-gray-500 text-sm">Language: {language}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <Clipboard size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Questions Available</h2>
                    <p className="text-gray-500">No questions found for: {language}</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Check if the JSON file exists
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
                    {language ? `${language.toUpperCase()} Questions` : 'Question Bank'}
                </h1>
                <p className="text-gray-600 text-center mb-6">Browse and search through technical questions and answers</p>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>
                                {category ? category.toUpperCase() : 'UNCATEGORIZED'}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={difficultyFilter}
                        onChange={e => setDifficultyFilter(e.target.value)}
                    >
                        <option value="all">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search questions, tags, difficulty, follow-ups..."
                        className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 md:col-span-2"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Total: {jsonData.length}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Filtered: {filteredData.length}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        Category: {selectedCategory || 'None'}
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                        Categories: {uniqueCategories.length}
                    </span>
                </div>
            </div>

            {/* Q&A Cards */}
            <div className="space-y-4">
                {filteredData.length > 0 ? filteredData.map(item => (
                    item && (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <button
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-start gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty || 'Unknown'}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {item.id}</span>
                                </div>
                                <h3 className="font-semibold text-gray-800 text-lg leading-relaxed">{item.question}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {expandedId === item.id ? (
                                    <ChevronDown className="text-gray-400" size={20} />
                                ) : (
                                    <ChevronRight className="text-gray-400" size={20} />
                                )}
                            </div>
                        </button>

                        {expandedId === item.id && (
                            <div className="p-6 border-t border-gray-100 space-y-6 bg-gray-50">
                                {/* Follow-up Questions - FIXED: Use followUps (with capital U) */}
                                {Array.isArray(item.followUps) && item.followUps.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <span>Follow-up Questions</span>
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                {item.followUps.length}
                                            </span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {item.followUps.map((followUp, index) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{followUp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tags */}
                                {Array.isArray(item.tags) && item.tags.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Answer */}
                                {item.answer && (
                                    <div className="relative">
                                        <h4 className="font-semibold text-gray-700 mb-3">Answer</h4>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                            <button
                                                onClick={() => handleCopy(item.answer, `answer-${item.id}`)}
                                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                title="Copy answer"
                                            >
                                                {copiedId === `answer-${item.id}` ? (
                                                    <Check className="text-green-500" size={18} />
                                                ) : (
                                                    <Clipboard size={18} className="text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Example */}
                                {item.example && (
                                    <div className="relative">
                                        <h4 className="font-semibold text-gray-700 mb-3">Example</h4>
                                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                                            <pre className="text-sm overflow-auto whitespace-pre-wrap font-mono">
                                                {item.example}
                                            </pre>
                                            <button
                                                onClick={() => handleCopy(item.example, `example-${item.id}`)}
                                                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                                title="Copy example"
                                            >
                                                {copiedId === `example-${item.id}` ? (
                                                    <Check className="text-green-400" size={16} />
                                                ) : (
                                                    <Clipboard size={16} className="text-gray-300" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Note */}
                                {item.note && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-yellow-800 mb-2">Note</h4>
                                        <p className="text-yellow-700 text-sm">{item.note}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    )
                )) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Clipboard size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg">No questions found for your search criteria.</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Try adjusting your search terms or selecting a different category
                        </p>
                        <div className="mt-4 text-xs text-gray-500">
                            <p>Available categories: {uniqueCategories.join(', ') || 'None'}</p>
                            <p>Selected category: {selectedCategory || 'None'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UltimateJsonViewer;
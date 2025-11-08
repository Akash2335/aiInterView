export const getDarkModeStyles = (darkMode) => ({
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
});
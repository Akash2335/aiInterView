// Pre-compiled regex patterns for better performance
const PATTERNS = {
  words: /\s+/,
  sentences: /[.!?]+/,
  examples: /\b(example|instance|project|case\s+study)\b/i,
  metrics: /\b\d+(?:\.\d+)?%?|\d+\s*(?:years?|yrs?|\+|\$)|[$€£¥]\d+/i,
  actionVerbs: /\b(developed|created|built|managed|led|improved|optimized|implemented|delivered)\b/i,
  yourself: /\byourself|\babout\s+you\b|introduce|background\b/i,
  project: /\bproject\b|initiative|assignment/i,
  team: /\bteam\b|collaborat|work\s+with|colleagues/i,
  technical: /\btechnical\b|tech|code|programming|software|algorithm/i
};

// Pre-defined feedback templates for consistency and performance
const FEEDBACK_TEMPLATES = {
  length: [
    { threshold: 15, feedback: '🔍 Good start! Try to elaborate with specific examples.' },
    { threshold: 30, feedback: '👍 Solid answer! Consider adding more details.' },
    { threshold: 50, feedback: "🌟 Outstanding! Comprehensive and detailed answer. Great use of action-oriented language!" },
    { threshold: Infinity, feedback: '🌟 Outstanding! Comprehensive and detailed answer.' }
  ],
  content: {
    examples: ' Try adding real-world examples.',
    metrics: ' Include numbers to quantify achievements.',
    actionVerbs: ' Great use of action-oriented language!'
  },
  questionSpecific: {
    yourself: '👤 Excellent introduction! You clearly highlighted key strengths and experience.',
    project: '🚀 Strong project explanation! You demonstrated problem-solving skills effectively.',
    team: '🤝 Great teamwork example! You showed collaboration and leadership qualities.',
    technical: '💻 Solid technical depth! You explained complex concepts clearly.'
  }
};

// Pre-computed priority mappings for faster lookups
const PRIORITY_MAP = new Map([
  ['challenge', 'challenge'],
  ['team', 'team'],
  ['goal', 'goal'],
  ['problem', 'problem'],
  ['technical', '?'],
  ['leadership', 'leadership']
]);

/**
 * Determine if a follow-up question should be asked with optimized logic
 * @param {string} answer - User's answer
 * @param {number} minWords - Minimum words to trigger follow-up (default 20)
 * @param {number} probability - Probability threshold (0-1) for randomness (default 0.6)
 * @returns {boolean}
 */
export const shouldAskFollowUp = (answer, minWords = 20, probability = 0.6) => {
  if (!answer?.trim()) return false;
  
  const wordCount = answer.trim().split(PATTERNS.words).length;
  return wordCount > minWords && Math.random() > (1 - probability);
};

/**
 * Pick the most relevant follow-up question using efficient string operations
 * @param {string} answer - User's answer
 * @param {string[]} followUps - Array of potential follow-ups
 * @returns {string}
 */
export const pickFollowUp = (answer, followUps) => {
  if (!followUps?.length) return '';
  if (followUps.length === 1) return followUps[0];
  
  const lowerAnswer = answer.toLowerCase();
  
  // Use Map for O(1) lookups instead of array iteration
  for (const [key, match] of PRIORITY_MAP) {
    if (lowerAnswer.includes(key)) {
      const matchedFollowUp = followUps.find(f => 
        f.toLowerCase().includes(match)
      );
      if (matchedFollowUp) return matchedFollowUp;
    }
  }
  
  // Cache-friendly random selection
  return followUps[Math.random() * followUps.length | 0];
};

/**
 * Analyze answer content with optimized pattern matching
 * @param {string} answer
 * @returns {Object}
 */
const analyzeAnswerContent = (answer) => {
  const trimmedAnswer = answer.trim();
  const words = trimmedAnswer.split(PATTERNS.words);
  const sentences = trimmedAnswer.split(PATTERNS.sentences).filter(Boolean);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length || 1,
    avgSentenceLength: words.length / (sentences.length || 1),
    hasExamples: PATTERNS.examples.test(trimmedAnswer),
    hasMetrics: PATTERNS.metrics.test(trimmedAnswer),
    hasActionVerbs: PATTERNS.actionVerbs.test(trimmedAnswer)
  };
};

/**
 * Generate base feedback based on answer length
 * @param {number} wordCount
 * @returns {string}
 */
const getLengthBasedFeedback = (wordCount) => {
  for (const { threshold, feedback } of FEEDBACK_TEMPLATES.length) {
    if (wordCount < threshold) return feedback;
  }
  return FEEDBACK_TEMPLATES.length[FEEDBACK_TEMPLATES.length - 1].feedback;
};

/**
 * Generate content enhancement feedback
 * @param {Object} analysis
 * @returns {string}
 */
const getContentFeedback = (analysis) => {
  let feedback = '';
  const { content } = FEEDBACK_TEMPLATES;
  
  if (!analysis.hasExamples) feedback += content.examples;
  if (!analysis.hasMetrics) feedback += content.metrics;
  if (analysis.hasActionVerbs) feedback += content.actionVerbs;
  
  return feedback;
};

/**
 * Generate question-specific feedback
 * @param {string} question
 * @returns {string}
 */
const getQuestionSpecificFeedback = (question) => {
  const lowerQ = question.toLowerCase();
  
  if (PATTERNS.yourself.test(lowerQ)) return FEEDBACK_TEMPLATES.questionSpecific.yourself;
  if (PATTERNS.project.test(lowerQ)) return FEEDBACK_TEMPLATES.questionSpecific.project;
  if (PATTERNS.team.test(lowerQ)) return FEEDBACK_TEMPLATES.questionSpecific.team;
  if (PATTERNS.technical.test(lowerQ)) return FEEDBACK_TEMPLATES.questionSpecific.technical;
  
  return '';
};

/**
 * Generate advanced AI-style feedback with optimized performance
 * @param {string} answer
 * @param {string} question
 * @returns {string}
 */
export const generateAdvancedFeedback = (answer, question = '') => {
  if (!answer?.trim()) return 'Please provide an answer to receive feedback.';
  
  const analysis = analyzeAnswerContent(answer);
  let feedback = getLengthBasedFeedback(analysis.wordCount);
  
  // Use question-specific feedback when available, otherwise enhance with content feedback
  const questionFeedback = getQuestionSpecificFeedback(question);
  if (questionFeedback) {
    feedback = questionFeedback;
  } else {
    feedback += getContentFeedback(analysis);
  }
  
  return feedback;
};

// Alternative export for bulk analysis
export const analyzeAnswer = (answer) => {
  return analyzeAnswerContent(answer);
};

// Utility function for testing and debugging
export const getFeedbackStats = (answer, question = '') => {
  const analysis = analyzeAnswerContent(answer);
  const feedback = generateAdvancedFeedback(answer, question);
  
  return {
    analysis,
    feedback,
    wordCount: analysis.wordCount,
    sentenceCount: analysis.sentenceCount
  };
};
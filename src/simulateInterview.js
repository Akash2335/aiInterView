// Script to simulate completed interviews for testing
const sampleInterviewData = [
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces, particularly for web applications. It allows developers to create reusable UI components and manage the state of those components efficiently.",
    "feedback": "Great answer! You covered the key points about React being a library for UI development and component reusability.",
    "timestamp": "2024-12-15T10:30:16.311Z",
    "duration": 45,
    "performanceScore": 8.5,
    "confidenceLevel": 7.2,
    "emotionalTone": "confident",
    "wordCount": 32,
    "language": "React"
  },
  {
    "question": "Explain the concept of state in React.",
    "answer": "State in React is an object that holds data that may change over the lifetime of the component. When state changes, React re-renders the component to reflect those changes.",
    "feedback": "Excellent explanation! You correctly described state as mutable data that triggers re-renders.",
    "timestamp": "2024-12-16T14:22:16.311Z",
    "duration": 38,
    "performanceScore": 9,
    "confidenceLevel": 8.1,
    "emotionalTone": "enthusiastic",
    "wordCount": 28,
    "language": "React"
  },
  {
    "question": "What are React Hooks?",
    "answer": "React Hooks are functions that let you use state and other React features in functional components. They allow you to manage state, side effects, and component lifecycle without writing class components.",
    "feedback": "Perfect! You accurately described hooks as functions for state management in functional components.",
    "timestamp": "2024-12-17T09:15:16.311Z",
    "duration": 52,
    "performanceScore": 9.2,
    "confidenceLevel": 8.5,
    "emotionalTone": "knowledgeable",
    "wordCount": 35,
    "language": "React"
  },
  {
    "question": "What is JSX?",
    "answer": "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets transpiled to React.createElement() calls.",
    "feedback": "Good answer! You mentioned the key aspects of JSX syntax and its transpilation.",
    "timestamp": "2024-12-18T16:45:16.311Z",
    "duration": 29,
    "performanceScore": 7.8,
    "confidenceLevel": 6.9,
    "emotionalTone": "clear",
    "wordCount": 22,
    "language": "React"
  },
  {
    "question": "Explain the virtual DOM in React.",
    "answer": "The virtual DOM is a lightweight representation of the actual DOM. React uses it to track changes and efficiently update only the parts of the real DOM that have changed, improving performance.",
    "feedback": "Excellent explanation of the virtual DOM concept and its performance benefits!",
    "timestamp": "2024-12-19T11:20:16.311Z",
    "duration": 41,
    "performanceScore": 9.5,
    "confidenceLevel": 8.8,
    "emotionalTone": "confident",
    "wordCount": 30,
    "language": "React"
  }
];

// Function to populate localStorage with sample data
export const populateInterviewHistory = (force = false) => {
  const existingData = localStorage.getItem('interviewHistory');
  let currentHistory = [];

  if (existingData && !force) {
    try {
      const parsed = JSON.parse(existingData);
      currentHistory = Array.isArray(parsed) ? parsed : (parsed.data && Array.isArray(parsed.data) ? parsed.data : []);
    } catch (error) {
      console.error('Error parsing existing history:', error);
    }
  }

  // Add sample data if history is empty or force is true
  if (currentHistory.length === 0 || force) {
    localStorage.setItem('interviewHistory', JSON.stringify(sampleInterviewData));
    // console.log('Sample interview history populated!');
    return sampleInterviewData;
  } else {
    console.log('Interview history already exists with', currentHistory.length, 'entries');
    return currentHistory;
  }
};

// Function to clear interview history
export const clearInterviewHistory = () => {
  localStorage.removeItem('interviewHistory');
  console.log('Interview history cleared!');
};

// Function to get current interview history
export const getInterviewHistory = () => {
  const data = localStorage.getItem('interviewHistory');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : (parsed.data && Array.isArray(parsed.data) ? parsed.data : []);
    } catch (error) {
      console.error('Error parsing history:', error);
      return [];
    }
  }
  return [];
};

// Auto-populate if this script is run directly
if (typeof window !== 'undefined') {
  // Force populate immediately when module loads
  populateInterviewHistory(true);
}

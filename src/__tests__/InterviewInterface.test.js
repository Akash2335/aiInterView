import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InterviewInterface from '../InterviewInterface';

// Mock all external dependencies
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  useParams: () => ({ language: 'Testing', mode: 'interview' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  Navigate: () => null,
  Outlet: () => null,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Crown: () => <div data-testid="crown-icon">Crown</div>,
}));

// Mock custom hooks
jest.mock('../useInterviewQuestions', () => ({
  __esModule: true,
  default: () => [
    { question: 'What is React?', category: 'Basic', answer: 'A JS library' },
    { question: 'What is state?', category: 'Advanced' },
  ],
}));

jest.mock('../hooks/useInterviewAnalytics', () => ({
  __esModule: true,
  default: () => ({
    performanceScore: 85,
    confidenceLevel: 80,
    speechRate: 150,
    emotionalTone: 'confident',
    aiInsights: ['Good answer'],
    setPerformanceScore: jest.fn(),
    setConfidenceLevel: jest.fn(),
    setAiInsights: jest.fn(),
    calculatePerformanceScore: jest.fn(() => 85),
    analyzeConfidence: jest.fn(() => 80),
    generateAIInsights: jest.fn(),
    generateInitialInsights: jest.fn(),
  }),
}));

jest.mock('../hooks/useInterviewHistory', () => ({
  __esModule: true,
  default: () => ({
    history: [],
    addToHistory: jest.fn(),
    clearHistory: jest.fn(),
    calculateOverallScore: jest.fn(() => 85),
    getTotalDuration: jest.fn(() => 300),
    batchAddToHistory: jest.fn(),
  }),
}));

jest.mock('../hooks/useSpeechRecognition', () => ({
  __esModule: true,
  default: () => ({
    startListening: jest.fn(() => true),
    stopListening: jest.fn(),
  }),
}));

// Mock components
jest.mock('../CameraRecorder', () => {
  return function MockCameraRecorder({ onData, setRecordingState, cameraState, setCameraState }) {
    return (
      <div data-testid="camera-recorder">
        <button onClick={() => setRecordingState(true)}>Start Recording</button>
        <button onClick={() => onData(new Blob())}>Record Data</button>
      </div>
    );
  };
});

jest.mock('../DraggableCamera', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="draggable-camera">{children}</div>,
}));

jest.mock('../Components/ProgressBar', () => {
  return function MockProgressBar({ currentIndex, questions }) {
    return <div data-testid="progress-bar">Progress: {currentIndex}/{questions.length}</div>;
  };
});

jest.mock('../Components/Microphone', () => {
  return function MockMicrophone({ isListening, stopListening, startListening }) {
    return (
      <div data-testid="microphone">
        <button onClick={startListening}>Start Mic</button>
        <button onClick={stopListening}>Stop Mic</button>
        Status: {isListening ? 'Listening' : 'Not Listening'}
      </div>
    );
  };
});

jest.mock('../Components/InterviewComplete', () => {
  return function MockInterviewComplete({ reset }) {
    return (
      <div data-testid="interview-complete">
        <button onClick={reset}>Reset Interview</button>
      </div>
    );
  };
});

jest.mock('../Components/TranscriptDisplay', () => {
  return function MockTranscriptDisplay({ transcript }) {
    return <div data-testid="transcript-display">{transcript}</div>;
  };
});

jest.mock('../Components/AIFeedback', () => {
  return function MockAIFeedback({ aiFeedback }) {
    return <div data-testid="ai-feedback">{aiFeedback}</div>;
  };
});

jest.mock('../Components/Question/QuestionPanel', () => {
  return function MockQuestionPanel({ children, question, category }) {
    return (
      <div data-testid="question-panel">
        <div>Question: {question}</div>
        <div>Category: {category}</div>
        {children}
      </div>
    );
  };
});

jest.mock('../Components/InterviewControls/ControlButtons', () => {
  return function MockControlButtons({ onStartAnswer, onStopAnswer, onReset }) {
    return (
      <div data-testid="control-buttons">
        <button onClick={onStartAnswer}>Start Answer</button>
        <button onClick={onStopAnswer}>Stop Answer</button>
        <button onClick={onReset}>Reset</button>
      </div>
    );
  };
});

jest.mock('../Components/UI/KeyboardShortcuts', () => {
  return function MockKeyboardShortcuts({ isVisible, onClose }) {
    return isVisible ? (
      <div data-testid="keyboard-shortcuts">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock('../Components/Analytics/AnalyticsDashboard', () => {
  return function MockAnalyticsDashboard({ showAnalytics, onToggleAnalytics }) {
    return showAnalytics ? (
      <div data-testid="analytics-dashboard">
        <button onClick={onToggleAnalytics}>Toggle Analytics</button>
      </div>
    ) : null;
  };
});

jest.mock('../Components/UI/AICorner', () => {
  return function MockAICorner() {
    return <div data-testid="ai-corner">AI Corner</div>;
  };
});

// Mock utils
jest.mock('../utils/exportUtils', () => ({
  exportJSON: jest.fn(),
  exportPDF: jest.fn(),
}));

jest.mock('../utils/questionUtils', () => ({
  shouldAskFollowUp: jest.fn(() => false),
  pickFollowUp: jest.fn(),
  generateAdvancedFeedback: jest.fn(() => 'Good answer!'),
}));

jest.mock('../utils/speechUtils', () => ({
  speakWithEmotion: jest.fn(),
  speak: jest.fn(),
  initializeAudioAnalysis: jest.fn(),
}));

// Mock context
jest.mock('../App', () => ({
  DarkModeContext: {
    Consumer: ({ children }) => children({ darkMode: false }),
    Provider: ({ children }) => children,
  },
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('InterviewInterface Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-video-url');
    global.URL.revokeObjectURL = jest.fn();
    // Mock speechSynthesis
    global.speechSynthesis = {
      cancel: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders loading screen initially', () => {
    renderWithProviders(<InterviewInterface />);

    expect(screen.getByText('Initializing AI-Powered Interview...')).toBeInTheDocument();
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
  });

  test('renders interview interface after loading', async () => {
    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    });

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('camera-recorder')).toBeInTheDocument();
    expect(screen.getByTestId('control-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('microphone')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-display')).toBeInTheDocument();
  });

  test('displays current question', async () => {
    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByText('Question: What is React?')).toBeInTheDocument();
    });

    expect(screen.getByText('Category: Basic')).toBeInTheDocument();
  });

  test('handles start answer button click', async () => {
    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    });

    const startButton = screen.getByText('Start Answer');
    fireEvent.click(startButton);

    // Should show error if camera not recording
    await waitFor(() => {
      expect(require('react-hot-toast').error).toHaveBeenCalledWith('🎥 Please start camera recording first!');
    });
  });

  test('handles reset interview', async () => {
    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(require('react-hot-toast').success).toHaveBeenCalledWith('🔄 Interview reset!');
    });
  });

  test('shows interview complete when finished', async () => {
    // Mock completed interview state
    jest.mock('../useInterviewQuestions', () => ({
      __esModule: true,
      default: () => [
        { question: 'What is React?', category: 'Basic', answer: 'A JS library' },
      ],
    }));

    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('interview-complete')).toBeInTheDocument();
    });
  });

  test('handles camera recording', async () => {
    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('camera-recorder')).toBeInTheDocument();
    });

    const recordButton = screen.getByText('Record Data');
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(require('react-hot-toast').success).toHaveBeenCalledWith('📹 Video recorded successfully!');
    });
  });

  test('applies dark mode styles', async () => {
    // Mock dark mode context
    jest.mock('../App', () => ({
      DarkModeContext: {
        Consumer: ({ children }) => children({ darkMode: true }),
        Provider: ({ children }) => children,
      },
    }));

    renderWithProviders(<InterviewInterface />);

    await waitFor(() => {
      // Check that the component renders in dark mode context
      expect(screen.getByTestId('question-panel')).toBeInTheDocument();
    });
  });
});

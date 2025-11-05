# AI-Powered Technical Interview Platform

## 🚀 Overview

A modern, interactive technical interview platform that uses AI to conduct realistic coding interviews with real-time feedback, speech recognition, and video recording capabilities.

## 📁 Project Structure

```
D:.
├── 📄 Root Files
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   ├── index.js                # Application entry point
│   ├── index.css               # Base styles
│   └── credentials.json        # API credentials
│
├── 🔧 Core Components
│   ├── CameraRecorder.jsx      # Video recording functionality
│   ├── DraggableCamera.jsx     # Movable camera interface
│   ├── InterviewInterface.jsx  # Main interview interface
│   ├── initFaceObserver.jsx    # Face detection initialization
│   ├── loadModels.jsx          # AI model loading
│   └── ProtectedRoute.jsx      # Authentication protection
│
├── 📦 Components/
│   ├── 🎯 Core UI
│   │   ├── LanguageSelection.jsx    # Technology selection
│   │   ├── Login.jsx                # User authentication
│   │   ├── Register.jsx             # User registration
│   │   ├── ModernQADisplay.jsx      # Question/Answer display
│   │   └── ProgressBar.jsx          # Interview progress
│   │
│   ├── 🎙️ Interview Features
│   │   ├── AIFeedback.jsx           # Real-time AI feedback
│   │   ├── Microphone.jsx           # Speech recognition
│   │   ├── TranscriptDisplay.jsx    # Speech-to-text display
│   │   └── HoverButtons.jsx         # Contextual controls
│   │
│   ├── 🎮 Controls
│   │   ├── InterviewControls/ControlButtons.jsx  # Main controls
│   │   └── Question/QuestionPanel.jsx            # Question display
│   │
│   ├── 📊 Analytics
│   │   └── AnalyticsDashboard.jsx   # Performance metrics
│   │
│   └── 🎨 UI Components
│       ├── AICorner.jsx             # AI assistant interface
│       ├── KeyboardShortcuts.jsx    # Hotkey guide
│       ├── TabColorManager.jsx      # Dynamic tab styling
│       └── UltimateJsonViewer.jsx   # Data visualization
│
├── ⚡ Hooks/
│   ├── useSpeechRecognition.jsx     # Speech-to-text hook
│   ├── useInterviewAnalytics.jsx    # Analytics tracking
│   ├── useInterviewHistory.jsx      # Session history
│   ├── useInterviewQuestionsAnswer.jsx # Q&A management
│   └── MouseFollower.jsx            # Cursor effects
│
├── 📄 Pages/
│   ├── Header.jsx                   # Navigation header
│   ├── Footer.jsx                   # Application footer
│   └── Arrow.jsx                    # UI navigation elements
│
└── 🔧 Utils/
    ├── AuthProvider.jsx             # Authentication context
    ├── exportUtils.jsx              # Data export functionality
    ├── questionUtils.jsx            # Question management
    └── speechUtils.jsx              # Speech processing utilities
```

## 🎯 Key Features

### 🤖 AI-Powered Interviews
- **Real-time AI Feedback**: Get instant feedback on your answers
- **Speech Recognition**: Convert spoken answers to text
- **Face Detection**: Monitor engagement and attention
- **Smart Questioning**: Adaptive question difficulty based on performance

### 🎥 Recording & Analysis
- **Video Recording**: Record your interview sessions
- **Draggable Camera**: Flexible camera positioning
- **Transcript Generation**: Automatic speech-to-text conversion
- **Performance Analytics**: Track improvement over time

### 🎨 User Experience
- **Dark/Light Mode**: Full theme support
- **Responsive Design**: Works on all device sizes
- **Keyboard Shortcuts**: Efficient navigation
- **Progress Tracking**: Visual progress indicators

### 🔒 Security & Authentication
- **Protected Routes**: Secure interview sessions
- **User Registration**: Personal account creation
- **Session Management**: Secure authentication flow

## 🛠️ Technology Stack

- **Frontend**: React.js with modern hooks
- **Styling**: Tailwind CSS with custom animations
- **AI/ML**: Face detection and speech recognition APIs
- **State Management**: React Context API
- **Animation**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API credentials in `credentials.json`
4. Start the development server:
   ```bash
   npm start
   ```

## 📱 Usage

### 1. **Authentication**
- Register a new account or login
- Access protected interview features

### 2. **Technology Selection**
- Choose from multiple tech stacks:
  - C# & .NET
  - React.js
  - AWS Cloud
  - SQL & Database Design
  - CI/CD & DevOps

### 3. **Interview Modes**
- **Learning Mode**: Practice with guided answers
- **Interview Mode**: Simulated real interviews

### 4. **During Interview**
- Speak your answers (automatic transcription)
- Receive real-time AI feedback
- Record video responses
- Track progress with visual indicators

### 5. **Post-Interview**
- Review performance analytics
- Export session data
- Track improvement over time

## 🎮 Keyboard Shortcuts

- `Space` - Start/stop recording
- `Escape` - Reset interview
- `Tab` - Toggle shortcuts panel
- `Ctrl+S` - Save progress
- `Ctrl+E` - Export data

## 🔧 Configuration

### Environment Setup
Create a `credentials.json` file with your API keys:

```json
{
  "speechRecognition": "your-api-key",
  "faceDetection": "your-api-key",
  "aiService": "your-api-key"
}
```

### Customization
- Modify question banks in `utils/questionUtils.jsx`
- Adjust AI feedback parameters in `Components/AIFeedback.jsx`
- Customize themes in `App.css` and component styles

## 📊 Analytics & Reporting

The platform provides comprehensive analytics:
- Answer accuracy metrics
- Speaking pace analysis
- Technical knowledge assessment
- Progress tracking over time
- Exportable session reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for developers preparing for technical interviews**
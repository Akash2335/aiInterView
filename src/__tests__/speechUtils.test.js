import { getSpeechManager, speak, speakWithEmotion, stopSpeech, pauseSpeech, resumeSpeech, isSpeaking } from '../utils/speechUtils';

// Mock SpeechSynthesis API
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(),
  speaking: false,
  paused: false,
  onvoiceschanged: null,
};

const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  lang: '',
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: null,
  onstart: null,
  onend: null,
  onerror: null,
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true,
});

// Mock AudioContext
const mockAudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn(() => ({
    fftSize: 2048,
    smoothingTimeConstant: 0.85,
    minDecibels: -90,
    maxDecibels: -10,
    frequencyBinCount: 1024,
    getByteFrequencyData: jest.fn(),
  })),
  close: jest.fn(),
  state: 'running',
}));

Object.defineProperty(window, 'AudioContext', {
  value: mockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: mockAudioContext,
  writable: true,
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

describe('SpeechUtils', () => {
  let speechManager;

  beforeEach(() => {
    jest.clearAllMocks();
    speechManager = getSpeechManager();
    // Reset singleton instance for clean tests
    speechManager.destroy();
  });

  afterEach(() => {
    speechManager.destroy();
  });

  describe('getSpeechManager', () => {
    test('returns singleton instance', () => {
      const instance1 = getSpeechManager();
      const instance2 = getSpeechManager();
      expect(instance1).toBe(instance2);
    });
  });

  describe('speak', () => {
    test('speaks text with default options', () => {
      const result = speak('Hello world');
      expect(result).toBe(true);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
    });

    test('speaks text with custom options', () => {
      const options = { rate: 1.2, pitch: 1.5, volume: 0.8 };
      speak('Hello world', options);
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
    });

    test('cancels current speech when cancelCurrent is true', () => {
      speak('First message');
      speak('Second message', { cancelCurrent: true });
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    test('returns false for empty text', () => {
      const result = speak('');
      expect(result).toBe(false);
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    });

    test('handles speech synthesis errors', () => {
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech synthesis error');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = speak('Hello world');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('speakWithEmotion', () => {
    test('speaks with emotion settings', () => {
      speakWithEmotion('Exciting news!');
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Exciting news!');
    });
  });

  describe('stopSpeech', () => {
    test('stops current speech', () => {
      mockSpeechSynthesis.speaking = true;
      stopSpeech();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    test('does nothing when not speaking', () => {
      mockSpeechSynthesis.speaking = false;
      stopSpeech();
      expect(mockSpeechSynthesis.cancel).not.toHaveBeenCalled();
    });
  });

  describe('pauseSpeech and resumeSpeech', () => {
    test('pauses speech when speaking', () => {
      speechManager.isSpeaking = true;
      pauseSpeech();
      expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
    });

    test('resumes speech when paused', () => {
      mockSpeechSynthesis.paused = true;
      resumeSpeech();
      expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
    });
  });

  describe('isSpeaking', () => {
    test('returns speaking status', () => {
      speechManager.isSpeaking = true;
      expect(isSpeaking()).toBe(true);
      speechManager.isSpeaking = false;
      expect(isSpeaking()).toBe(false);
    });
  });

  describe('getVoices', () => {
    test('returns voices immediately if available', async () => {
      const mockVoices = [{ name: 'Voice 1' }, { name: 'Voice 2' }];
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
      const voices = await speechManager.getVoices();
      expect(voices).toEqual(mockVoices);
    });

    test('waits for voices to load', async () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([]);
      const mockVoices = [{ name: 'Voice 1' }];
      setTimeout(() => {
        mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
        mockSpeechSynthesis.onvoiceschanged();
      }, 10);
      const voices = await speechManager.getVoices();
      expect(voices).toEqual(mockVoices);
    });
  });

  describe('findVoice', () => {
    test('finds voice by name', async () => {
      const mockVoices = [
        { name: 'Alice', lang: 'en-US' },
        { name: 'Bob', lang: 'en-GB' }
      ];
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
      const voice = await speechManager.findVoice('Alice');
      expect(voice).toEqual(mockVoices[0]);
    });

    test('finds voice by language', async () => {
      const mockVoices = [
        { name: 'Alice', lang: 'en-US' },
        { name: 'Bob', lang: 'en-GB' }
      ];
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
      const voice = await speechManager.findVoice('en-GB');
      expect(voice).toEqual(mockVoices[1]);
    });
  });

  describe('initializeAudioAnalysis', () => {
    test('initializes audio analysis successfully', () => {
      const onDataCallback = jest.fn();
      const result = speechManager.initializeAudioAnalysis(onDataCallback);
      expect(result).toHaveProperty('audioContext');
      expect(result).toHaveProperty('analyser');
    });

    test('returns null when Web Audio API is not supported', () => {
      const originalAudioContext = window.AudioContext;
      delete window.AudioContext;
      delete window.webkitAudioContext;

      const result = speechManager.initializeAudioAnalysis();
      expect(result).toBeNull();

      window.AudioContext = originalAudioContext;
      window.webkitAudioContext = originalAudioContext;
    });

    test('starts analysis loop when callback provided', () => {
      const onDataCallback = jest.fn();
      speechManager.initializeAudioAnalysis(onDataCallback);
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('stopAudioAnalysis', () => {
    test('stops audio analysis and cleans up', () => {
      speechManager.initializeAudioAnalysis();
      speechManager.stopAudioAnalysis();
      expect(speechManager.audioAnalysisInstance).toBeNull();
    });
  });

  describe('destroy', () => {
    test('cleans up all resources', () => {
      speechManager.initializeAudioAnalysis();
      speechManager.destroy();
      expect(speechManager.audioAnalysisInstance).toBeNull();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });
  });
});

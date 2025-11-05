// Speech synthesis utilities with audio analysis capabilities
class SpeechManager {
  constructor() {
    this.audioAnalysisInstance = null;
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  /**
   * Speak text with optional pitch, rate and a callback when speech ends
   * @param {string} text - Text to speak
   * @param {Object} options - { rate, pitch, cancelCurrent, voice }
   * @param {Function} callback - Function to call when speech ends
   */
  speak(text, options = {}, callback) {
    if (!text?.trim()) {
      console.warn('SpeechManager: No text provided');
      return false;
    }

    const { 
      rate = 0.9, 
      pitch = 1.0, 
      cancelCurrent = true,
      voice = null,
      volume = 1.0
    } = options;

    // Cancel current speech if requested
    if (cancelCurrent) {
      this.stopSpeech();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'en-IN';
      utterance.rate = Math.max(0.1, Math.min(2, rate)); // Clamp between 0.1-2
      utterance.pitch = Math.max(0, Math.min(2, pitch)); // Clamp between 0-2
      utterance.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0-1
      
      if (voice) {
        utterance.voice = voice;
      }

      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        callback?.();
      };

      utterance.onerror = (event) => {
        console.error('SpeechManager: Speech synthesis error:', event.error);
        this.isSpeaking = false;
        this.currentUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('SpeechManager: Failed to speak text:', error);
      return false;
    }
  }

  /**
   * Speak with a bit more emotion (higher pitch) and optional callback
   * @param {string} text
   * @param {Function} callback
   */
  speakWithEmotion(text, callback) {
    return this.speak(text, { 
      rate: 0.9, 
      pitch: 1.1, 
      volume: 1.0 
    }, callback);
  }

  /**
   * Get available voices and cache them
   */
  async getVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
        
        // Fallback timeout
        setTimeout(() => {
          resolve(window.speechSynthesis.getVoices());
        }, 1000);
      }
    });
  }

  /**
   * Find a specific voice by name or language
   */
  async findVoice(voiceNameOrLang) {
    const voices = await this.getVoices();
    return voices.find(voice => 
      voice.name.includes(voiceNameOrLang) || 
      voice.lang.includes(voiceNameOrLang)
    );
  }

  /**
   * Initialize Audio Analysis (returns audioContext + analyser)
   * Optionally provide a callback to receive real-time frequency data
   * @param {Function} onDataCallback - Function receiving Uint8Array of frequency data
   * @param {Object} options - { fftSize, smoothing }
   */
  initializeAudioAnalysis(onDataCallback, options = {}) {
    if (this.audioAnalysisInstance) {
      return this.audioAnalysisInstance;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        throw new Error('Web Audio API not supported');
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      
      const { 
        fftSize = 2048, 
        smoothing = 0.85,
        minDecibels = -90,
        maxDecibels = -10
      } = options;
      
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      this.audioAnalysisInstance = { audioContext, analyser };

      if (typeof onDataCallback === 'function') {
        this.startAudioAnalysisLoop(onDataCallback);
      }

      return this.audioAnalysisInstance;
    } catch (error) {
      console.warn('SpeechManager: Audio analysis not supported:', error);
      return null;
    }
  }

  /**
   * Start the audio analysis loop
   */
  startAudioAnalysisLoop(onDataCallback) {
    if (!this.audioAnalysisInstance) return;

    const { analyser } = this.audioAnalysisInstance;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationFrameId = null;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      onDataCallback(dataArray);
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    
    // Store for potential cleanup
    this.audioAnalysisInstance.animationFrameId = animationFrameId;
  }

  /**
   * Stop audio analysis and clean up resources
   */
  stopAudioAnalysis() {
    if (this.audioAnalysisInstance) {
      const { audioContext, animationFrameId } = this.audioAnalysisInstance;
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
      
      this.audioAnalysisInstance = null;
    }
  }

  /**
   * Stop any ongoing speech immediately
   */
  stopSpeech() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause current speech
   */
  pauseSpeech() {
    if (this.isSpeaking) {
      window.speechSynthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resumeSpeech() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  /**
   * Check if speech is currently in progress
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * Clean up all resources
   */
  destroy() {
    this.stopSpeech();
    this.stopAudioAnalysis();
  }
}

// Singleton instance with lazy initialization
let speechManagerInstance = null;

export const getSpeechManager = () => {
  if (!speechManagerInstance) {
    speechManagerInstance = new SpeechManager();
  }
  return speechManagerInstance;
};

// Legacy function exports for backward compatibility
export const speak = (text, options = {}, callback) => {
  return getSpeechManager().speak(text, options, callback);
};

export const speakWithEmotion = (text, callback) => {
  return getSpeechManager().speakWithEmotion(text, callback);
};

export const initializeAudioAnalysis = (onDataCallback) => {
  return getSpeechManager().initializeAudioAnalysis(onDataCallback);
};

export const stopSpeech = () => {
  getSpeechManager().stopSpeech();
};

// Additional utility exports
export const pauseSpeech = () => getSpeechManager().pauseSpeech();
export const resumeSpeech = () => getSpeechManager().resumeSpeech();
export const isSpeaking = () => getSpeechManager().getIsSpeaking();
import { useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import loadModels from './loadModels';

// Configuration constants
const FACE_DETECTION_CONFIG = {
  detectionInterval: 150, // ms - balanced between performance and smoothness
  detectionOptions: new faceapi.TinyFaceDetectorOptions({
    inputSize: 320, // Better accuracy for video feeds
    scoreThreshold: 0.5 // Balance between false positives and misses
  }),
  landmarksOptions: new faceapi.TinyFaceDetectorOptions(),
  expressionsOptions: new faceapi.TinyFaceDetectorOptions()
};

// Performance monitoring
const PERFORMANCE = {
  maxProcessingTime: 100, // ms
  sampleSize: 10 // for frame rate calculation
};

const useFaceObserver = (videoRef, setFacePoints) => {
  // Refs for stable references and performance tracking
  const detectionIntervalRef = useRef(null);
  const modelsLoadedRef = useRef(false);
  const processingRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const performanceSamplesRef = useRef([]);

  // Memoized detection function with error handling and performance tracking
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || processingRef.current || !modelsLoadedRef.current) {
      return;
    }

    const video = videoRef.current;
    
    // Check if video is ready and playing
    if (video.paused || video.ended || video.readyState < 2) {
      return;
    }

    processingRef.current = true;
    const startTime = performance.now();

    try {
      // Perform face detection with landmarks and expressions for better accuracy
      const detections = await faceapi
        .detectAllFaces(video, FACE_DETECTION_CONFIG.detectionOptions)
        .withFaceLandmarks()
        .withFaceExpressions();

      // Calculate frame rate for performance monitoring
      const currentTime = performance.now();
      const frameTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      if (frameTime > 0) {
        const currentFPS = 1000 / frameTime;
        performanceSamplesRef.current.push(currentFPS);
        
        // Keep only recent samples
        if (performanceSamplesRef.current.length > PERFORMANCE.sampleSize) {
          performanceSamplesRef.current.shift();
        }
      }

      // Process detections with enhanced information
      if (detections.length > 0) {
        const faceData = detections.map((detection, index) => {
          const box = detection.detection.box;
          const landmarks = detection.landmarks;
          const expressions = detection.expressions;
          
          // Calculate face center and size for better tracking
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;
          const faceSize = Math.sqrt(box.width * box.height);
          
          // Get dominant expression
          const dominantExpression = expressions 
            ? Object.entries(expressions).reduce((a, b) => a[1] > b[1] ? a : b)[0]
            : 'neutral';

          return {
            id: index,
            position: {
              x: Math.round(box.x),
              y: Math.round(box.y),
              width: Math.round(box.width),
              height: Math.round(box.height),
              centerX: Math.round(centerX),
              centerY: Math.round(centerY)
            },
            confidence: Math.round(detection.detection.score * 100),
            size: Math.round(faceSize),
            expression: dominantExpression,
            landmarks: landmarks ? landmarks.positions.length : 0,
            timestamp: Date.now()
          };
        });

        setFacePoints(faceData);
      } else {
        // No faces detected - send empty array to indicate no faces
        setFacePoints([]);
      }

      // Performance monitoring - adjust interval if processing is too slow
      const processingTime = performance.now() - startTime;
      if (processingTime > PERFORMANCE.maxProcessingTime) {
        console.warn(`Face detection taking too long: ${processingTime}ms`);
      }

    } catch (error) {
      console.error('Face detection error:', error);
      // Don't stop on single errors, but provide feedback
      setFacePoints([{ error: 'Detection failed', timestamp: Date.now() }]);
    } finally {
      processingRef.current = false;
      frameCountRef.current++;
    }
  }, [videoRef, setFacePoints]);

  // Initialize models and start detection
  const initializeFaceDetection = useCallback(async () => {
    if (modelsLoadedRef.current) return;

    try {
      await loadModels();
      modelsLoadedRef.current = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Failed to load face detection models:', error);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Wait for video to be ready
    const waitForVideoReady = () => {
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
        startDetection();
      } else {
        setTimeout(waitForVideoReady, 100);
      }
    };

    const startDetection = () => {
      // Clear any existing interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      // Start detection interval
      detectionIntervalRef.current = setInterval(detectFaces, FACE_DETECTION_CONFIG.detectionInterval);
      
      // Also trigger immediate detection
      detectFaces();
    };

    if (video.readyState >= 2) {
      startDetection();
    } else {
      video.addEventListener('loadeddata', startDetection);
      waitForVideoReady();
    }
  }, [videoRef, detectFaces]);

  // Get performance statistics
  const getPerformanceStats = useCallback(() => {
    const samples = performanceSamplesRef.current;
    const avgFPS = samples.length > 0 
      ? samples.reduce((a, b) => a + b, 0) / samples.length 
      : 0;
    
    return {
      framesProcessed: frameCountRef.current,
      averageFPS: Math.round(avgFPS),
      sampleSize: samples.length
    };
  }, []);

  // Main effect - initialize and cleanup
  useEffect(() => {
    if (!videoRef.current) return;

    initializeFaceDetection();

    // Cleanup function
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      processingRef.current = false;
      modelsLoadedRef.current = false;
    };
  }, [videoRef, initializeFaceDetection]);

  // Effect to handle video play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      detectionIntervalRef.current = setInterval(detectFaces, FACE_DETECTION_CONFIG.detectionInterval);
    };

    const handlePause = () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setFacePoints([]); // Clear face points when paused
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
    };
  }, [videoRef, detectFaces, setFacePoints]);

  // Return utility functions for external control
  return {
    stopDetection: () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setFacePoints([]);
    },
    startDetection: () => {
      if (!detectionIntervalRef.current && modelsLoadedRef.current) {
        detectionIntervalRef.current = setInterval(detectFaces, FACE_DETECTION_CONFIG.detectionInterval);
      }
    },
    getPerformanceStats,
    isModelsLoaded: modelsLoadedRef.current,
    isProcessing: processingRef.current
  };
};

export default useFaceObserver;
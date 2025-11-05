import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Camera, Square, XCircle, Trash2, Power } from "lucide-react";
import useFaceObserver from './useFaceObserver';

// Constants for better maintainability
const CONSTANTS = {
  VIDEO_CONSTRAINTS: { video: true, audio: true },
  VIDEO_TYPE: "video/webm",
  DRAG_CONFIG: { dragMomentum: false, dragElastic: 0.1 },
  SPRING_CONFIG: { type: "spring", stiffness: 120 },
  CAMERA_POSITION: { top: 16, right: 16 },
  CAMERA_SIZES: { width: 176, smWidth: 208, height: 112, smHeight: 128 }
};

// Pre-defined motion variants to prevent recreation
const MOTION_VARIANTS = {
  container: {
    initial: { opacity: 0, scale: 0.8, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8 }
  },
  modal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  modalContent: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  }
};

const CameraRecorder = ({ onData, setRecordingState, videoURL, setVideoURL, cameraState }) => {
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // State
  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Memoized status and styles
  const cameraStatus = useMemo(() => ({
    isRecording: recording,
    isCameraReady: cameraReady,
    badgeClass: recording 
      ? "bg-red-500/80 text-white animate-pulse" 
      : cameraReady 
        ? "bg-green-500/80 text-white" 
        : "bg-gray-800/60 text-gray-200",
    badgeText: recording ? "Recording" : cameraReady ? "Camera On" : "Camera Off"
  }), [recording, cameraReady]);

  const containerClass = useMemo(() => 
    `relative w-44 sm:w-52 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all ${
      recording ? "ring-2 ring-red-500" : "hover:ring-2 hover:ring-blue-400"
    }`,
    [recording]
  );

  // Camera control with proper cleanup
  const startCamera = useCallback(async () => {
    if (cameraReady) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CONSTANTS.VIDEO_CONSTRAINTS);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
        toast.success("📷 Camera turned on");
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      toast.error("Camera or microphone not accessible!");
    }
  }, [cameraReady]);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setCameraReady(false);
    setRecordingState(false);
    setVideoURL(null);
    
    if (recording) {
      stopRecording();
    }
    
    toast.success("📷 Camera turned off");
  }, [recording, setRecordingState, setVideoURL]);

  // Recording handlers
  const handleDataAvailable = useCallback((event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  }, []);

  const handleRecordingStop = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: CONSTANTS.VIDEO_TYPE });
    onData(blob);
    setShowPreview(true);
    setRecordingState(false);
    chunksRef.current = [];
  }, [onData, setRecordingState]);

  const startRecording = useCallback(() => {
    if (!cameraReady) {
      toast.error("🎥 Camera not ready!");
      return;
    }

    const stream = videoRef.current?.srcObject;
    if (!stream) {
      toast.error("🎥 Camera not ready!");
      return;
    }

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleRecordingStop;

    mediaRecorder.start();
    setRecording(true);
    setRecordingState(true);
  }, [cameraReady, handleDataAvailable, handleRecordingStop, setRecordingState]);

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder?.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      setRecordingState(false);
    }
  }, [setRecordingState]);

  // Reset video
  const resetVideo = useCallback(() => {
    setVideoURL(null);
    setShowPreview(false);
  }, [setVideoURL]);

  // Close preview with camera stop
  const closePreview = useCallback(() => {
    setShowPreview(false);
    stopCamera();
  }, [stopCamera]);

  // Effects
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Face observation
  useFaceObserver(videoRef);

  // Button configurations
  const cameraButton = !cameraReady ? (
    <button 
      onClick={startCamera}
      className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-transform hover:scale-105"
      aria-label="Start camera"
    >
      <Camera size={18} />
    </button>
  ) : (
    <button 
      onClick={stopCamera}
      className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-md transition-transform hover:scale-105"
      aria-label="Stop camera"
    >
      <Power size={18} />
    </button>
  );

  const recordButton = !recording ? (
    <button 
      onClick={startRecording}
      disabled={!cameraReady}
      className={`p-2 rounded-full text-white shadow-md transition-transform hover:scale-105 ${
        cameraReady ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
      }`}
      aria-label="Start recording"
    >
      <Camera size={18} />
    </button>
  ) : (
    <button 
      onClick={stopRecording}
      className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform hover:scale-105"
      aria-label="Stop recording"
    >
      <Square size={18} />
    </button>
  );

  return (
    <>
      {/* Floating Camera UI */}
      <motion.div
        drag
        {...CONSTANTS.DRAG_CONFIG}
        {...MOTION_VARIANTS.container}
        transition={CONSTANTS.SPRING_CONFIG}
        className="fixed z-[999] cursor-grab active:cursor-grabbing"
        style={{
          top: CONSTANTS.CAMERA_POSITION.top,
          right: CONSTANTS.CAMERA_POSITION.right
        }}
      >
        <motion.div className={containerClass}>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline 
            className="w-full h-28 sm:h-32 object-cover rounded-2xl"
            aria-label="Camera preview"
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 flex flex-col justify-between p-2">
            {/* Status Badge */}
            <div className="flex justify-between items-center">
              <span className={`text-[10px] px-2 py-[1px] rounded-full font-semibold ${cameraStatus.badgeClass}`}>
                {cameraStatus.badgeText}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-3 pb-1">
              {cameraButton}
              {recordButton}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {showPreview && videoURL && (
          <motion.div 
            {...MOTION_VARIANTS.modal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]"
          >
            <motion.div 
              {...MOTION_VARIANTS.modalContent}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl w-[90%] max-w-md relative"
            >
              {/* Close Button */}
              <button 
                onClick={closePreview}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                aria-label="Close preview"
              >
                <XCircle size={30} />
              </button>

              {/* Recorded Video */}
              <video 
                src={videoURL} 
                controls 
                autoPlay 
                className="rounded-xl w-full mb-3 border border-gray-200 dark:border-gray-700"
                aria-label="Recorded video preview"
              />

              {/* Action Buttons */}
              <div className="flex justify-between mt-2">
                <button 
                  onClick={() => { resetVideo(); stopCamera(); }}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  aria-label="Delete recording"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button 
                  onClick={closePreview}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                  aria-label="Done"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(CameraRecorder);
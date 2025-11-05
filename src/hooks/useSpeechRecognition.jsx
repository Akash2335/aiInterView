// import { useRef, useCallback } from "react";
// import toast from "react-hot-toast";

// /**
//  * 🎙️ Ultra-Stable Speech Recognition Hook (Configurable)
//  *
//  * ✅ Auto restarts if browser stops listening unexpectedly
//  * ✅ Detects user pauses & ends intelligently
//  * ✅ Configurable pause timeout and autoRestart behavior
//  *
//  * @param {Function} onTranscriptUpdate - called on transcript updates
//  * @param {Function} onRecognitionEnd - called when user stops speaking
//  * @param {Object} options
//  * @param {boolean} [options.autoRestart=true] - whether to auto-restart listening after stop
//  * @param {number} [options.pauseTimeout=3000] - ms of silence before ending recognition
//  */
// export const useSpeechRecognition = (
//   onTranscriptUpdate,
//   onRecognitionEnd,
//   options = {}
// ) => {
//   const { autoRestart = true, pauseTimeout = 3000 } = options;

//   const recognitionRef = useRef(null);
//   const silenceTimerRef = useRef(null);
//   const stopManuallyRef = useRef(false);
//   const lastSpeechTimeRef = useRef(Date.now());

//   /** 🧠 Map known error codes to friendly messages */
//   const getSpeechErrorText = useCallback((error) => {
//     const map = {
//       "no-speech": "🎤 No speech detected. Try again.",
//       "audio-capture": "🎧 Microphone not found.",
//       "not-allowed": "🚫 Microphone access denied.",
//       "network": "🌐 Network issue. Please check your connection.",
//     };
//     return map[error] || `⚠️ Speech recognition error: ${error}`;
//   }, []);

//   /** 🎧 Ensure mic access */
//   const ensureMicPermission = useCallback(async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       return true;
//     } catch {
//       toast.error("🎙️ Please enable microphone access.");
//       return false;
//     }
//   }, []);

//   /** ▶️ Start speech recognition */
//   const startListening = useCallback(async () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       toast.error("🚫 Speech Recognition not supported in this browser.");
//       return false;
//     }

//     const micOK = await ensureMicPermission();
//     if (!micOK) return false;

//     stopManuallyRef.current = false;
//     recognitionRef.current?.stop();

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = "en-IN";
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onstart = () => console.log("🎤 Recognition started");
//     recognition.onaudiostart = () => console.log("🎧 Audio stream started");
//     recognition.onsoundstart = () => console.log("🗣️ Speech detected");
//     recognition.onsoundend = () => console.log("🤫 Speech ended");
//     recognition.onaudioend = () => console.log("🎧 Audio stream ended");

//     /** 🔤 Handle speech results */
//     recognition.onresult = (event) => {
//       let finalText = "";
//       let interimText = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const text = event.results[i][0].transcript;
//         if (event.results[i].isFinal) finalText += text;
//         else interimText += text;
//       }

//       onTranscriptUpdate(finalText || interimText);

//       if (finalText.trim() || interimText.trim()) {
//         lastSpeechTimeRef.current = Date.now();
//         clearTimeout(silenceTimerRef.current);

//         // ⏱ Detect long pause
//         silenceTimerRef.current = setTimeout(() => {
//           const silenceDuration = Date.now() - lastSpeechTimeRef.current;
//           if (silenceDuration > pauseTimeout) {
//             console.log("🕒 User paused too long — ending recognition.");
//             recognition.stop();
//             onRecognitionEnd?.();
//           }
//         }, pauseTimeout + 500);
//       }
//     };

//     /** ⚠️ Handle errors gracefully */
//     recognition.onerror = (e) => {
//       if (e.error === "aborted") return; // ignore manual stop
//       console.warn("🎙️ Speech error:", e.error);
//       toast.error(getSpeechErrorText(e.error));
//     };

//     /** 🔁 Auto-restart on unexpected stop */
//     recognition.onend = () => {
//       if (!stopManuallyRef.current && autoRestart) {
//         console.log("🔁 Restarting recognition (auto-recovery)...");
//         setTimeout(() => recognition.start(), 800);
//       } else {
//         console.log("🛑 Recognition ended manually or by silence.");
//         onRecognitionEnd?.();
//       }
//     };

//     try {
//       recognition.start();
//       onTranscriptUpdate("");
//       toast.success("🎧 Listening... Speak naturally!");
//       return true;
//     } catch (err) {
//       console.error("Speech recognition start failed:", err);
//       toast.error("⚠️ Could not start listening.");
//       return false;
//     }
//   }, [ensureMicPermission, getSpeechErrorText, onTranscriptUpdate, onRecognitionEnd, autoRestart, pauseTimeout]);

//   /** ⏹ Stop listening manually */
//   const stopListening = useCallback(() => {
//     stopManuallyRef.current = true;
//     recognitionRef.current?.stop();
//     clearTimeout(silenceTimerRef.current);
//   }, []);

//   return {
//     startListening,
//     stopListening,
//   };
// };

// export default useSpeechRecognition;
import { useRef, useCallback, useState } from "react";
import toast from "react-hot-toast";

export const useSpeechRecognition = (onTranscriptUpdate, onRecognitionEnd) => {
  const recognitionRef = useRef(null);
  const isRunningRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const finalTranscriptRef = useRef(""); // store final transcript

  const startListening = useCallback(async () => {
    if (isRunningRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("🚫 Speech Recognition not supported.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error("🎙️ Please enable microphone access.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += text;
        else interimText += text;
      }

      // Save final transcript in ref
      if (finalText.trim()) finalTranscriptRef.current = finalText;

      onTranscriptUpdate(finalText || interimText);

      if ((finalText || interimText).trim()) {
        lastSpeechTimeRef.current = Date.now();
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (Date.now() - lastSpeechTimeRef.current > 3000) {
            recognition.stop();
            onRecognitionEnd?.();
          }
        }, 3500);
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "aborted") toast.error(`🎤 Error: ${e.error}`);
    };

    recognition.onend = () => {
      isRunningRef.current = false;
      onRecognitionEnd?.();
    };

    recognition.start();
    isRunningRef.current = true;
    onTranscriptUpdate("");
    toast.success("🎧 Listening...");
  }, [onTranscriptUpdate, onRecognitionEnd]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    isRunningRef.current = false;
    clearTimeout(silenceTimerRef.current);
    // Return final transcript when stopping manually
    return finalTranscriptRef.current;
  }, []);

  return { startListening, stopListening, isRunning: isRunningRef.current };
};

export default useSpeechRecognition;

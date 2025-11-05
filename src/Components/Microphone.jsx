// Microphone.jsx
import React from "react";
import { Mic, MicOff, Radio } from "lucide-react";
import toast from "react-hot-toast";

const Microphone = ({ recording, isListening, startListening, stopListening }) => {
  const handleClick = () => {
    if (!recording) {
      toast.error("🎥 Please start your camera before recording!");
      return;
    }
    isListening ? stopListening() : startListening();
  };

  return (
    <div className="flex flex-col items-center my-10 relative">
      <div className="relative flex items-center justify-center">
        {isListening && (
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-red-500 opacity-30 animate-ping"></span>
        )}
        <button
          onClick={handleClick}
          className={`relative p-8 rounded-full shadow-xl border-4 transition-transform duration-200 hover:scale-105 ${
            isListening
              ? "bg-red-600 border-red-400"
              : "bg-blue-600 border-blue-400"
          }`}
        >
          {isListening ? <MicOff className="w-12 h-12 text-white animate-pulse" /> : <Mic className="w-12 h-12 text-white" />}
        </button>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
        <Radio className={`w-4 h-4 ${isListening ? "text-red-600 animate-pulse" : "text-gray-400"}`} />
        {isListening ? "Listening..." : "Click the mic to answer"}
      </div>
    </div>
  );
};

export default Microphone;

import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export default function Arrow() {
  const [showButton, setShowButton] = useState(false);

  // Show button only if user not near bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const nearBottom = document.body.offsetHeight - 100;
      setShowButton(scrollPosition < nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Floating Scroll Button */}
      {showButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 p-3 bg-indigo-600 hover:bg-cyan-200 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce z-50"
          title="Scroll to bottom"
        >
          <ArrowDown size={22} className="animate-pulse"/>
        </button>
      )}
    </>
  );
}

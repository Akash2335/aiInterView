import { useEffect, useContext } from "react";
import { DarkModeContext } from "../App";

const TabColorManager = () => {
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const color = darkMode ? "#2f2f8f" : "#3975b1"; // Dark / Light
    let meta = document.querySelector('meta[name="theme-color"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", color);

  }, [darkMode]);

  return null;
};

export default TabColorManager;

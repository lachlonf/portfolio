import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

const inkColors = ["#111111", "#c0392b", "#0ea5e9", "#16a34a", "#db2777", "#ea580c", "#7c3aed"];
const picked = inkColors[Math.floor(Math.random() * inkColors.length)];
document.documentElement.style.setProperty("--ink", picked);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

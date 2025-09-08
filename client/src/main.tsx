import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 Starting React app...");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("✅ App rendered!");
} catch (error) {
  console.error("❌ Error:", error);
}

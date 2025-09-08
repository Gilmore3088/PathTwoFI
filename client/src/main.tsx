import { createRoot } from "react-dom/client";
import App from "./App";
import TestApp from "./test-app";
import "./index.css";

console.log("🚀 Starting React app...");

// Error boundary component for debugging
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("❌ Error in ErrorBoundary:", error);
    return <div>Something went wrong. Check console for details.</div>;
  }
}

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  console.error('❌ Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

try {
  console.log("📍 Getting root element...");
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Root element not found!");
  } else {
    console.log("✅ Root element found:", rootElement);
  }

  console.log("📍 Creating React root...");
  const root = createRoot(rootElement!);
  
  console.log("📍 Rendering Test App first...");
  root.render(
    <ErrorBoundary>
      <TestApp />
    </ErrorBoundary>
  );
  
  console.log("✅ React app should be rendering now!");
} catch (error) {
  console.error("❌ Critical error in main.tsx:", error);
  console.error("❌ Error stack:", error instanceof Error ? error.stack : error);
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch((error) => {
          console.warn("Failed to unregister service worker during dev cleanup", error);
        });
      });
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed:", err);
      });
  });
}

registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);

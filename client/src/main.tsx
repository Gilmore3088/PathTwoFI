// client/src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
const el = document.getElementById("root")!;
createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


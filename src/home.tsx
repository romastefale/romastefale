import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Pintester } from "./pages/Pintester";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Pintester />
  </React.StrictMode>,
);

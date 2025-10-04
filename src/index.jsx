import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

// Development helper: when an ErrorBoundary catches an error it calls
// window.__COMPONENT_ERROR__ (set in ErrorBoundary.componentDidCatch).
// We wire that to console.error so errors are visible in the dev server logs.
if (typeof window !== 'undefined') {
	window.__COMPONENT_ERROR__ = (error, info) => {
		try {
			console.error('Captured component error:', error, info);
			// show a brief toast in dev so the developer notices (non-blocking)
			if (process.env.NODE_ENV !== 'production') {
				try { console.warn('ErrorBoundary captured an error:', error?.message); } catch(e) {}
			}
		} catch (e) {
			// ignore
		}
	};
}

root.render(<App />);

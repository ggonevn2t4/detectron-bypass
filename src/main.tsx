
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills should be installed if needed, but they're removed for now as they're causing errors

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);

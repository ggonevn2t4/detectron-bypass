
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Đảm bảo polyfills và configs toàn cục được load đầu tiên
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);

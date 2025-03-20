
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import FeaturesPage from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import HumanizerFeature from "./pages/features/HumanizerFeature";
import AIWriterFeature from "./pages/features/AIWriterFeature";
import AIDetectorFeature from "./pages/features/AIDetectorFeature";
import ExportFeature from "./pages/features/ExportFeature";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} timeout={300} classNames="page">
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/features" element={
            <ProtectedRoute>
              <FeaturesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/features/humanizer" element={<HumanizerFeature />} />
          <Route path="/features/ai-writer" element={<AIWriterFeature />} />
          <Route path="/features/ai-detector" element={<AIDetectorFeature />} />
          <Route path="/features/export" element={<ExportFeature />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner position="top-right" closeButton richColors />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

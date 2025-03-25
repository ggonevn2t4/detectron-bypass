
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Features from '@/pages/Features';
import About from '@/pages/About';
import Testimonials from '@/pages/Testimonials';
import FAQ from '@/pages/FAQ';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import SubscriptionManagement from '@/pages/admin/SubscriptionManagement';
import Settings from '@/pages/admin/Settings';
import DetectorTool from '@/components/ai-detector/DetectorTool';
import WriterTool from '@/components/ai-writer/WriterTool';
import HumanizerFeature from '@/pages/features/HumanizerFeature';
import AIDetectorFeature from '@/pages/features/AIDetectorFeature';
import AIWriterFeature from '@/pages/features/AIWriterFeature';
import ExportFeature from '@/pages/features/ExportFeature';
import APIFeature from '@/pages/features/APIFeature';
import TextAnalysis from '@/pages/TextAnalysis';
import UsageStatistics from '@/pages/UsageStatistics';
import Analytics from '@/pages/admin/Analytics';

// Define a type for the children prop
type Props = {
  children: React.ReactNode;
};

// Protected Route component
function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
}

// Admin Route component
function AdminRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
}

const navigationLinkClasses =
  "text-sm font-medium transition-colors hover:text-foreground/80";

function App() {
  const { user, signOut } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        
        {/* Feature pages */}
        <Route path="/features/humanizer" element={<HumanizerFeature />} />
        <Route path="/features/ai-detector" element={<AIDetectorFeature />} />
        <Route path="/features/ai-writer" element={<AIWriterFeature />} />
        <Route path="/features/export" element={<ExportFeature />} />
        <Route path="/features/api" element={<APIFeature />} />

        {/* Tool Pages */}
        <Route path="/humanizer" element={<ProtectedRoute><HumanizerFeature /></ProtectedRoute>} />
        <Route path="/ai-detector" element={<ProtectedRoute><DetectorTool /></ProtectedRoute>} />
        <Route path="/ai-writer" element={<ProtectedRoute><WriterTool /></ProtectedRoute>} />
        <Route path="/translator" element={<ProtectedRoute><TextAnalysis /></ProtectedRoute>} />
        
        {/* New pages */}
        <Route path="/text-analysis" element={<ProtectedRoute><TextAnalysis /></ProtectedRoute>} />
        <Route path="/usage-statistics" element={<ProtectedRoute><UsageStatistics /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/subscriptions" element={<AdminRoute><SubscriptionManagement /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

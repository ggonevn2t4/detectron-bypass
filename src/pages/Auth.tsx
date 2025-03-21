
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import the refactored components
import AuthContainer from '@/components/auth/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import NewPasswordForm from '@/components/auth/NewPasswordForm';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isResetMode, setIsResetMode] = useState(false);

  // Check if user is in password reset mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isReset = searchParams.get('reset') === 'true';
    setIsResetMode(isReset);
  }, [location]);

  useEffect(() => {
    if (user && !isResetMode) {
      navigate('/');
    }
  }, [user, navigate, isResetMode]);

  const handleForgotPassword = () => {
    setShowResetForm(true);
    setError(null);
  };

  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetSent(false);
  };

  if (isResetMode) {
    return (
      <AuthContainer 
        title="Set New Password"
        subtitle="Enter your new password below"
        error={error}
        activeTab=""
        onTabChange={() => {}}
      >
        <NewPasswordForm 
          error={error}
          isLoading={isLoading}
        />
      </AuthContainer>
    );
  }

  if (showResetForm) {
    return (
      <AuthContainer 
        title="Reset Password"
        subtitle="Enter your email to receive a password reset link"
        error={error}
        activeTab=""
        onTabChange={() => {}}
      >
        <ResetPasswordForm 
          error={error}
          isLoading={isLoading}
          resetSent={resetSent}
          onBackToLogin={handleBackToLogin}
        />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer 
      title="Welcome to HumanizeAI"
      subtitle="Sign in to access your account"
      error={null}
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as 'login' | 'signup')}
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="login">
          <LoginForm 
            error={error}
            isLoading={isLoading}
            onForgotPassword={handleForgotPassword}
          />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm 
            error={error}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </AuthContainer>
  );
};

export default Auth;

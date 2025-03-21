
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthContainerProps {
  title: string;
  subtitle: string;
  error: string | null;
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ 
  title, 
  subtitle, 
  error, 
  activeTab, 
  onTabChange, 
  children 
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthContainer;

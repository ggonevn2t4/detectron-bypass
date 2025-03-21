
import React from 'react';
import { ThemeProvider } from './hooks/use-theme';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="humanize-ai-theme">
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;

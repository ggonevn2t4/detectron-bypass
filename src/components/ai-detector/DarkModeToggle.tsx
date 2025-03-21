
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-9 h-9 p-0"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DarkModeToggle;

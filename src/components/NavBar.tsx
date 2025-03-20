import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Set initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-background border-b">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="flex items-center space-x-2">
          <span className="relative w-8 h-8 bg-primary rounded-lg overflow-hidden flex items-center justify-center">
            <div className="absolute w-full h-full bg-primary"></div>
            <span className="relative text-white font-bold text-lg">H</span>
          </span>
          <span className="font-medium text-xl">Humanize<span className="text-primary">AI</span></span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/" className="nav-link">
            {t('nav.home')}
          </Link>
          <Link to="/#features" className="nav-link">
            {t('nav.features')}
          </Link>
          <Link to="/#pricing" className="nav-link">
            {t('nav.pricing')}
          </Link>
          <Link to="/about" className="nav-link">
            {t('nav.about')}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">
                  {t('nav.dashboard')}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarImage src={user?.image} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/auth">
                  {t('nav.login')}
                </Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=signup">
                  {t('nav.signUp')}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/#features" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('nav.features')}
            </Link>
            <Link to="/#pricing" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('nav.pricing')}
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
              {t('nav.about')}
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                {t('nav.dashboard')}
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default NavBar;

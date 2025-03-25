import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const navigationLinkClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-secondary data-[state=open]:text-muted-foreground hover:bg-secondary hover:text-muted-foreground px-2.5 h-7"

interface UserDropdownProps {
  user: any;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onSignOut }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <NavLink to="/profile" className="w-full h-full block">
            Profile
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavLink to="/" className="mr-4 hidden md:flex">
          <Logo />
          <span className="ml-2 text-xl font-bold">HumanizeAI</span>
        </NavLink>
        <NavLink to="/" className="mr-2 flex md:hidden">
          <Logo />
        </NavLink>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1 md:space-x-2">
            {!user && (
              <>
                <NavLink to="/features" className={navigationLinkClasses}>
                  Features
                </NavLink>
                <NavLink to="/pricing" className={navigationLinkClasses}>
                  Pricing
                </NavLink>
                <NavLink to="/about" className={navigationLinkClasses}>
                  About
                </NavLink>
              </>
            )}
            {user && (
              <>
                <NavLink to="/dashboard" className={navigationLinkClasses}>
                  Dashboard
                </NavLink>
                <NavLink to="/humanizer" className={navigationLinkClasses}>
                  Humanizer
                </NavLink>
                <NavLink to="/ai-detector" className={navigationLinkClasses}>
                  AI Detector
                </NavLink>
                <NavLink to="/ai-writer" className={navigationLinkClasses}>
                  AI Writer
                </NavLink>
                <NavLink to="/translator" className={navigationLinkClasses}>
                  Translator
                </NavLink>
                <NavLink to="/text-analysis" className={navigationLinkClasses}>
                  Analysis
                </NavLink>
                <NavLink to="/usage-statistics" className={navigationLinkClasses}>
                  Stats
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center">
            {user ? (
              <UserDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              <>
                <NavLink to="/auth?mode=login" className="inline-flex">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/auth?mode=register" className="ml-2 inline-flex">
                  <Button size="sm">Get Started</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

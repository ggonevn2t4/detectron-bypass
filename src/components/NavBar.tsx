
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuIcon, X, LogOut, User, Layout, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Pricing', path: '/#pricing' },
    { title: 'Features', path: '/#features' },
  ];

  // Add detailed features link for logged-in users
  const authenticatedLinks = user ? [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { title: 'Detailed Features', path: '/features', icon: <Layout className="h-4 w-4 mr-2" /> },
  ] : [];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location.hash === path.split('#')[1] || (path === '/' && location.pathname === '/');
    }
    return location.pathname === path;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '?';
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 lg:px-12',
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="relative w-8 h-8 bg-primary rounded-lg overflow-hidden flex items-center justify-center">
            <div className="absolute w-full h-full bg-primary animate-pulse-light"></div>
            <span className="relative text-white font-bold text-lg">H</span>
          </span>
          <span className="font-medium text-xl">Humanize<span className="text-primary">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(link.path) ? 'text-primary' : 'text-foreground/80'
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {authenticatedLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    <DropdownMenuItem className="cursor-pointer">
                      {link.icon}
                      {link.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="text-sm font-medium">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-fade-in">
          <div className="flex flex-col p-6 space-y-6">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-lg font-medium transition-colors',
                    isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                  )}
                >
                  {link.title}
                </Link>
              ))}
              {user && authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium transition-colors text-foreground/80 hover:text-primary flex items-center"
                >
                  {link.icon}
                  <span>{link.title}</span>
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-4 pt-4 border-t">
              {user ? (
                <>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={() => signOut()} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;

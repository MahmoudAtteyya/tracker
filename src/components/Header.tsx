import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
const Header = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={"sticky top-0 z-50 w-full transition-all duration-300 bg-background text-foreground border-b shadow-sm"}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-background text-foreground">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-6 hover:opacity-90 transition-opacity">
            <div className="p-3 bg-lavender-100 rounded-2xl shadow-lg">
              <Package className="w-8 h-8 lg:w-10 lg:h-10 text-lavender-400 drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl lg:text-3xl font-extrabold text-lavender-400 font-poppins drop-shadow-md">تتبع أوردر إيلياء</span>
            </div>
          </Link>

          {/* Navigation and Theme Toggle */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative w-10 h-10 rounded-full hover:bg-accent-purple/10 hover:text-accent-purple">
              <Sun className={`w-5 h-5 transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
              <Moon className={`absolute w-5 h-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;
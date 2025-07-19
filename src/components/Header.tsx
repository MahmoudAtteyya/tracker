import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, Home, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'حول', path: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg' 
        : 'bg-gradient-to-r from-purple-600/95 to-indigo-600/95 backdrop-blur-xl border-b border-white/20'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-all duration-300 group">
            <div className={`p-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
              isScrolled 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Package className="w-8 h-8 lg:w-10 lg:h-10 text-white drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl lg:text-2xl font-bold transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent' 
                  : 'text-white drop-shadow-lg'
              }`}>
                تتبع أوردرات إيلياء 
              </span>
              <span className={`text-xs lg:text-sm transition-all duration-300 ${
                isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'
              }`}>
                Eliaa Tracking
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive(item.path)
                      ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                      : isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' 
                : 'text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 dark:border-gray-700">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-white/20 backdrop-blur-sm text-white'
                        : 'text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
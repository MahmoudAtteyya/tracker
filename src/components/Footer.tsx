import React from 'react';
import { Package, Mail, Phone, Globe, Heart, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
                <Package className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                   تتبع أوردرات إيلياء 
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Eliaa Tracking</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md arabic">
              موقع تتبع الشحنات من إيلياء، نقدم لك خدمة تتبع فورية ودقيقة لجميع شحناتك
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/elliaa10" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5 text-blue-600" />
              </a>
              <a href="https://www.instagram.com/eyli014" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5 text-pink-600" />
              </a>
              <a href="https://elliaa.com/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <Globe className="w-5 h-5 text-purple-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 arabic">روابط سريعة</h4>
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors arabic">
                الرئيسية
              </Link>
              <Link to="/about" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors arabic">
                حول الموقع
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 arabic">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">support@elliaa.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">01141792085</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">www.elliaa.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
               جميع الحقوق محفوظة  © {currentYear}.إيلياء 
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              
              <span>for You</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Made with</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Package, Mail, Phone, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-lavender-400 border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center justify-center">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-3 bg-lavender-100 rounded-2xl shadow-lg">
            <Package className="w-8 h-8 text-lavender-400 drop-shadow-md" />
          </div>
          <span className="text-2xl font-extrabold text-lavender-400 font-poppins drop-shadow-md">تتبع أوردر إيلياء</span>
        </div>
        <nav className="flex flex-col items-center space-y-2 mb-4">
          <Link to="/" className="text-lg text-lavender-400 hover:text-lavender-300 transition-colors font-bold">تتبع الشحنة</Link>
        </nav>
        <div className="mt-2 text-base flex items-center gap-2">
        <span className="text-gray-400">for you</span>
        <span className="animate-pulse text-2xl text-lavender-400">💜</span>
          <span className="text-gray-400">Made with</span>
    
       
        </div>
      </div>
    </footer>
  );
};

export default Footer;

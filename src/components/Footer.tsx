
import React from 'react';
import { Package, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-foreground">Tataabu Order Eliaa</div>
                <div className="text-sm text-muted-foreground arabic">تتبع أوردر إيلياء</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional shipment tracking service with real-time updates and comprehensive delivery information.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Track Shipment
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@tataabu.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+20 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>www.tataabu.com</span>
              </div>
            </div>
          </div>

          {/* API Credit */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Powered By</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Egypt Post API
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time tracking data provided by Egypt Post official tracking system.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Tataabu Order Eliaa. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground arabic">
              جميع الحقوق محفوظة © ٢٠٢٤ تتبع أوردر إيلياء
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { Package, Mail, Phone, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-3 space-x-reverse">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lavender">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-foreground arabic text-lg">تتبع أوردر إيلياء</div>
                <div className="text-sm text-muted-foreground arabic">خدمة تتبع الشحنات المتقدمة</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed arabic">
              خدمة تتبع شحنات احترافية مع تحديثات فورية ومعلومات شاملة عن التسليم
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="font-semibold text-foreground arabic text-lg">روابط سريعة</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors arabic">
                تتبع الشحنة
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors arabic">
                من نحن
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors arabic">
                اتصل بنا
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="font-semibold text-foreground arabic text-lg">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-3 space-x-reverse text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="arabic" dir="ltr">info@tataabu.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3 space-x-reverse text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span dir="ltr">+20 123 456 789</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3 space-x-reverse text-sm text-muted-foreground">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span dir="ltr">www.tataabu.com</span>
              </div>
            </div>
          </div>

          {/* API Credit */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="font-semibold text-foreground arabic text-lg">مدعوم بواسطة</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground arabic">
                واجهة برمجة تطبيقات البريد المصري
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed arabic">
                بيانات التتبع الفورية مقدمة من نظام التتبع الرسمي للبريد المصري
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 md:pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            {/* Made with love by elliaa */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="arabic">صُنع بـ</span>
              <Heart className="w-4 h-4 text-red-500 animate-heartbeat" fill="currentColor" />
              <span>بواسطة إيلياء</span>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground arabic mb-1">
                جميع الحقوق محفوظة © ٢٠٢٤ تتبع أوردر إيلياء
              </div>
              <div className="text-xs text-muted-foreground">
                © 2024 Tataabu Order Eliaa. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

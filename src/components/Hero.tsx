import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Package, Truck, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Hero = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setAnimateElements(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم التتبع",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    // Simulate API validation
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/${trackingCode.trim()}`);
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    // Auto-detect if user enters full URL and extract barcode
    if (value.includes('/')) {
      const parts = value.split('/');
      value = parts[parts.length - 1];
    }
    setTrackingCode(value);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl transition-all duration-1000 ${animateElements ? 'animate-pulse' : 'opacity-0'}`} />
        <div className={`absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl transition-all duration-1000 delay-300 ${animateElements ? 'animate-pulse' : 'opacity-0'}`} />
        <div className={`absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-lg transition-all duration-1000 delay-500 ${animateElements ? 'animate-pulse' : 'opacity-0'}`} />
        <div className={`absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-md transition-all duration-1000 delay-700 ${animateElements ? 'animate-pulse' : 'opacity-0'}`} />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/6 transition-all duration-1000 delay-200 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Package className="w-8 h-8 text-purple-400/60" />
        </div>
        <div className={`absolute top-1/3 right-1/5 transition-all duration-1000 delay-400 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Truck className="w-8 h-8 text-indigo-400/60" />
        </div>
        <div className={`absolute bottom-1/4 left-1/5 transition-all duration-1000 delay-600 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <MapPin className="w-8 h-8 text-pink-400/60" />
        </div>
        <div className={`absolute bottom-1/3 right-1/6 transition-all duration-1000 delay-800 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Clock className="w-8 h-8 text-blue-400/60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Enhanced Heading */}
          <div className="mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">تتبع الشحنات المصرية</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent leading-tight">
              Track Your Shipment
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 arabic bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              تتبع شحنتك
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed arabic">
              اكتشف مكان شحنتك في الوقت الفعلي مع  تتبع أوردرات إيلياء 
            </p>
          </div>

          {/* Enhanced Search Form */}
          <form onSubmit={handleTrack} className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-30" />
              <div className="relative flex flex-col sm:flex-row gap-4 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Input 
                    type="text" 
                    placeholder="ادخل رقم التتبع الخاص بك" 
                    value={trackingCode} 
                    onChange={handleInputChange} 
                    className="pl-14 pr-4 py-6 text-lg border-0 focus:ring-2 focus:ring-purple-500 rounded-xl bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 arabic" 
                    disabled={isLoading} 
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading} 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border-0 group-hover:scale-105"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>تتبع</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Enhanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 arabic">تتبع فوري</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm arabic">احصل على معلومات شحنتك في الوقت الفعلي</p>
            </div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 arabic">تحديثات مستمرة</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm arabic">متابعة حالة الشحنة خطوة بخطوة</p>
            </div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 arabic">موقع دقيق</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm arabic">تعرف على موقع شحنتك بدقة</p>
            </div>
          </div>

          {/* Enhanced Example */}
          <div className="text-gray-600 dark:text-gray-300">
            <p className="text-sm mb-3 arabic">مثال على كود تتبع الشحنة:</p>
            <button 
              onClick={() => setTrackingCode('ENO30000000EG')} 
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-4 transition-colors font-mono text-sm bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700 hover:scale-105 transition-transform"
            >
              ENO30000000EG
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
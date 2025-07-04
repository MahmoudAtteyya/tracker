import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
const Hero = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
  return <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 lavender-gradient opacity-90" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-accent-purple/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-light-purple/15 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Heading */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Track Your Shipment
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/90 mb-6 arabic">
              تتبع شحنتك
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">اكتب كود تتبع شحنتك من إيلياء</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="ادخل رقم التتبع الخاص بك" value={trackingCode} onChange={handleInputChange} className="pl-12 pr-4 py-4 text-lg border-0 focus:ring-2 focus:ring-accent-purple rounded-xl bg-transparent placeholder:text-muted-foreground/60 arabic" disabled={isLoading} />
              </div>
              <Button type="submit" size="lg" disabled={isLoading} className="bg-gradient-to-r from-accent-purple to-deep-lavender hover:from-deep-lavender hover:to-dark-purple text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border-0">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                    <span>Track</span>
                    <ArrowRight className="w-5 h-5" />
                  </>}
              </Button>
            </div>
          </form>

          {/* Example */}
          <div className="mt-8 text-white/70">
            <p className="text-sm mb-2">مثال على كود تتبع الشحنة :</p>
            <button onClick={() => setTrackingCode('ENO31557487EG')} className="text-white/90 hover:text-white underline underline-offset-4 transition-colors font-mono text-sm bg-white/10 px-3 py-1 rounded-lg">ENO50000000EG</button>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
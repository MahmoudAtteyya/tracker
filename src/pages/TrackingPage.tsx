import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Copy, Share2, AlertCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingStepper from '@/components/TrackingStepper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTracking } from '@/hooks/useTracking';
import { toast } from '@/hooks/use-toast';

const TrackingPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const { data, loading, error, retryCount, isRetrying } = useTracking(barcode);

  useEffect(() => {
    if (barcode) {
      document.title = `تتبع ${barcode} - تتبع أوردر إيلياء`;
    }
  }, [barcode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ بنجاح",
        description: "تم نسخ رابط التتبع إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "فشل النسخ",
        description: "لم يتم نسخ الرابط، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `تتبع الشحنة ${barcode}`,
          text: `تتبع هذه الشحنة: ${barcode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('تم إلغاء المشاركة');
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-3 text-accent-purple hover:text-accent-purple/80 mb-6 md:mb-8 transition-colors text-base md:text-lg arabic">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              العودة للبحث
            </Link>
            
            <Card className="professional-card shadow-lavender bg-white border border-[#E0E0E0]">
              <CardContent className="pt-6 md:pt-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-destructive flex-shrink-0" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground arabic">لم يتم العثور على معلومات التتبع</h2>
                </div>
                
                <p className="text-muted-foreground mb-4 md:mb-6 text-base md:text-lg arabic leading-relaxed">
                  {error || `لم نتمكن من العثور على معلومات تتبع للرقم: ${barcode}`}
                </p>
                
                <div className="space-y-3 text-sm md:text-base text-muted-foreground arabic">
                  <p className="font-semibold">يرجى التحقق من:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4 md:mr-6 leading-relaxed">
                    <li>أن رقم التتبع مُدخل بشكل صحيح</li>
                    <li>أن الشحنة تم معالجتها من قبل البريد المصري</li>
                    <li>المحاولة مرة أخرى لاحقاً إذا كانت الشحنة حديثة</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                  <Button asChild className="text-base md:text-lg py-4 md:py-6 px-6 md:px-8 flex-1 bg-gradient-to-r from-accent-purple to-deep-lavender hover:from-deep-lavender hover:to-dark-purple text-white border-0">
                    <a
                      href="https://egyptpost.gov.eg/ar-eg/home/eservices/track-and-trace/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      تتبع من الموقع الرسمي
                    </a>
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="text-base md:text-lg py-4 md:py-6 px-6 md:px-8 flex-1"
                  >
                    إعادة المحاولة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* رأس الصفحة */}
        <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12">
          <Link to="/" className="inline-flex items-center gap-3 text-accent-purple hover:text-accent-purple/80 transition-colors text-base md:text-lg arabic self-start">
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            العودة للبحث
          </Link>
          
          <div className="text-center md:text-right">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground arabic mb-2 md:mb-3">
              نتائج التتبع
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl arabic break-all">
              الشحنة: <span className="font-mono font-bold text-accent-purple">{barcode}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button variant="outline" size="lg" onClick={handleCopyLink} className="text-sm md:text-base arabic">
              <Copy className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              نسخ الرابط
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare} className="text-sm md:text-base arabic">
              <Share2 className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>

        {/* نظرة عامة على الحالة */}
        <Card className="mb-8 md:mb-12 professional-card shadow-lavender bg-white border border-[#E0E0E0]">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="flex items-center gap-3 md:gap-4 arabic text-xl md:text-2xl text-right">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-accent-purple flex-shrink-0" />
              <span>الحالة الحالية: {data.currentStatus}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-base md:text-lg arabic leading-relaxed text-right">
              شحنتك قيد المعالجة حالياً. تابع الجدول الزمني التفصيلي أدناه للمزيد من المعلومات.
            </p>
          </CardContent>
        </Card>

        {/* الجدول الزمني للتتبع */}
        <Card className="professional-card shadow-lavender bg-white border border-[#E0E0E0]">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="arabic text-xl md:text-2xl text-right">الجدول الزمني للتتبع</CardTitle>
            <p className="text-base md:text-lg text-muted-foreground arabic leading-relaxed text-right">
              تابع رحلة شحنتك من نقطة الإرسال إلى الوجهة
            </p>
          </CardHeader>
          <CardContent className="pt-4 md:pt-8">
            <TrackingStepper steps={data.steps} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;

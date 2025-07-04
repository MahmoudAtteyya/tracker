
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
  const { data, loading, error } = useTracking(barcode);

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
      <div className="min-h-screen lavender-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen lavender-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-3 text-violet-600 hover:text-violet-800 mb-8 transition-colors text-lg arabic">
              <ArrowRight className="w-5 h-5" />
              العودة للبحث
            </Link>
            
            <Card className="professional-card border-red-200 bg-red-50/80 dark:bg-red-950/30 dark:border-red-700 shadow-elegant">
              <CardContent className="pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 arabic">لم يتم العثور على معلومات التتبع</h2>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg arabic leading-relaxed">
                  لم نتمكن من العثور على معلومات تتبع للرقم: <span className="font-mono font-bold text-violet-600">{barcode}</span>
                </p>
                
                <div className="space-y-3 text-base text-slate-600 dark:text-slate-300 arabic">
                  <p className="font-semibold">يرجى التحقق من:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6 leading-relaxed">
                    <li>أن رقم التتبع مُدخل بشكل صحيح</li>
                    <li>أن الشحنة تم معالجتها من قبل البريد المصري</li>
                    <li>المحاولة مرة أخرى لاحقاً إذا كانت الشحنة حديثة</li>
                  </ul>
                </div>

                <Button asChild className="mt-8 text-lg py-6 px-8">
                  <Link to="/">جرب رقم تتبع آخر</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lavender-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-violet-600 hover:text-violet-800 mb-6 transition-colors text-lg arabic">
              <ArrowRight className="w-5 h-5" />
              العودة للبحث
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 arabic mb-3">
              نتائج التتبع
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xl arabic">
              الشحنة: <span className="font-mono font-bold text-violet-600">{barcode}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={handleCopyLink} className="text-base arabic">
              <Copy className="w-5 h-5 ml-2" />
              نسخ الرابط
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare} className="text-base arabic">
              <Share2 className="w-5 h-5 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>

        {/* نظرة عامة على الحالة */}
        <Card className="mb-12 professional-card shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 arabic text-2xl">
              <Package className="w-8 h-8 text-violet-500" />
              الحالة الحالية: {data.status}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 text-lg arabic leading-relaxed">
              شحنتك قيد المعالجة حالياً. تابع الجدول الزمني التفصيلي أدناه للمزيد من المعلومات.
            </p>
          </CardContent>
        </Card>

        {/* الجدول الزمني للتتبع */}
        <Card className="professional-card shadow-elegant">
          <CardHeader>
            <CardTitle className="arabic text-2xl">الجدول الزمني للتتبع</CardTitle>
            <p className="text-lg text-slate-600 dark:text-slate-300 arabic leading-relaxed">
              تابع رحلة شحنتك من نقطة الإرسال إلى الوجهة
            </p>
          </CardHeader>
          <CardContent className="pt-8">
            <TrackingStepper steps={data.steps} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;

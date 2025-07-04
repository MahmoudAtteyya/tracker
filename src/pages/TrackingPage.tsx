
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Share2, AlertCircle } from 'lucide-react';
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
      document.title = `تتبع ${barcode} - Tataabu Order Eliaa`;
    }
  }, [barcode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط التتبع إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "فشل النسخ",
        description: "لم يتم نسخ الرابط",
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              العودة للبحث
            </Link>
            
            <Card className="professional-card border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-semibold text-foreground arabic">لم يتم العثور على معلومات التتبع</h2>
                </div>
                
                <p className="text-muted-foreground mb-4 arabic">
                  لم نتمكن من العثور على معلومات تتبع للرقم: <span className="font-mono font-medium">{barcode}</span>
                </p>
                
                <div className="space-y-2 text-sm text-muted-foreground arabic">
                  <p>يرجى التحقق من:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>أن رقم التتبع مُدخل بشكل صحيح</li>
                    <li>أن الشحنة تم معالجتها من قبل البريد المصري</li>
                    <li>المحاولة مرة أخرى لاحقاً إذا كانت الشحنة حديثة</li>
                  </ul>
                </div>

                <Button asChild className="mt-6">
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              العودة للبحث
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground arabic">
              نتائج التتبع
            </h1>
            <p className="text-muted-foreground mt-1 arabic">
              الشحنة: <span className="font-mono font-medium">{barcode}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 ml-2" />
              نسخ الرابط
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="mb-8 professional-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 arabic">
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse" />
              الحالة الحالية: {data.status}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground arabic">
              شحنتك قيد المعالجة حالياً. تحقق من الجدول الزمني التفصيلي أدناه للمزيد من المعلومات.
            </p>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="arabic">الجدول الزمني للتتبع</CardTitle>
            <p className="text-sm text-muted-foreground arabic">
              تابع رحلة شحنتك من نقطة الإرسال إلى الوجهة
            </p>
          </CardHeader>
          <CardContent>
            <TrackingStepper steps={data.steps} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;

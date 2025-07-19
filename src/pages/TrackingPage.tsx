import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Copy, Share2, AlertCircle, Package, MapPin, Clock, Truck, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingStepper from '@/components/TrackingStepper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTracking } from '@/hooks/useTracking';
import { toast } from '@/hooks/use-toast';

type TrackingStep = {
  id: string;
  status: string;
  statusArabic: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
};

type TrackingData = {
  barcode: string;
  status: string;
  currentStatus: string;
  steps: TrackingStep[];
  latestStep?: TrackingStep;
};

const TrackingPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const { data, loading, error, retryCount, isRetrying } = useTracking(barcode) as { data: TrackingData | null, loading: boolean, error: string | null, retryCount: number, isRetrying: boolean };
  const [animatePage, setAnimatePage] = useState(false);

  useEffect(() => {
    if (barcode) {
      document.title = `تتبع ${barcode} -  تتبع أوردرات إيلياء `;
    }
    const timer = setTimeout(() => setAnimatePage(true), 100);
    return () => clearTimeout(timer);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 arabic">جاري البحث عن شحنتك</h2>
              <p className="text-gray-600 dark:text-gray-300 arabic">يرجى الانتظار...</p>
            </div>
          <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 md:mb-8 transition-colors text-base md:text-lg arabic">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              العودة للبحث
            </Link>
            
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="pt-6 md:pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white arabic">لم يتم العثور على معلومات التتبع</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-base md:text-lg arabic leading-relaxed">
                  {error || `لم نتمكن من العثور على معلومات تتبع للرقم: ${barcode}`}
                </p>
                
                <div className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-300 arabic">
                  <p className="font-semibold text-gray-900 dark:text-white">يرجى التحقق من:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4 md:mr-6 leading-relaxed">
                    <li>أن رقم التتبع مُدخل بشكل صحيح</li>
                    <li>أن الشحنة تم معالجتها من قبل البريد المصري</li>
                    <li>المحاولة مرة أخرى لاحقاً إذا كانت الشحنة حديثة</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button asChild className="text-base md:text-lg py-4 md:py-6 px-6 md:px-8 flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                    <a
                      href={`https://egyptpost.gov.eg/ar-EG/TrackTrace/GetShipmentDetails?barcode=${barcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      تتبع من الموقع الرسمي
                    </a>
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="text-base md:text-lg py-4 md:py-6 px-6 md:px-8 flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
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

  if (data && data.latestStep) {
    // Debug: Show latestStep in console
    // eslint-disable-next-line no-console
    console.log('latestStep', data.latestStep);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className={`flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 transition-all duration-1000 ${animatePage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link to="/" className="inline-flex items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-base md:text-lg arabic self-start group">
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            العودة للبحث
          </Link>
          
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200 dark:border-green-700">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">تم العثور على الشحنة</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white arabic mb-3">
              نتائج التتبع
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl arabic break-all">
              الشحنة: <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-lg">{barcode}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button variant="outline" size="lg" onClick={handleCopyLink} className="text-sm md:text-base arabic border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Copy className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              نسخ الرابط
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare} className="text-sm md:text-base arabic border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Share2 className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className={`mb-8 md:mb-12 transition-all duration-1000 delay-200 ${animatePage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-4 arabic text-xl md:text-2xl text-right">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span>الحالة الحالية: {data.latestStep ? data.latestStep.status : data.currentStatus}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.latestStep ? (
                <>
                  <h3 className="text-xl md:text-2xl font-bold arabic leading-relaxed text-purple-600 dark:text-purple-400 mb-2">{data.latestStep.statusArabic}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg arabic leading-relaxed mb-2">{data.latestStep.description}</p>
                  {data.latestStep.location && (
                    <div className="flex items-center justify-end gap-3 md:gap-4 mb-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 arabic">{data.latestStep.location}</span>
                      <MapPin className="w-5 h-5 text-purple-500" />
                    </div>
                  )}
                  <div className="flex flex-row items-center gap-4 mt-2">
                    {data.latestStep.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 arabic">{data.latestStep.date}</span>
                      </div>
                    )}
                    {data.latestStep.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-base md:text-lg text-gray-600 dark:text-gray-300 arabic">{data.latestStep.time}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg arabic leading-relaxed text-right">
                  {data.currentStatus === 'تم التسليم'
                    ? 'شحنتك تم تسليمها بنجاح. تابع الجدول الزمني التفصيلي أدناه للمزيد من المعلومات.'
                    : 'شحنتك قيد المعالجة حالياً. تابع الجدول الزمني التفصيلي أدناه للمزيد من المعلومات.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tracking Timeline */}
        <div className={`transition-all duration-1000 delay-400 ${animatePage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="pb-4 md:pb-6">
              <CardTitle className="flex items-center gap-4 arabic text-xl md:text-2xl text-right">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span>الجدول الزمني للتتبع</span>
              </CardTitle>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 arabic leading-relaxed text-right">
              تابع رحلة شحنتك من نقطة الإرسال إلى الوجهة
            </p>
          </CardHeader>
          <CardContent className="pt-4 md:pt-8">
            <TrackingStepper steps={data.steps} />
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

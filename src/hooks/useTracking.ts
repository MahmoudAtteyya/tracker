import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface TrackingStep {
  id: string;
  status: string;
  statusArabic: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackingData {
  barcode: string;
  status: string;
  currentStatus: string;
  steps: TrackingStep[];
}

interface ApiResponse {
  data?: {
    barcode: string;
    case: number;
    data: Array<{
      status: number;
      date: string | null;
      time: string | null;
      country: string | null;
      city: string | null;
      location: string | null;
      itemStatus: string | null;
      mainStatus: string | null;
      isCurrent: boolean;
      isFinished: boolean;
    }>;
    error?: string;
  };
  success: boolean;
  errorMessages?: string[];
  error?: string;
}

// دالة للكشف عن صفحة Cloudflare
const isCloudflareChallenge = (text: string): boolean => {
  return text.includes('Just a moment') || 
         text.includes('cf_chl_') || 
         text.includes('challenge-platform') ||
         text.includes('Cloudflare') ||
         text.includes('<!DOCTYPE html>') ||
         text.includes('<html');
};

// دالة للكشف عن استجابة JSON صحيحة
const isValidJsonResponse = (text: string): boolean => {
  try {
    const parsed = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

// دالة للانتظار مع تأخير متزايد
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useTracking = (barcode: string | undefined) => {
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!barcode) return;

    const fetchTrackingData = async (attempt: number = 1, baseDelay: number = 1000) => {
      // زيادة التأخير الأساسي إذا كانت المحاولة الأولى بطيئة
      if (attempt === 1) {
        baseDelay = 3000; // تأخير أطول للمحاولة الأولى
      } else if (attempt === 2) {
        baseDelay = 8000; // تأخير أطول للمحاولة الثانية
      } else if (attempt === 3) {
        baseDelay = 15000; // تأخير أطول للمحاولة الثالثة
      } else {
        baseDelay = 25000; // تأخير أطول للمحاولات اللاحقة
      }
      setLoading(true);
      setError(null);
      setRetryCount(attempt - 1);
      setIsRetrying(attempt > 1);

      try {
        const startTime = Date.now();
        
        // إنشاء AbortController للتحكم في timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية timeout

        const response = await fetch(
          `http://localhost:3001/api/track/${barcode}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const responseTime = Date.now() - startTime;
        const responseText = await response.text();

        console.log(`محاولة ${attempt}: طول الاستجابة ${responseText.length} حرف`);

        // التحقق من أن الاستجابة JSON صحيحة
        if (!isValidJsonResponse(responseText)) {
          console.log('استجابة غير صحيحة من الخادم المحلي، محاولة إعادة المحاولة...');
          console.log('بداية الاستجابة:', responseText.substring(0, 300));
          
          if (attempt <= 3) {
            const waitTime = baseDelay + (attempt * 3000);
            console.log(`انتظار ${waitTime}ms قبل المحاولة التالية...`);
            await delay(waitTime);
            return fetchTrackingData(attempt + 1, baseDelay);
          } else {
            setError('استجابة غير صحيحة من الخادم المحلي. تأكد من تشغيل الخادم على المنفذ 3001.');
            setLoading(false);
            setIsRetrying(false);
            return;
          }
        }

        // محاولة تحليل الاستجابة كـ JSON
        let result: ApiResponse;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.log('فشل في تحليل JSON:', responseText.substring(0, 200));
          setError('استجابة غير صحيحة من الخادم المحلي. تأكد من تشغيل الخادم على المنفذ 3001.');
          setLoading(false);
          setIsRetrying(false);
          return;
        }

        // التحقق من نجاح الاستجابة
        if (result.success && result.data && Array.isArray(result.data.data) && result.data.data.length > 0) {
          const filteredData = result.data.data.filter(item => 
            item.isFinished || item.isCurrent
          );

          const currentItem = result.data.data.find(item => item.isCurrent);
          const currentStatus = currentItem?.mainStatus || 'غير محدد';

          const transformedData: TrackingData = {
            barcode: result.data.barcode,
            status: currentStatus,
            currentStatus: currentStatus,
            steps: filteredData.map((item, index) => ({
              id: `step-${item.status}`,
              status: item.mainStatus || 'غير محدد',
              statusArabic: item.itemStatus || 'غير محدد',
              date: item.date || '',
              time: item.time || '',
              location: item.location ? `${item.location}${item.city ? '، ' + item.city : ''}${item.country ? '، ' + item.country : ''}` : '',
              description: item.itemStatus || 'لا توجد تفاصيل متاحة',
              isCompleted: item.isFinished,
              isCurrent: item.isCurrent,
            }))
          };

          setData(transformedData);
          setLoading(false);
          setIsRetrying(false);
          
          // عرض رسالة نجاح مع وقت الاستجابة
          if (responseTime > 3000) {
            toast({
              title: "تم جلب البيانات بنجاح",
              description: `تم العثور على ${transformedData.steps.length} خطوة تتبع (${responseTime}ms)`,
            });
          }
          
        } else {
          console.log('استجابة API غير ناجحة:', result);
          
          // إذا لم تنجح المحاولة وكانت المحاولة الأولى، جرب مرة أخرى
          if (attempt === 1 && response.ok) {
            console.log('المحاولة الأولى فشلت، جاري المحاولة مرة أخرى...');
            await delay(8000); // تأخير أطول للمحاولة الثانية
            return fetchTrackingData(2, baseDelay);
          }
          
          // إذا كانت الاستجابة تحتوي على خطأ محدد
          if (result.error) {
            if (result.error === 'No data found') {
              setError('لم يتم العثور على معلومات التتبع لهذا الرقم. تأكد من صحة الرقم أو أن الشحنة لم يتم معالجتها بعد.');
            } else {
              setError(`خطأ في الخادم: ${result.error}`);
            }
          } else if (result.data?.error) {
            if (result.data.error === 'لم يتمكن من قراءة البيانات') {
              setError('فشل في قراءة البيانات من الخادم. يرجى المحاولة مرة أخرى بعد قليل.');
            } else {
              setError(`خطأ في البيانات: ${result.data.error}`);
            }
          } else {
            setError('لم يتم العثور على معلومات التتبع لهذا الرقم');
          }
          
          setLoading(false);
          setIsRetrying(false);
        }

      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        
        // إذا كان خطأ timeout
        if (err instanceof Error && err.name === 'AbortError') {
          if (attempt <= 3) {
            console.log(`timeout في المحاولة ${attempt}، جاري المحاولة مرة أخرى...`);
            await delay(baseDelay + (attempt * 5000));
            return fetchTrackingData(attempt + 1, baseDelay);
          } else {
            setError('انتهت مهلة الاتصال. تأكد من أن الخادم يعمل على المنفذ 3001.');
            setLoading(false);
            setIsRetrying(false);
            return;
          }
        }
        
        // إذا كان خطأ في الشبكة، جرب مرة أخرى
        if (attempt <= 3) {
          console.log(`خطأ في الشبكة، محاولة ${attempt + 1}...`);
          await delay(baseDelay + (attempt * 5000));
          return fetchTrackingData(attempt + 1, baseDelay);
        }
        
        setError('فشل في الاتصال بالخادم المحلي. تأكد من تشغيل الخادم على المنفذ 3001.');
        setLoading(false);
        setIsRetrying(false);
      }
    };

    fetchTrackingData();
  }, [barcode]);

  return { data, loading, error, retryCount, isRetrying };
};

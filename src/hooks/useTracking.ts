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
          `/api/track/${barcode}`,
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
          console.log('استجابة غير صحيحة من الخادم، محاولة إعادة المحاولة...');
          console.log('بداية الاستجابة:', responseText.substring(0, 300));
          
          if (attempt <= 3) {
            const waitTime = baseDelay + (attempt * 3000);
            console.log(`انتظار ${waitTime}ms قبل المحاولة التالية...`);
            await delay(waitTime);
            return fetchTrackingData(attempt + 1, baseDelay);
          } else {
            setError('استجابة غير صحيحة من الخادم. يرجى المحاولة مرة أخرى.');
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
          setError('استجابة غير صحيحة من الخادم. يرجى المحاولة مرة أخرى.');
          setLoading(false);
          setIsRetrying(false);
          return;
        }

        // التحقق من نجاح الاستجابة
        if (result.success && result.data && Array.isArray(result.data.data) && result.data.data.length > 0) {
          const filteredData = result.data.data.filter(item => 
            item.isFinished || item.isCurrent
          );

          // إيجاد الخطوة الأحدث (مع ترتيب الخطوات حسب التاريخ والوقت تنازليًا)
          const stepsWithDate = result.data.data.filter(item => item.date && item.time);
          const parseDateTime = (dateStr: string | null, timeStr: string | null) => {
            if (!dateStr || !timeStr) return null;
            const months: Record<string, string> = {
              'يناير': '01', 'فبراير': '02', 'مارس': '03', 'أبريل': '04', 'مايو': '05', 'يونيو': '06',
              'يوليو': '07', 'أغسطس': '08', 'سبتمبر': '09', 'أكتوبر': '10', 'نوفمبر': '11', 'ديسمبر': '12',
            };
            // تنظيف الوقت من أي رموز أو مسافات زائدة
            let cleanTimeStr = timeStr.replace(/[\u200E\u200F\r\n]+/g, '').replace(/\s+/g, ' ').trim();
            // استخراج الوقت والفترة (صباحاً/مساءً)
            let timeMatch = cleanTimeStr.match(/(\d{1,2}):(\d{2})\s*([\u0627-\u064A]+)?/);
            let period = '';
            if (cleanTimeStr.includes('مساء')) period = 'مساء';
            else if (cleanTimeStr.includes('صباح')) period = 'صباح';
            if (!timeMatch) return null;
            let hour = parseInt(timeMatch[1], 10);
            let minute = timeMatch[2];
            // تحويل الوقت إلى 24 ساعة
            if (period === 'مساء' && hour < 12) hour += 12;
            if (period === 'صباح' && hour === 12) hour = 0;
            const hourStr = hour.toString().padStart(2, '0');
            // تنظيف التاريخ
            let cleanDateStr = dateStr.replace(/[\u200E\u200F\r\n]+/g, '').replace(/\s+/g, ' ').trim();
            const dateMatch = cleanDateStr.match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);
            if (!dateMatch) return null;
            const [_, day, monthAr, year] = dateMatch;
            const month = months[monthAr] || '01';
            const isoString = `${year}-${month}-${day.padStart(2, '0')}T${hourStr}:${minute}:00`;
            const dateObj = new Date(isoString);
            // console.log('parseDateTime robust:', { dateStr, timeStr, cleanDateStr, cleanTimeStr, isoString, dateObj });
            return dateObj;
          };
          stepsWithDate.sort((a, b) => {
            const dateA = parseDateTime(a.date, a.time);
            const dateB = parseDateTime(b.date, b.time);
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB.getTime() - dateA.getTime(); // تنازلي
          });
          const latestStep = stepsWithDate[0];
          const currentStatus = latestStep?.mainStatus || 'غير محدد';

          const transformedData: TrackingData & { latestStep?: any } = {
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
            })),
            latestStep: latestStep ? {
              id: `step-${latestStep.status}`,
              status: latestStep.mainStatus || 'غير محدد',
              statusArabic: latestStep.itemStatus || 'غير محدد',
              date: latestStep.date || '',
              time: latestStep.time || '',
              location: latestStep.location ? `${latestStep.location}${latestStep.city ? '، ' + latestStep.city : ''}${latestStep.country ? '، ' + latestStep.country : ''}` : '',
              description: latestStep.itemStatus || 'لا توجد تفاصيل متاحة',
              isCompleted: latestStep.isFinished,
              isCurrent: latestStep.isCurrent,
            } : undefined
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
            setError('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
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
        
        setError('فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        setIsRetrying(false);
      }
    };

    fetchTrackingData();
  }, [barcode]);

  return { data, loading, error, retryCount, isRetrying };
};

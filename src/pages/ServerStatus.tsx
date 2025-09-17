import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, 
  Clock, 
  MemoryStick, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Database
} from 'lucide-react';

interface ServerStatusData {
  status: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  uptime: {
    ar: string;
    en: string;
    milliseconds: number;
  };
  environment: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
    unit: string;
  };
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    pid: number;
    cpuUsage: {
      user: number;
      system: number;
    };
  };
  lastUpdate: string;
  endpoints: string[];
  keepAlive: {
    active: boolean;
    interval: string;
    description: {
      ar: string;
      en: string;
    };
    features: string[];
  };
  apis: {
    total: number;
    available: number;
    current: string;
  };
}

const ServerStatus = () => {
  const [statusData, setStatusData] = useState<ServerStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchServerStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/server/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setStatusData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب بيانات الخادم');
      console.error('Error fetching server status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchServerStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchServerStatus();
  };

  const getMemoryColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading && !statusData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg">جاري تحميل بيانات الخادم...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-right">
            <strong>خطأ في الاتصال:</strong> {error}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={handleManualRefresh} variant="outline">
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-right">
            لا توجد بيانات متاحة للخادم
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Server className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">حالة الخادم</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          معلومات مفصلة عن حالة خادم Elliaa Forms
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleManualRefresh}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
              variant={autoRefresh ? "default" : "outline"}
            >
              <Activity className="ml-2 h-4 w-4" />
              {autoRefresh ? 'إيقاف التحديث التلقائي' : 'تشغيل التحديث التلقائي'}
            </Button>
          </div>
        </div>

        <Badge variant="outline" className="text-sm">
          آخر تحديث: {statusData.lastUpdate}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Server Status */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl">الحالة</CardTitle>
            </div>
            <CardDescription>
              {statusData.status.ar}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {statusData.message.ar}
            </div>
            <Badge variant="secondary" className="text-sm">
              البيئة: {statusData.environment}
            </Badge>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl">مدة التشغيل</CardTitle>
            </div>
            <CardDescription>
              منذ آخر إعادة تشغيل
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {statusData.uptime.ar}
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MemoryStick className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl">استخدام الذاكرة</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">المستخدمة</p>
                <p className="text-lg font-semibold">
                  {statusData.memory.used} {statusData.memory.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الإجمالية</p>
                <p className="text-lg font-semibold">
                  {statusData.memory.total} {statusData.memory.unit}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">نسبة الاستخدام:</span>
                <span className={`font-semibold ${getMemoryColor(statusData.memory.percentage)}`}>
                  {statusData.memory.percentage}%
                </span>
              </div>
              <Progress 
                value={statusData.memory.percentage} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Keep-Alive System */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wifi className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl">🔄 نظام Keep-Alive</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant={statusData.keepAlive.active ? "default" : "secondary"}>
                {statusData.keepAlive.active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              {statusData.keepAlive.description.ar}
            </div>
            
            <div className="text-center">
              {statusData.keepAlive.features.map((feature, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {feature}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>معلومات النظام</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">المنصة:</p>
                <p className="font-semibold">{statusData.system.platform}</p>
              </div>
              <div>
                <p className="text-muted-foreground">المعمارية:</p>
                <p className="font-semibold">{statusData.system.arch}</p>
              </div>
              <div>
                <p className="text-muted-foreground">إصدار Node:</p>
                <p className="font-semibold">{statusData.system.nodeVersion}</p>
              </div>
              <div>
                <p className="text-muted-foreground">معرف العملية:</p>
                <p className="font-semibold">{statusData.system.pid}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">استخدام المعالج:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">المستخدم:</p>
                  <p className="font-semibold">{statusData.system.cpuUsage.user}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">النظام:</p>
                  <p className="font-semibold">{statusData.system.cpuUsage.system}ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MemoryStick className="h-5 w-5" />
              <CardTitle>تفاصيل الذاكرة</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Heap المستخدم:</p>
                <p className="font-semibold">{statusData.memory.heapUsed} {statusData.memory.unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground">الذاكرة الخارجية:</p>
                <p className="font-semibold">{statusData.memory.external} {statusData.memory.unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Array Buffers:</p>
                <p className="font-semibold">{statusData.memory.arrayBuffers} {statusData.memory.unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground">الإجمالي RSS:</p>
                <p className="font-semibold">{statusData.memory.used} {statusData.memory.unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>معلومات إضافية</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">نقاط الفحص المتاحة:</h4>
              <ul className="space-y-1 text-sm">
                {statusData.endpoints.map((endpoint, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      {endpoint}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">إحصائيات APIs:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>إجمالي APIs:</span>
                  <Badge variant="outline">{statusData.apis.total}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>APIs المتاحة:</span>
                  <Badge variant="outline">{statusData.apis.available}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>API الحالي:</span>
                  <Badge variant="outline" className="text-xs">
                    {statusData.apis.current}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>فترة Keep-Alive:</span>
                  <Badge variant="outline">{statusData.keepAlive.interval}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStatus;

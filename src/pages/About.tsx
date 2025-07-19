import React from 'react';
import { Package, Shield, Clock, Globe, MapPin, Truck, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">منصة التتبع الرائدة</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
             تتبع أوردرات إيلياء 
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-8 arabic bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            موقع تتبع شحنات إيلياء
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed arabic">
            نقدم خدمة تتبع احترافية للشحنات مع تحديثات فورية ومعلومات شاملة عن التوصيل 
            وواجهة سهلة الاستخدام باللغة العربية
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg arabic">تتبع فوري</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                احصل على تحديثات فورية عن موقع طردك وحالة التوصيل
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg arabic">آمن وموثوق</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                معلومات التتبع الخاصة بك آمنة 
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg arabic">متاح 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                تتبع طرودك في أي وقت وأي مكان مع خدمتنا المتاحة دائماً
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg arabic">واجهة عربية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                واجهة عربية كاملة لتجربة مستخدم سلسة ومريحة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center arabic bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              مهمتنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed arabic">
                في  تتبع أوردرات إيلياء ، نؤمن بأن تتبع الطرود يجب أن يكون بسيطاً وموثوقاً ومتاحاً للجميع. 
                مهمتنا هي توفير أشمل وأسهل تجربة تتبع شحنات في مصر .
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed arabic">
                نسعى لتقديم خدمة متميزة تساعد المستخدمين على متابعة شحناتهم بسهولة ووضوح، 
                مع ضمان الدقة والسرعة في جميع العمليات.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 arabic bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            لماذا تختار  تتبع أوردرات إيلياء ؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 arabic">دقة في التتبع</h3>
              <p className="text-gray-600 dark:text-gray-300 arabic">
                معلومات دقيقة ومحدثة من مصادر موثوقة
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 arabic">سرعة في الأداء</h3>
              <p className="text-gray-600 dark:text-gray-300 arabic">
                واجهة سريعة ومحسنة للعمل على جميع الأجهزة
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 arabic">سهولة الاستخدام</h3>
              <p className="text-gray-600 dark:text-gray-300 arabic">
                واجهة بسيطة وواضحة تناسب جميع المستخدمين
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center arabic bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              التقنية والخدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed arabic text-center">
                نستخدم تقنيات الويب الحديثة لتوفير لك خدمة تتبع سريعة وموثوقة. 
                نضمن أوقات تحميل سريعة وتصميم متجاوب وتجربة مستخدم سلسة على جميع الأجهزة.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 arabic">خدمة سريعة</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                    استجابة فورية لطلبات التتبع
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200 dark:border-pink-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 arabic">تصميم حديث</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                    واجهة متجاوبة مع ثيمات فاتحة ومظلمة
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 arabic">أداء سريع</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 arabic">
                    محسن للسرعة والموثوقية
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;

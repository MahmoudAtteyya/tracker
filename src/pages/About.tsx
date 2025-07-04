
import React from 'react';
import { Package, Shield, Clock, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About Tataabu Order Eliaa
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold text-muted-foreground mb-6 arabic">
            عن تتبع أوردر إيلياء
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We provide professional shipment tracking services with real-time updates, 
            comprehensive delivery information, and a user-friendly bilingual interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get instant updates on your package location and delivery status.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your tracking information is secure and sourced from official postal services.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">24/7 Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your packages anytime, anywhere with our always-available service.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Bilingual Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full Arabic and English support for a seamless user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Tataabu Order Eliaa, we believe that tracking your packages should be simple, 
                reliable, and accessible. Our mission is to provide the most comprehensive and 
                user-friendly shipment tracking experience in the region.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed arabic">
                في تتبع أوردر إيلياء، نؤمن بأن تتبع الطرود يجب أن يكون بسيطاً وموثوقاً ومتاحاً. 
                مهمتنا هي توفير أشمل وأسهل تجربة تتبع شحنات في المنطقة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technology */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Technology & Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Our platform integrates directly with Egypt Post's official tracking API to provide 
                you with the most accurate and up-to-date information about your shipments. We use 
                modern web technologies to ensure fast loading times, responsive design, and 
                a smooth user experience across all devices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Real-time API</h4>
                  <p className="text-sm text-muted-foreground">
                    Direct integration with Egypt Post systems
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Modern Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Responsive interface with dark/light themes
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Fast Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Optimized for speed and reliability
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

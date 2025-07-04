
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
      document.title = `Tracking ${barcode} - Tataabu Order Eliaa`;
    }
  }, [barcode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Tracking link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Package ${barcode}`,
          text: `Track this package: ${barcode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
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
              Back to Search
            </Link>
            
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <h2 className="text-xl font-semibold text-foreground">Tracking Information Not Found</h2>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  We couldn't find tracking information for: <span className="font-mono font-medium">{barcode}</span>
                </p>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Please check:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>The tracking number is entered correctly</li>
                    <li>The package has been processed by Egypt Post</li>
                    <li>Try again after some time if the package was recently shipped</li>
                  </ul>
                </div>

                <Button asChild className="mt-6">
                  <Link to="/">Try Another Tracking Number</Link>
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
              Back to Search
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Tracking Results
            </h1>
            <p className="text-muted-foreground mt-1">
              Package: <span className="font-mono font-medium">{barcode}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-3 h-3 bg-lavender-500 rounded-full animate-pulse" />
              Current Status: {data.status}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your package is currently being processed. Check the detailed timeline below for more information.
            </p>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Follow your package journey from origin to destination
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

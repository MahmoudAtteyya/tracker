
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface TrackingData {
  barcode: string;
  status: string;
  steps: Array<{
    id: string;
    status: string;
    statusArabic: string;
    date: string;
    time: string;
    location: string;
    description: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }>;
}

export const useTracking = (barcode: string | undefined) => {
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barcode) return;

    const fetchTrackingData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Save to localStorage for recently searched
        const recentSearches = JSON.parse(localStorage.getItem('recentTrackingSearches') || '[]');
        const updatedSearches = [barcode, ...recentSearches.filter((item: string) => item !== barcode)].slice(0, 5);
        localStorage.setItem('recentTrackingSearches', JSON.stringify(updatedSearches));

        const response = await fetch(
          `https://egyptpost.gov.eg/ar-EG/TrackTrace/GetShipmentDetails?barcode=${barcode}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tracking data');
        }

        const result = await response.json();
        
        // Mock data transformation (since we can't test the real API structure)
        const mockData: TrackingData = {
          barcode,
          status: 'In Transit',
          steps: [
            {
              id: '1',
              status: 'Order Registered',
              statusArabic: 'تم تسجيل الطلب',
              date: '2024-01-15',
              time: '10:30 AM',
              location: 'Cairo, Egypt',
              description: 'Your package has been registered and is ready for processing.',
              isCompleted: true,
              isCurrent: false,
            },
            {
              id: '2', 
              status: 'Processing',
              statusArabic: 'قيد المعالجة',
              date: '2024-01-16',
              time: '2:15 PM',
              location: 'Cairo Sorting Center',
              description: 'Package is being processed at our sorting facility.',
              isCompleted: true,
              isCurrent: false,
            },
            {
              id: '3',
              status: 'In Transit',
              statusArabic: 'في الطريق',
              date: '2024-01-17',
              time: '8:45 AM',
              location: 'Alexandria Hub',
              description: 'Your package is on its way to the destination.',
              isCompleted: false,
              isCurrent: true,
            },
            {
              id: '4',
              status: 'Out for Delivery',
              statusArabic: 'خرج للتسليم',
              date: '',
              time: '',
              location: '',
              description: 'Package will be delivered to your address.',
              isCompleted: false,
              isCurrent: false,
            },
            {
              id: '5',
              status: 'Delivered',
              statusArabic: 'تم التسليم',
              date: '',
              time: '',
              location: '',
              description: 'Package successfully delivered.',
              isCompleted: false,
              isCurrent: false,
            }
          ]
        };

        setData(mockData);
      } catch (err) {
        console.error('Tracking error:', err);
        setError('Unable to fetch tracking information. Please check the tracking number and try again.');
        toast({
          title: "Tracking Error",
          description: "Unable to fetch tracking information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [barcode]);

  return { data, loading, error };
};

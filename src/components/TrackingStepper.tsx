
import React from 'react';
import { Check, Package, Truck, Hourglass } from 'lucide-react';

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

interface TrackingStepperProps {
  steps: TrackingStep[];
}

const TrackingStepper: React.FC<TrackingStepperProps> = ({ steps }) => {
  const getStepIcon = (step: TrackingStep, index: number) => {
    if (step.isCompleted) {
      return <Check className="w-5 h-5 text-white" />;
    } else if (step.isCurrent) {
      return <Hourglass className="w-5 h-5 text-white animate-pulse" />;
    } else {
      // Different icons for different steps
      switch (index % 3) {
        case 0:
          return <Package className="w-5 h-5 text-muted-foreground" />;
        case 1:
          return <Truck className="w-5 h-5 text-muted-foreground" />;
        default:
          return <Hourglass className="w-5 h-5 text-muted-foreground" />;
      }
    }
  };

  const getStepStyles = (step: TrackingStep) => {
    if (step.isCompleted) {
      return {
        circle: 'bg-green-500 border-green-500 animate-pulse-glow',
        line: 'bg-green-500',
        card: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
      };
    } else if (step.isCurrent) {
      return {
        circle: 'bg-lavender-500 border-lavender-500 animate-pulse-glow',
        line: 'bg-gradient-to-r from-lavender-500 to-muted',
        card: 'border-lavender-200 bg-lavender-50 dark:bg-lavender-950/20 dark:border-lavender-700'
      };
    } else {
      return {
        circle: 'bg-muted border-muted-foreground/30',
        line: 'bg-muted',
        card: 'border-muted bg-card'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const styles = getStepStyles(step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative animate-fade-in">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-6 top-16 w-0.5 h-16 -ml-px">
                  <div className={`w-full h-full ${styles.line} transition-all duration-500`} />
                </div>
              )}

              {/* Step Content */}
              <div className="flex items-start space-x-4">
                {/* Step Circle */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${styles.circle}`}>
                  {getStepIcon(step, index)}
                </div>

                {/* Step Details */}
                <div className={`flex-1 p-6 rounded-xl border transition-all duration-300 ${styles.card}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {step.status}
                        </h3>
                        <span className="text-base font-medium text-muted-foreground arabic">
                          {step.statusArabic}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {step.location && (
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          <span className="w-2 h-2 bg-lavender-500 rounded-full" />
                          {step.location}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <div className="text-sm font-medium text-foreground">
                        {step.date}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {step.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingStepper;

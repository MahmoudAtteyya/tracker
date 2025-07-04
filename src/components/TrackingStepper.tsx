
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
          return <Package className="w-5 h-5" />;
        case 1:
          return <Truck className="w-5 h-5" />;
        default:
          return <Hourglass className="w-5 h-5" />;
      }
    }
  };

  const getStepStyles = (step: TrackingStep) => {
    if (step.isCompleted) {
      return {
        circle: 'status-icon-completed',
        line: 'bg-green-300',
        card: 'status-completed'
      };
    } else if (step.isCurrent) {
      return {
        circle: 'status-icon-current',
        line: 'bg-gradient-to-b from-violet-300 to-slate-200',
        card: 'status-current'
      };
    } else {
      return {
        circle: 'status-icon-pending',
        line: 'bg-slate-200 dark:bg-slate-700',
        card: 'status-pending'
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
                <div className="absolute right-6 top-16 w-0.5 h-16 -mr-px">
                  <div className={`w-full h-full ${styles.line} transition-all duration-500`} />
                </div>
              )}

              {/* Step Content */}
              <div className="flex items-start space-x-4 space-x-reverse">
                {/* Step Circle */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${styles.circle}`}>
                  {getStepIcon(step, index)}
                </div>

                {/* Step Details */}
                <div className={`flex-1 p-6 rounded-xl border transition-all duration-300 professional-card ${styles.card}`}>
                  <div className="flex flex-col gap-4 text-right">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-foreground arabic">
                          {step.status}
                        </h3>
                        <span className="text-base text-muted-foreground arabic">
                          {step.statusArabic}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed arabic">
                        {step.description}
                      </p>
                      
                      {step.location && (
                        <p className="text-sm font-medium text-foreground flex items-center justify-end gap-2 arabic">
                          <span>{step.location}</span>
                          <span className="w-2 h-2 bg-violet-500 rounded-full" />
                        </p>
                      )}
                    </div>

                    {(step.date || step.time) && (
                      <div className="flex flex-col items-end text-right border-t pt-3">
                        {step.date && (
                          <div className="text-sm font-medium text-foreground arabic">
                            {step.date}
                          </div>
                        )}
                        {step.time && (
                          <div className="text-sm text-muted-foreground arabic">
                            {step.time}
                          </div>
                        )}
                      </div>
                    )}
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

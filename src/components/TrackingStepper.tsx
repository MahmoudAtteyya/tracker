import React from 'react';
import { Check, Package, Truck, Clock } from 'lucide-react';

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
      return <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />;
    } else if (step.isCurrent) {
      return <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />;
    } else {
      return index % 2 === 0 ? <Package className="w-5 h-5 md:w-6 md:h-6" /> : <Truck className="w-5 h-5 md:w-6 md:h-6" />;
    }
  };

  const getStepStyles = (step: TrackingStep) => {
    if (step.isCompleted) {
      return {
        circle: 'status-icon-completed',
        line: 'bg-gradient-to-b from-green-300 to-emerald-400',
        card: 'status-completed'
      };
    } else if (step.isCurrent) {
      return {
        circle: 'status-icon-current',
        line: 'bg-gradient-to-b from-accent-purple to-deep-lavender',
        card: 'status-current'
      };
    } else {
      return {
        circle: 'bg-muted text-muted-foreground',
        line: 'bg-muted',
        card: 'bg-muted/30 border-muted'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-6 md:space-y-8">
        {steps.map((step, index) => {
          const styles = getStepStyles(step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* خط الربط */}
              {!isLast && (
                <div className="absolute right-6 md:right-7 top-16 md:top-20 w-0.5 md:w-1 h-16 md:h-20 -mr-px">
                  <div className={`w-full h-full ${styles.line} transition-all duration-700 rounded-full`} />
                </div>
              )}

              {/* محتوى الخطوة */}
              <div className="flex items-start gap-4 md:gap-6">
                {/* دائرة الخطوة */}
                <div className={`relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${styles.circle} shadow-lavender`}>
                  {getStepIcon(step, index)}
                  {step.isCurrent && (
                    <div className="absolute inset-0 rounded-full border-2 md:border-4 border-accent-purple/20 animate-ping opacity-20"></div>
                  )}
                </div>

                {/* تفاصيل الخطوة */}
                <div className={`flex-1 p-4 md:p-8 rounded-xl md:rounded-2xl border-2 transition-all duration-500 professional-card-hover ${styles.card} shadow-lavender hover:shadow-lavender-hover`}>
                  <div className="flex flex-col gap-4 md:gap-6 text-right">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:gap-3 mb-3 md:mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-foreground arabic leading-relaxed">
                          {step.statusArabic}
                        </h3>
                        <span className="text-sm md:text-base text-accent-purple font-medium arabic leading-relaxed">
                          {step.description}
                        </span>
                      </div>
                      
                      {step.location && (
                        <div className="flex items-center justify-end gap-2 md:gap-3 mb-3 md:mb-4">
                          <span className="text-sm md:text-base font-medium text-foreground arabic">
                            {step.location}
                          </span>
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-accent-purple rounded-full shadow-sm" />
                        </div>
                      )}
                    </div>

                    {(step.date || step.time) && (
                      <div className="flex flex-col items-end text-right border-t-2 border-border pt-4 md:pt-6">
                        {step.date && (
                          <div className="text-base md:text-lg font-semibold text-foreground arabic mb-1">
                            {step.date}
                          </div>
                        )}
                        {step.time && (
                          <div className="text-sm md:text-base text-muted-foreground arabic">
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


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
      return <Check className="w-6 h-6 text-white" />;
    } else if (step.isCurrent) {
      return <Clock className="w-6 h-6 text-white" />;
    } else {
      return index % 2 === 0 ? <Package className="w-6 h-6" /> : <Truck className="w-6 h-6" />;
    }
  };

  const getStepStyles = (step: TrackingStep) => {
    if (step.isCompleted) {
      return {
        circle: 'status-icon-completed',
        line: 'bg-gradient-to-b from-emerald-300 to-green-300',
        card: 'status-completed'
      };
    } else if (step.isCurrent) {
      return {
        circle: 'status-icon-current',
        line: 'bg-gradient-to-b from-violet-300 to-purple-300',
        card: 'status-current'
      };
    } else {
      return {
        circle: 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400',
        line: 'bg-slate-200 dark:bg-slate-700',
        card: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {steps.map((step, index) => {
          const styles = getStepStyles(step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* خط الربط */}
              {!isLast && (
                <div className="absolute right-7 top-20 w-1 h-20 -mr-px">
                  <div className={`w-full h-full ${styles.line} transition-all duration-700 rounded-full`} />
                </div>
              )}

              {/* محتوى الخطوة */}
              <div className="flex items-start space-x-6 space-x-reverse">
                {/* دائرة الخطوة */}
                <div className={`relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${styles.circle} shadow-elegant`}>
                  {getStepIcon(step, index)}
                  {step.isCurrent && (
                    <div className="absolute inset-0 rounded-full border-4 border-violet-200 animate-ping opacity-20"></div>
                  )}
                </div>

                {/* تفاصيل الخطوة */}
                <div className={`flex-1 p-8 rounded-2xl border-2 transition-all duration-500 professional-card-hover ${styles.card} shadow-elegant hover:shadow-elegant-hover`}>
                  <div className="flex flex-col gap-6 text-right">
                    <div className="flex-1">
                      <div className="flex flex-col gap-3 mb-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 arabic leading-relaxed">
                          {step.status}
                        </h3>
                        <span className="text-lg text-violet-600 dark:text-violet-400 font-medium arabic leading-relaxed">
                          {step.statusArabic}
                        </span>
                      </div>
                      
                      <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-loose arabic">
                        {step.description}
                      </p>
                      
                      {step.location && (
                        <div className="flex items-center justify-end gap-3 mb-4">
                          <span className="text-base font-medium text-slate-700 dark:text-slate-200 arabic">
                            {step.location}
                          </span>
                          <div className="w-3 h-3 bg-violet-500 rounded-full shadow-sm" />
                        </div>
                      )}
                    </div>

                    {(step.date || step.time) && (
                      <div className="flex flex-col items-end text-right border-t-2 border-slate-100 dark:border-slate-700 pt-6">
                        {step.date && (
                          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100 arabic mb-1">
                            {step.date}
                          </div>
                        )}
                        {step.time && (
                          <div className="text-base text-slate-500 dark:text-slate-400 arabic">
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

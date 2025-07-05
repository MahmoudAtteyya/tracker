import React, { useEffect, useState } from 'react';
import { Check, Package, Truck, Clock, MapPin, Calendar, Clock as TimeIcon } from 'lucide-react';

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
  const [animateSteps, setAnimateSteps] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateSteps(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getStepIcon = (step: TrackingStep, index: number) => {
    if (step.isCompleted) {
      return <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />;
    } else if (step.isCurrent) {
      return <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />;
    } else {
      const icons = [Package, Truck, MapPin, Calendar];
      const IconComponent = icons[index % icons.length];
      return <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />;
    }
  };

  const getStepStyles = (step: TrackingStep) => {
    if (step.isCompleted) {
      return {
        circle: 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25',
        line: 'bg-gradient-to-b from-green-400 to-emerald-400',
        card: 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl',
        status: 'text-green-600 dark:text-green-400',
        description: 'text-gray-600 dark:text-gray-300'
      };
    } else if (step.isCurrent) {
      return {
        circle: 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25 animate-pulse',
        line: 'bg-gradient-to-b from-purple-400 to-indigo-400',
        card: 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-600 shadow-lg hover:shadow-xl',
        status: 'text-purple-600 dark:text-purple-400 font-semibold',
        description: 'text-gray-700 dark:text-gray-200'
      };
    } else {
      return {
        circle: 'bg-gray-200 dark:bg-gray-600 text-gray-400',
        line: 'bg-gray-200 dark:bg-gray-600',
        card: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600',
        status: 'text-gray-500 dark:text-gray-400',
        description: 'text-gray-500 dark:text-gray-400'
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="space-y-8 md:space-y-10">
        {steps.map((step, index) => {
          const styles = getStepStyles(step);
          const isLast = index === steps.length - 1;

          return (
            <div 
              key={step.id} 
              className={`relative transition-all duration-1000 ${animateSteps ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Enhanced Connection Line */}
              {!isLast && (
                <div className="absolute right-6 md:right-7 top-16 md:top-20 w-0.5 md:w-1 h-16 md:h-20 -mr-px">
                  <div className={`w-full h-full ${styles.line} transition-all duration-700 rounded-full shadow-sm`} />
                </div>
              )}

              {/* Step Content */}
              <div className="flex items-start gap-6 md:gap-8">
                {/* Enhanced Step Circle */}
                <div className={`relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${styles.circle} hover:scale-110`}>
                  {getStepIcon(step, index)}
                  {step.isCurrent && (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 md:border-4 border-purple-400/30 animate-ping opacity-20"></div>
                      <div className="absolute inset-0 rounded-full border-2 md:border-4 border-purple-400/20 animate-pulse"></div>
                    </>
                  )}
                  {step.isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></div>
                  )}
                </div>

                {/* Enhanced Step Details */}
                <div className={`flex-1 p-6 md:p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] ${styles.card} backdrop-blur-sm`}>
                  <div className="flex flex-col gap-4 md:gap-6 text-right">
                    <div className="flex-1">
                      <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                        <h3 className={`text-xl md:text-2xl font-bold arabic leading-relaxed ${styles.status}`}>
                          {step.statusArabic}
                        </h3>
                        <span className={`text-base md:text-lg arabic leading-relaxed ${styles.description}`}>
                          {step.description}
                        </span>
                      </div>
                      
                      {step.location && (
                        <div className="flex items-center justify-end gap-3 md:gap-4 mb-4 md:mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 arabic">
                            {step.location}
                          </span>
                          <MapPin className="w-5 h-5 text-purple-500" />
                        </div>
                      )}
                    </div>

                    {(step.date || step.time) && (
                      <div className="flex flex-col items-end text-right border-t-2 border-gray-100 dark:border-gray-600 pt-4 md:pt-6">
                        {step.date && (
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 arabic">
                              {step.date}
                            </div>
                          </div>
                        )}
                        {step.time && (
                          <div className="flex items-center gap-2">
                            <TimeIcon className="w-4 h-4 text-gray-400" />
                            <div className="text-base md:text-lg text-gray-600 dark:text-gray-300 arabic">
                              {step.time}
                            </div>
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

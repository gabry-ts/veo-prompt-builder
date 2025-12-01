import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
  completedSteps: boolean[];
}

function WizardSteps({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}: WizardStepsProps): JSX.Element {
  return (
    <div className="mb-10">
      <div className="glass-card rounded-2xl p-6 card-3d">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps[index];
            const isAccessible = index <= currentStep || isCompleted;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => onStepClick(index)}
                  disabled={!isAccessible}
                  className={`
                    group relative flex flex-col items-center gap-3 p-4 rounded-xl
                    transition-all duration-300 w-full
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/20 shadow-lg scale-105'
                        : isCompleted
                          ? 'glass-card hover:scale-105 hover:shadow-md'
                          : 'opacity-60 hover:opacity-80'
                    }
                    ${!isAccessible ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Glow effect for active step */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl animate-pulse" />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    {/* Icon Circle */}
                    <div
                      className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                        transition-all duration-300 group-hover:scale-110
                        ${
                          isActive
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow'
                            : isCompleted
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : step.icon}
                    </div>

                    {/* Title and Description */}
                    <div className="text-center hidden lg:block">
                      <div
                        className={`
                          text-sm font-bold transition-colors duration-300
                          ${
                            isActive
                              ? 'gradient-text'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>

                    {/* Mobile: Just show title on small screens */}
                    <div className="text-center lg:hidden">
                      <div
                        className={`
                          text-xs font-semibold
                          ${
                            isActive
                              ? 'text-primary-600 dark:text-primary-400'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className="relative h-1 flex-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`
                        absolute inset-y-0 left-0 rounded-full transition-all duration-500
                        ${
                          completedSteps[index]
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full shadow-glow-accent'
                            : 'w-0'
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WizardSteps;

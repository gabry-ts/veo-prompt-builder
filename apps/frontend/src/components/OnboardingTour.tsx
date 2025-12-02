import { useState, useEffect } from 'react';
import type { Step, CallBackProps } from 'react-joyride';
import Joyride, { STATUS } from 'react-joyride';
import { Clapperboard } from 'lucide-react';

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const tourSteps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Welcome to Veo Prompt Builder! <Clapperboard className="w-6 h-6" />
        </h2>
        <p className="text-gray-700">
          Let's take a quick tour to help you create amazing video prompts for Google Veo 3.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-prompt"]',
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Create Your First Prompt</h3>
        <p className="text-gray-700">
          Click here to start creating a new Veo prompt from scratch or use a template.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="templates"]',
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Start with Templates</h3>
        <p className="text-gray-700">
          Choose from 6 pre-built templates for cooking, travel, product demos, and more.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="wizard"]',
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Visual Wizard Builder</h3>
        <p className="text-gray-700">
          Fill in your prompt step-by-step with our guided wizard. Track your progress as you go!
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="validation"]',
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Real-time Validation</h3>
        <p className="text-gray-700">
          Get instant feedback on your prompt with errors, warnings, and tips to optimize for Veo 3.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="export"]',
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Export & Save</h3>
        <p className="text-gray-700">
          Download your prompt as JSON for Veo 3 or save it to your library for later.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
];

function OnboardingTour({ run = false, onComplete }: OnboardingTourProps): JSX.Element {
  const [runTour, setRunTour] = useState(run);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#0ea5e9',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 16,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}

export default OnboardingTour;

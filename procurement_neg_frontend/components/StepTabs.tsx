'use client';

import { cn } from '@/lib/utils';

interface StepTabsProps {
  steps: string[];
  activeStep: number;
  workflowStep: number;
  onTabClick: (index: number) => void;
  orientation?: "horizontal" | "vertical";
}

export default function StepTabs({
  steps,
  activeStep,
  workflowStep,
  onTabClick,
  orientation = "horizontal",
}: StepTabsProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "space-y-2",
        isVertical ? "flex flex-col" : "flex flex-row space-x-2"
      )}
    >
      {/* <div className="flex space-x-4 border-b"> */}
      {steps.map((step, index) => {
        const isCompleted = index < workflowStep;
        const isActive = index === activeStep;
        const isCurrent = index === workflowStep;

        return (
          <button
            key={step}
            onClick={() => onTabClick(index)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              isCompleted
                ? 'text-green-600 border-green-600'
                : isCurrent
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent',
              isActive && 'bg-green-100 text-green-800 border-blue-700 rounded-t shadow'
            )}
          >
            {step}
          </button>
        );
      })}
      {/* </div> */}
    </div>
  );
}

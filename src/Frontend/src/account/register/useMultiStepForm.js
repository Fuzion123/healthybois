import { useState } from "react";

export function useMultiStepForm(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) {
        return i;
      }
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) {
        return i;
      }

      return i - 1;
    });
  }

  function goto(index) {
    setCurrentStepIndex(index);
  }

  function progress() {
    if (steps.length - 1 === 0) return 100;

    return (currentStepIndex / (steps.length - 1)) * 100;
  }

  return {
    steps,
    currentStepIndex,
    step: steps[currentStepIndex],
    goto,
    next,
    back,
    progress,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}

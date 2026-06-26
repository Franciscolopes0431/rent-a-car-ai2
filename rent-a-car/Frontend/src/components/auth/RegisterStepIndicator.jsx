function RegisterStepIndicator({ currentStep, totalSteps = 2 }) {
  return (
    <div
      className="rc-register-step-indicator"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Passo ${currentStep} de ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <span
            key={stepNumber}
            className={`rc-register-step-segment ${isActive ? 'is-active' : ''}`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default RegisterStepIndicator;

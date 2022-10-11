import { useMediaQuery } from 'hooks';
import BackButton from './BackButton';
import NextButton from './NexStepButton';
import StepLabelAndIcon from './StepLabelAndIcon';
import SubmitButton from './SubmitButton';

export default function LeftPannel({
  currentStep,
  isSubmitting,
  showNextButton,
  moveToNextStep,
  steps,
  showSubmitButton,
  formId,
  finalLabel,
  showPreStep,
  onSubmit,
  isStepValid,
  moveBackStep,
  alignToTop,
}) {
  const notMobile = useMediaQuery();

  // mobile version
  if (!notMobile) {
    return (
      <div
        className="is-hidden-tablet has-background-white-ter p-4"
        style={{ position: 'fixed', minWidth: '100%', zIndex: 2 }}
      >
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <div style={{ minHeight: 24 }}>
            {currentStep > 0 && <BackButton isSubmitting={isSubmitting} />}
          </div>
          <div className="is-flex">
            <div className="step-indicator-mobile rounded">
              <span className="p-3 small-text">
                {currentStep} / {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // desktop version
  return (
    <div className="step-by-step has-background-white-ter pl-4 is-hidden-mobile is-flex is-flex-direction-column is-justify-content-flex-start pt-6">
      <div className="mb-6" style={{ minHeight: 24 }}>
        {currentStep > 0 && (
          <BackButton isSubmitting={isSubmitting} onClick={moveBackStep} />
        )}
      </div>
      <div className="pr-7">
        {steps.map((step, i) => (
          <StepLabelAndIcon
            key={`step-and-icon-${i}`}
            stepIdx={i}
            stepLabel={step.label}
            showPreStep={showPreStep}
            currentStep={currentStep}
          />
        ))}
      </div>
      {currentStep < steps.length - 1 && showNextButton && (
        <div className="pr-7">
          <NextButton
            formId={formId}
            moveToNextStep={moveToNextStep}
            disabled={!isStepValid}
          />
        </div>
      )}
      {currentStep === steps.length - 1 && showSubmitButton && (
        <div className="pr-7">
          <SubmitButton
            formId={formId}
            disabled={!isStepValid}
            onSubmit={onSubmit}
            label={finalLabel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}

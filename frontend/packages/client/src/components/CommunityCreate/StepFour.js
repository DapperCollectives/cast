import React, { useEffect } from 'react';
import StrategySelectorForm from 'components/Community/StrategySelectorForm';
import ActionButton from 'components/ActionButton';
import { mapFieldsForBackend } from '../Community/CommunityPropsAndVoting';

export default function StepFour({
  stepData,
  setStepValid,
  onDataChange,
  onSubmit,
  isStepValid,
} = {}) {
  const { strategies } = stepData || {};

  useEffect(() => {
    if (strategies?.length > 0 && !isStepValid) {
      setStepValid(true);
    } else {
      setStepValid(false);
    }
  }, [strategies, setStepValid, isStepValid]);

  const onStrategySelection = (strategies) => {
    onDataChange({ strategies });
  };

  return (
    <StrategySelectorForm
      existingStrategies={strategies}
      onStrategySelection={onStrategySelection}
      callToAction={() => {
        return (
          <ActionButton
            label="CREATE COMMUNITY"
            enabled={isStepValid}
            onClick={isStepValid ? () => onSubmit() : () => {}}
            classNames="mt-5"
          />
        );
      }}
    />
  );
}

import * as React from 'react';

import { StepperFieldProps } from '@aws-amplify/ui-react';

import { StepperFieldPropControlsProps } from './StepperFieldPropControls';

export interface UseStepperFieldProps {
  (initialValues: StepperFieldProps): StepperFieldPropControlsProps;
}

export const useStepperFieldProps: UseStepperFieldProps = (initialValues) => {
  const [label, setLabel] = React.useState(initialValues.label);
  const [isLabelHidden, setIsLabelHidden] = React.useState(
    initialValues.isLabelHidden
  );
  const [max, setMax] = React.useState(initialValues.max);
  const [min, setMin] = React.useState(initialValues.min);
  const [step, setStep] = React.useState(initialValues.step);
  const [size, setSize] = React.useState(initialValues.size);
  const [variation, setVariation] = React.useState(initialValues.variation);
  return {
    label,
    setLabel,
    isLabelHidden,
    setIsLabelHidden,
    max,
    setMax,
    min,
    setMin,
    step,
    setStep,
    size,
    setSize,
    variation,
    setVariation,
  };
};

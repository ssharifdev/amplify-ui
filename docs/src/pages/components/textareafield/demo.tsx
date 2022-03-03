import * as React from 'react';

import {
  TextAreaField,
  Flex,
  FlexContainerStyleProps,
  TextAreaFieldProps,
} from '@aws-amplify/ui-react';

import { Demo } from '@/components/Demo';
import { useTextAreaFieldProps } from './useTextAreaFieldProps';
import { GetFieldControls } from '../shared/GetFieldControls';
import { useFlexContainerStyleProps } from '../shared/useFlexContainerStyleProps';
import { TextAreaFieldPropControls } from './TextAreaFieldPropControls';

export const TextAreaFieldDemo = () => {
  const flexStyleProps = useFlexContainerStyleProps({
    alignItems: '',
    alignContent: '',
    direction: 'column',
    gap: '',
    justifyContent: '',
    wrap: 'nowrap',
  });
  const textFieldProps = useTextAreaFieldProps({
    autoComplete: 'off',
    defaultValue: null,
    descriptiveText: 'Enter a valid last name',
    errorMessage: '',
    hasError: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    label: 'Last name',
    isLabelHidden: false,
    name: 'last_name',
    placeholder: 'Baggins',
    rows: 3,
    maxLength: null,
    size: 'small',
    value: null,
    variation: null,
  });
  const FlexPropControls = GetFieldControls({
    typeName: 'Flex',
    fields: flexStyleProps,
  });

  const [
    [alignItems],
    [alignContent],
    [direction],
    [gap],
    [justifyContent],
    [wrap],
  ] = flexStyleProps;

  const {
    autoComplete,
    defaultValue,
    hasError,
    label,
    descriptiveText,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    isLabelHidden,
    placeholder,
    size,
    rows,
    maxLength,
    value,
    name,
    variation,
  } = textFieldProps;

  const code =
    `<TextAreaField` +
    (alignContent
      ? `
  alignContent={${alignContent}}`
      : '') +
    (alignItems
      ? `
    alignItems={${alignItems}}`
      : '') +
    `
  autoComplete="${autoComplete}"
  descriptiveText="${descriptiveText}"` +
    (defaultValue
      ? `
  defaultValue="${defaultValue}"`
      : '') +
    `
  direction="${direction}"` +
    (errorMessage
      ? `
  errorMessage="${errorMessage}"`
      : '') +
    (gap
      ? `
  gap="${gap}"`
      : '') +
    `
  hasError={${hasError}}
  isDisabled={${isDisabled}}
  isReadOnly={${isReadOnly}}
  isRequired={${isRequired}}` +
    (justifyContent
      ? `
  justifyContent={${justifyContent}}`
      : '') +
    `
  label="${label}"
  isLabelHidden={${isLabelHidden}} ` +
    (maxLength
      ? `
  maxLength="${maxLength}"`
      : '') +
    `
  name="${name}"
  placeholder="${placeholder}"` +
    (rows
      ? `
  rows="${rows}"`
      : '') +
    (size
      ? `
  size="${size}"`
      : '') +
    (value
      ? `
  value="${value}"`
      : '') +
    (variation
      ? `
  variation="${variation}"`
      : '') +
    `
  wrap="${wrap}"
  onChange={(e) => console.info(e.currentTarget.value)}
  onInput={(e) => console.info('input fired:', e.currentTarget.value)}
  onCopy={(e) => console.info('onCopy fired:', e.currentTarget.value)}
  onCut={(e) => console.info('onCut fired:', e.currentTarget.value)}
  onPaste={(e) => console.info('onPaste fired:', e.currentTarget.value)}
  onSelect={(e) =>
    console.info(
      'onSelect fired:',
      e.currentTarget.value.substring(
        e.currentTarget.selectionStart,
        e.currentTarget.selectionEnd
      )
    )
  }
/>`;

  return (
    <Demo
      code={code}
      propControls={
        <Flex direction="column">
          <TextAreaFieldPropControls {...textFieldProps} />
          {FlexPropControls}
        </Flex>
      }
    >
      <TextAreaField
        alignContent={alignContent as FlexContainerStyleProps['alignContent']}
        alignItems={alignItems as FlexContainerStyleProps['alignItems']}
        autoComplete={autoComplete as TextAreaFieldProps['autoComplete']}
        descriptiveText={
          descriptiveText as TextAreaFieldProps['descriptiveText']
        }
        defaultValue={defaultValue as TextAreaFieldProps['defaultValue']}
        direction={direction as FlexContainerStyleProps['direction']}
        errorMessage={errorMessage as TextAreaFieldProps['errorMessage']}
        gap={gap as FlexContainerStyleProps['gap']}
        hasError={hasError as unknown as boolean}
        isDisabled={isDisabled as unknown as boolean}
        isReadOnly={isReadOnly as unknown as boolean}
        isRequired={isRequired as unknown as boolean}
        justifyContent={
          justifyContent as FlexContainerStyleProps['justifyContent']
        }
        label={label as TextAreaFieldProps['label']}
        isLabelHidden={isLabelHidden as unknown as boolean}
        maxLength={maxLength as TextAreaFieldProps['maxLength']}
        name={name as TextAreaFieldProps['name']}
        placeholder={placeholder as TextAreaFieldProps['placeholder']}
        rows={rows as TextAreaFieldProps['rows']}
        size={size as TextAreaFieldProps['size']}
        value={value as TextAreaFieldProps['value']}
        variation={variation as TextAreaFieldProps['variation']}
        wrap={wrap as FlexContainerStyleProps['wrap']}
        onChange={(e) => console.info(e.currentTarget.value)}
        onInput={(e) => console.info('input fired:', e.currentTarget.value)}
        onCopy={(e) => console.info('onCopy fired:', e.currentTarget.value)}
        onCut={(e) => console.info('onCut fired:', e.currentTarget.value)}
        onPaste={(e) => console.info('onPaste fired:', e.currentTarget.value)}
        onSelect={(e) =>
          console.info(
            'onSelect fired:',
            e.currentTarget.value.substring(
              e.currentTarget.selectionStart,
              e.currentTarget.selectionEnd
            )
          )
        }
      />
    </Demo>
  );
};

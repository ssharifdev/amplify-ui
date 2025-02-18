import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordField } from '../PasswordField';
import { ComponentClassNames, ComponentText } from '../../shared/constants';

const ariaLabelText = ComponentText.PasswordField;

describe('PasswordField component', () => {
  const testId = 'PasswordFieldTestId';
  it('should render classname for PasswordField', async () => {
    render(
      <PasswordField
        testId={testId}
        label="Password"
        descriptiveText="Required"
        name="password"
        className="custom-class"
      />
    );

    const passwordFieldWrapper = await screen.findByTestId(testId);

    expect(passwordFieldWrapper).toHaveClass('custom-class');
    expect(passwordFieldWrapper).toHaveClass(ComponentClassNames.PasswordField);
  });

  it('should forward refs to DOM elements', async () => {
    const ref = React.createRef<HTMLInputElement>();
    const showPasswordButtonRef = React.createRef<HTMLButtonElement>();
    render(
      <PasswordField
        testId={testId}
        label="Password"
        ref={ref}
        showPasswordButtonRef={showPasswordButtonRef}
      />
    );

    await screen.findByTestId(testId);
    expect(ref.current.nodeName).toBe('INPUT');
    expect(showPasswordButtonRef.current.nodeName).toBe('BUTTON');
  });

  it('should be password input type', async () => {
    render(
      <PasswordField
        label="Password"
        descriptiveText="Required"
        name="password"
        placeholder="Password"
      />
    );

    const passwordField = await screen.findByPlaceholderText('Password');
    expect(passwordField.getAttribute('type')).toBe('password');
  });

  it('should be able to set a size', async () => {
    render(
      <PasswordField
        label="Password"
        descriptiveText="Required"
        name="password"
        hideShowPassword={true}
        placeholder="Password"
        size="large"
      />
    );

    const passwordField = await screen.findByPlaceholderText('Password');
    expect(passwordField.dataset['size']).toBe('large');
  });

  it('should have show password button', async () => {
    render(
      <PasswordField
        label="Password"
        descriptiveText="Required"
        name="password"
      />
    );

    const button = await screen.findByRole('button');
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-label')).toBe(
      ariaLabelText.showPasswordButtonLabel
    );
  });

  it('should be able to hide show password button', async () => {
    render(
      <PasswordField
        label="Password"
        descriptiveText="Required"
        name="password"
        hideShowPassword={true}
      />
    );

    const button = screen.queryByRole('button');
    expect(button).toBeNull();
  });

  describe(' - ShowPasswordButton', () => {
    it('should toggle button type and label when clicked', async () => {
      render(
        <PasswordField
          label="Password"
          descriptiveText="Required"
          name="password"
          placeholder="Password"
        />
      );

      const button = await screen.findByRole('button');
      const passwordField = await screen.findByPlaceholderText('Password');

      expect(passwordField.getAttribute('type')).toBe('password');
      expect(button.getAttribute('aria-label')).toBe(
        ariaLabelText.showPasswordButtonLabel
      );

      userEvent.click(button);

      expect(passwordField.getAttribute('type')).toBe('text');
      expect(button.getAttribute('aria-label')).toBe(
        ariaLabelText.hidePasswordButtonLabel
      );

      userEvent.click(button);

      expect(passwordField.getAttribute('type')).toBe('password');
      expect(button.getAttribute('aria-label')).toBe(
        ariaLabelText.showPasswordButtonLabel
      );
    });
  });

  it('should be able to customize show/hide password button label', async () => {
    const showPasswordButtonLabel = 'Show my password';
    const hidePasswordButtonLabel = 'Hide my password';
    render(
      <PasswordField
        label="Password"
        name="password"
        placeholder="Password"
        showPasswordButtonLabel={showPasswordButtonLabel}
        hidePasswordButtonLabel={hidePasswordButtonLabel}
      />
    );

    const button = await screen.findByRole('button');
    expect(button).toHaveAttribute('aria-label', showPasswordButtonLabel);

    userEvent.click(button);

    expect(button).toHaveAttribute('aria-label', hidePasswordButtonLabel);
  });
});

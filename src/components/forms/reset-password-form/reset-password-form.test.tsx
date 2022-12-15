import { screen, render, userEvent, waitFor } from '@/src/utils/test-utils';

import ResetPasswordForm from './reset-password-form.component';

const testEmail = 'test@email.com';

const renderComponent = ({
  isLoading = false,
  isSubmitDisabled = false,
} = {}) => {
  const handleResetPassword = jest.fn();
  render(
    <ResetPasswordForm
      isLoading={isLoading}
      isSubmitDisabled={isSubmitDisabled}
      handleResetPassword={handleResetPassword}
    />
  );
  return { handleResetPassword };
};

describe('ResetPasswordForm', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('disables button if form is not dirty', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });

  it('disables submit button if isSubmitDisabled is true', async () => {
    renderComponent({ isSubmitDisabled: true });

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      testEmail
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('calls submit handler', async () => {
    const { handleResetPassword } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      testEmail
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    const expected = { email: testEmail };

    await waitFor(() => {
      expect(handleResetPassword).toHaveBeenCalledWith(expected);
    });
  });
});

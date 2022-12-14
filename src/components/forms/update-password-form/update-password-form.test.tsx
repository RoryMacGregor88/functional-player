import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  NO_PASSWORD_MATCH_MESSAGE,
  NEW_PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import UpdatePasswordForm from './update-password-form.component';

const renderComponent = ({ isLoading = false } = {}) => {
  const handleUpdatePassword = jest.fn();
  render(
    <UpdatePasswordForm
      handleUpdatePassword={handleUpdatePassword}
      isLoading={isLoading}
    />
  );
  return { handleUpdatePassword };
};

describe('UpdatePasswordForm', () => {
  it('renders', () => {
    renderComponent();

    expect(
      screen.getByRole('textbox', { name: /current password/i })
    ).toBeInTheDocument();
  });

  it('disables submit button if form is not dirty', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('disables submit button if form is invalid', async () => {
    const { handleUpdatePassword } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /current password/i }),
      'password123'
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
      expect(
        screen.getByText(NEW_PASSWORD_REQUIRED_MESSAGE)
      ).toBeInTheDocument();
      expect(handleUpdatePassword).not.toHaveBeenCalled();
    });
  });

  it('disables submit if new password and confirm do not match', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /current password/i }),
      'password123'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^new password/i }),
      'password456'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^confirm new password/i }),
      'password999'
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
      expect(screen.getByText(NO_PASSWORD_MATCH_MESSAGE)).toBeInTheDocument();
    });
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('enables submit button if form is valid', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /current password/i }),
      'password123'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^new password/i }),
      'password456'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^confirm new password/i }),
      'password456'
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
    });
  });

  it('calls `handleUpdatePassword` if form is valid and submit is clicked', async () => {
    const currentPassword = 'password123',
      newPassword = 'password456',
      confirmNewPassword = 'password456';

    const { handleUpdatePassword } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /current password/i }),
      currentPassword
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^new password/i }),
      newPassword
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^confirm new password/i }),
      newPassword
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const values = { currentPassword, newPassword, confirmNewPassword };
      expect(handleUpdatePassword).toHaveBeenCalledWith(values);
    });
  });
});

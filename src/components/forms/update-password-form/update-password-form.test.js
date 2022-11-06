import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  NO_PASSWORD_MATCH_MESSAGE,
  NEW_PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import UpdatePasswordForm from './update-password-form.component';

describe('UpdatePasswordForm', () => {
  it('renders', () => {
    render(<UpdatePasswordForm />);

    expect(
      screen.getByRole('textbox', { name: /current password/i })
    ).toBeInTheDocument();
  });

  it('disables submit button if form is invalid', async () => {
    const handleUpdatePassword = jest.fn();
    render(<UpdatePasswordForm handleUpdatePassword={handleUpdatePassword} />);

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
    render(<UpdatePasswordForm />);

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

  it('enables submit button if form is valid', async () => {
    render(<UpdatePasswordForm />);

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
      handleUpdatePassword = jest.fn();
    render(<UpdatePasswordForm handleUpdatePassword={handleUpdatePassword} />);

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
      const values = { currentPassword, newPassword };
      expect(handleUpdatePassword).toHaveBeenCalledWith(values);
    });
  });
});

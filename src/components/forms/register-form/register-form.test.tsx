import RegisterForm from './register-form.component';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  USERNAME_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  NO_PASSWORD_MATCH_MESSAGE,
} from '@/src/utils/constants';

const renderComponent = ({
  disableSubmitButton = false,
  disableNextButton = false,
  isLoading = false,
} = {}) => {
  const handleRegister = jest.fn(),
    onNextClick = jest.fn();

  const utils = render(
    <RegisterForm
      handleRegister={handleRegister}
      onNextClick={onNextClick}
      disableSubmitButton={disableSubmitButton}
      disableNextButton={disableNextButton}
      isLoading={isLoading}
    />
  );

  return {
    ...utils,
    handleRegister,
    onNextClick,
  };
};

describe('Register Form', () => {
  it('renders', () => {
    renderComponent();

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('disables submit button if form is not dirty', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });

  it('does not submit if form is invalid', async () => {
    const { handleRegister } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /^email/i }),
      'test@email.com'
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(USERNAME_REQUIRED_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
      expect(
        screen.getByText(/password confirmation is required/i)
      ).toBeInTheDocument();
      expect(handleRegister).not.toHaveBeenCalled();
    });
  });

  it('only allows passwords greater than minimum password length', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /^password/i }),
      'test'
    );

    await waitFor(() => {
      expect(screen.getByText(PASSWORD_MIN_LENGTH_MESSAGE)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  it('only allows matching passwords', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /^username/i }),
      'username'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^email/i }),
      'test@email.com'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^password/i }),
      'testpass'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^confirm password/i }),
      'restpass2'
    );

    await waitFor(() => {
      expect(screen.getByText(NO_PASSWORD_MATCH_MESSAGE)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  it('disables `Submit` button if disabled prop is passed', () => {
    renderComponent({ disableSubmitButton: true });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('disables `Next` button if disabled prop is passed', () => {
    renderComponent({ disableNextButton: true });
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls `onNextClick` if disableNextButton is false', async () => {
    const { onNextClick } = renderComponent();

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeEnabled();
    userEvent.click(nextButton);

    await waitFor(() => {
      expect(onNextClick).toHaveBeenCalled();
    });
  });

  it('calls submit handler if form is valid and button is clicked', async () => {
    const { handleRegister } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /username/i }),
      'test-username'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^password/i }),
      'pass123'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /^confirm password/i }),
      'pass123'
    );

    const expected = {
      email: 'test@email.com',
      username: 'test-username',
      password: 'pass123',
      confirmPassword: 'pass123',
    };

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(submitButton).toBeEnabled();
      userEvent.click(submitButton);
      expect(handleRegister).toHaveBeenCalledWith(expected);
    });
  });
});

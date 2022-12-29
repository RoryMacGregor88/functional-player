import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import LoginForm from './login-form.component';

enableFetchMocks();

const renderComponent = ({ isLoading = false } = {}) => {
  const handleLogin = jest.fn();
  const {
    router: { push },
  } = render(<LoginForm handleLogin={handleLogin} isLoading={isLoading} />, {
    push: jest.fn(),
  });
  return { handleLogin, push };
};

describe('Login Form', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', () => {
    renderComponent();

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('disables submit button if form is not dirty', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });

  it('blocks non-emails in email field', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'not-a-valid-email'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'test-password123'
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
      expect(screen.getByText(EMAIL_INVALID_MESSAGE)).toBeInTheDocument();
    });
  });

  it('disables submit button if form is invalid', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
    });
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });

  it('calls submit handler when form is valid and button is clicked', async () => {
    fetchMock.mockResponse(JSON.stringify({}));

    const { handleLogin } = renderComponent();

    const TEST_EMAIL = 'test@email.com';
    const TEST_PASSWORD = 'testpassword123';

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      TEST_EMAIL
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      TEST_PASSWORD
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
      expect(handleLogin).toHaveBeenCalledWith({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    });
  });

  it('redirects if register link clicked', async () => {
    const { push } = renderComponent();

    userEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/register', {
        forceOptimisticNavigation: false,
      });
    });
  });

  it('redirects if forgot password link clicked', async () => {
    const { push } = renderComponent();

    userEvent.click(screen.getByText(/reset/i));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/reset-password', {
        forceOptimisticNavigation: false,
      });
    });
  });
});

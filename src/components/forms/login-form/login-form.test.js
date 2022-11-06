import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import LoginForm from './login-form.component';

enableFetchMocks();

describe('Login Form', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', () => {
    render(<LoginForm />);

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('blocks non-emails in email field', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'not-a-valid-email'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'test-password123'
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(EMAIL_INVALID_MESSAGE)).toBeInTheDocument();
    });
  });

  it('disables submit button if form is invalid', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

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

  it('calls onSubmit when form is valid and button is clicked', async () => {
    fetchMock.mockResponse(JSON.stringify({}));

    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

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

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    });
  });

  it('redirects if forgot password link clicked', async () => {
    const { router } = render(<LoginForm onSubmit={() => {}} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByText(/click here/i));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(
        '/reset-password',
        '/reset-password',
        { locale: undefined, scroll: undefined, shallow: undefined }
      );
    });
  });
});

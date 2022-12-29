import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

import Register from '@/src/pages/register';

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  PaymentElement: () => <div>MOCK PAYMENT ELEMENT</div>,
  useStripe: () => ({
    test: 'mock stripe',
    confirmPayment: () => ({ error: true }),
  }),
  useElements: () => ({ test: 'mock elements' }),
}));

enableFetchMocks();

let push = null;

describe('Register Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    push = jest.fn();
  });

  it('renders', () => {
    render(<Register />);

    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe/i)).toBeInTheDocument();
    expect(screen.getByText(/finish/i)).toBeInTheDocument();
  });

  it('redirects to dashboard if user found', () => {
    const testUser = { username: 'John smith' };
    const {
      router: { push },
    } = render(<Register user={testUser} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  describe('registration view', () => {
    it('renders well and enables next button', async () => {
      fetchMock.mockResponse(JSON.stringify({ clientSecret: '123' }));

      render(<Register />);

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

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
        expect(
          screen.getByText(REGISTRATION_SUCCESS_MESSAGE)
        ).toBeInTheDocument();
      });
    });

    it('handles server error', async () => {
      const message = 'test-error-message';

      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      render(<Register />);

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

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it('handles client error', async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      const updateCtx = jest.fn();

      render(<Register updateCtx={updateCtx} />);

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

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      const expected = {
        toastData: {
          severity: 'error',
          message: DEFAULT_ERROR_MESSAGE,
        },
      };

      await waitFor(() => {
        expect(updateCtx).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('subscription view', () => {
    it('renders subscription view when next button clicked', async () => {
      fetchMock.mockResponse(JSON.stringify({ clientSecret: '123' }));

      render(<Register />);

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

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeEnabled();
        userEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/mock payment element/i)).toBeInTheDocument();
      });
    });

    it('handles stripe server error', async () => {
      fetchMock.mockResponse(JSON.stringify({ clientSecret: '123' }));

      render(<Register />);

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

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeEnabled();
        userEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/mock payment element/i)).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /submit/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
      });
    });
  });
});

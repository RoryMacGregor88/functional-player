import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import Login from '@/src/pages/login';

enableFetchMocks();

let updateCtx = null;

describe('Login Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    updateCtx = jest.fn();
  });

  it('renders', () => {
    render(<Login user={null} updateCtx={jest.fn()} />);

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('updates state and redirects to dashboard', async () => {
    const resUser = { username: 'John smith' };

    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const {
      router: { push },
    } = render(<Login user={null} updateCtx={updateCtx} />, {
      push: jest.fn(),
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      '123456'
    );

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
    });
  });

  it('handles server error', async () => {
    const message = 'This is an error';

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));
    render(<Login user={null} updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'test@email.com'
    );

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    render(<Login user={null} updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'test@email.com'
    );

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

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

  it('redirects to dashboard if user found', async () => {
    const testUser = { username: 'John smith' };
    const {
      router: { push },
    } = render(<Login user={testUser} updateCtx={updateCtx} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});

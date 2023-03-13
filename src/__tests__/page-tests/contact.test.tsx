import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Contact from '@/src/pages/contact';

import {
  BODY_REQUIRED_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  CONTACT_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

enableFetchMocks();

describe('Contact', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', () => {
    render(<Contact />);

    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('does not submit if form is invalid and submit clicked', async () => {
    render(<Contact />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@email.com'
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(BODY_REQUIRED_MESSAGE)).toBeInTheDocument();
    });
  });

  it('handles server error', async () => {
    fetchMock.mockResponse(
      JSON.stringify({ error: { message: 'test-error-message' } })
    );

    const updateCtx = jest.fn(),
      email = 'test@email.com',
      body = 'Test message body';

    render(<Contact updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      email
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /type here.../i }),
      body
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const updateCtx = jest.fn(),
      email = 'test@email.com',
      body = 'Test message body';

    render(<Contact updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      email
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /type here.../i }),
      body
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    const expected = {
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: 'error',
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('calls submit handler when form is valid and submit clicked', async () => {
    fetchMock.mockResponse(JSON.stringify({ ok: true }));

    const updateCtx = jest.fn(),
      email = 'test@email.com',
      body = 'Test message body';

    render(<Contact updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      email
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /type here.../i }),
      body
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(CONTACT_SUCCESS_MESSAGE)).toBeInTheDocument();
    });
  });
});

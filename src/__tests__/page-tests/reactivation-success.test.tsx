import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  PAGE_CANNOT_BE_ACCESSED_MESSAGE,
  REACTIVATION_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

import ReactivationSuccess from '@/src/pages/reactivation-success';

enableFetchMocks();

let user = null;
let updateCtx = null;

describe('Reactivation Success', () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    user = { username: 'John Smith' };
    updateCtx = jest.fn();
  });

  it('shows success message, sets state, redirects on button click', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    const {
      router: { push },
    } = render(
      <ReactivationSuccess
        user={user}
        updateCtx={updateCtx}
        hasPaymentIntent
      />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(
        screen.getByText(REACTIVATION_SUCCESS_MESSAGE)
      ).toBeInTheDocument();

      expect(updateCtx).toHaveBeenCalledWith({ user });
    });

    userEvent.click(
      screen.getByRole('button', { name: /return to dashboard/i })
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to login if user is not found', () => {
    const {
      router: { push },
    } = render(
      <ReactivationSuccess
        user={null}
        hasPaymentIntent={false}
        updateCtx={updateCtx}
      />,
      {
        push: jest.fn(),
      }
    );

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message: PAGE_CANNOT_BE_ACCESSED_MESSAGE,
      },
    });
  });

  xit('logs out if reactivation error', async () => {
    const message = 'test-error-message';

    // reactivation request
    fetchMock.mockResponseOnce(JSON.stringify({ error: { message } }));

    // logout request
    fetchMock.mockResponseOnce(JSON.stringify({ resUser: null }));

    const {
      router: { push },
    } = render(
      <ReactivationSuccess
        user={user}
        updateCtx={updateCtx}
        hasPaymentIntent
      />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: 'error',
          message,
        },
      });
    });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: 'error',
          message,
        },
      });

      expect(push).toHaveBeenCalledWith('/login');

      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          message: 'You have been successfully logged out.',
        },
      });
    });
  });
});

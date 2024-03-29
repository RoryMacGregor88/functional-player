import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { syncSubscriptionStatus } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

let user = null,
  updateCtx = null;

describe('syncSubscriptionStatus', () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    user = { username: 'John Smith' };
    updateCtx = jest.fn();
  });

  it('calls updateCtx if successful', async () => {
    const user = { username: 'John Smith' };
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    const { ok } = await syncSubscriptionStatus({ user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user });
      expect(ok).toBeTruthy();
    });
  });

  it('handles server error', async () => {
    const message = 'test-error-message';

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const { ok } = await syncSubscriptionStatus({ user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          severity: 'error',
          message,
        },
      });
      expect(ok).toBeFalsy();
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const { ok } = await syncSubscriptionStatus({ user, updateCtx });

    const expected = {
      toastData: {
        severity: 'error',
        message: DEFAULT_ERROR_MESSAGE,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
      expect(ok).toBeFalsy();
    });
  });
});

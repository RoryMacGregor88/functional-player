import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { syncSubscriptionStatus } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

let user = null,
  updateCtx = null;

describe('Reactivation success page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    user = { username: 'John Smith' };
    updateCtx = jest.fn();
  });

  it('calls updateCtx if successful', async () => {
    const user = { username: 'John Smith' };
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    const res = await syncSubscriptionStatus({ user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user });
      expect(res).toBeTruthy();
    });
  });

  //TODO: need to learn how to mock 2 concurrent requests
  it('handles server error', async () => {
    const message = 'test-error-message';

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const res = await syncSubscriptionStatus({ user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: 'error',
          message,
        },
      });
      expect(res).toBeFalsy();
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const res = await syncSubscriptionStatus({ user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: 'error',
          message: DEFAULT_ERROR_MESSAGE,
        },
      });
    });
    expect(res).toBeFalsy();
  });
});

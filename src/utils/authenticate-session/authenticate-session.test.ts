import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { authenticateSession } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

describe('authenticateSession', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('authenticates session', async () => {
    const resUser = { username: 'John Smith' };
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const updateCtx = jest.fn();
    authenticateSession({ updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
    });
  });

  it('returns redirect as `false` by default', async () => {
    const message = 'test-error-message';
    fetchMock.mockResponse(
      JSON.stringify({ redirect: false, error: { message } })
    );

    const updateCtx = jest.fn();
    const redirect = await authenticateSession({ updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: 'error',
          message,
        },
      });
      expect(redirect).toEqual(false);
    });
  });

  it('returns redirect as `true` if returned from server', async () => {
    const resUser = { name: 'John Smith' };
    fetchMock.mockResponse(JSON.stringify({ redirect: true, resUser }));

    const updateCtx = jest.fn();
    const redirect = await authenticateSession({ updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
      expect(redirect).toEqual(true);
    });
  });

  it('handles user null value', async () => {
    const resUser = null;
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const updateCtx = jest.fn();
    authenticateSession({ updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
    });
  });

  it('handles server error', async () => {
    const message = 'test-error-message';
    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const updateCtx = jest.fn();
    authenticateSession({ updateCtx });

    const expected = {
      user: null,
      toastData: {
        severity: 'error',
        message,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const updateCtx = jest.fn();
    authenticateSession({ updateCtx });

    const expected = {
      user: null,
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

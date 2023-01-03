import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import logout from './logout';

enableFetchMocks();

const user = { username: 'John Smith', email: 'email@test.com' };
let updateCtx = null;

describe('logout', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    updateCtx = jest.fn();
  });

  it('logs out', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: null }));

    const { ok } = await logout({ user, updateCtx });

    expect(ok).toBeTruthy();
    expect(updateCtx).toHaveBeenCalledWith({ user: null });
  });

  it('handles error', async () => {
    const message = 'test-error-message';
    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const { ok } = await logout({ user, updateCtx });

    const expected = {
      toastData: {
        message,
        severity: 'error',
      },
    };

    expect(ok).toBeFalsy();
    expect(updateCtx).toHaveBeenCalledWith(expected);
  });

  it('handles http error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const { ok } = await logout({ user, updateCtx });

    const expected = {
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: 'error',
      },
    };

    expect(ok).toBeFalsy();
    expect(updateCtx).toHaveBeenCalledWith(expected);
  });
});

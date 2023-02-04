import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import {
  DEFAULT_ERROR_MESSAGE,
  LOG_OUT_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

import logout from './logout';

enableFetchMocks();

const user = { username: 'John Smith', email: 'email@test.com' };

let updateCtx = null,
  push = null;

describe('logout', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    updateCtx = jest.fn();
    push = jest.fn();
  });

  it('logs out', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: null }));

    await logout({ user, updateCtx, push });

    expect(push).toHaveBeenCalledWith('/login');
    expect(updateCtx).toHaveBeenCalledWith({
      user: null,
      toastData: {
        message: LOG_OUT_SUCCESS_MESSAGE,
      },
    });
  });

  it('handles error', async () => {
    const message = 'test-error-message';
    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    await logout({ user, updateCtx, push });

    const expected = {
      toastData: {
        message,
        severity: 'error',
      },
    };

    expect(updateCtx).toHaveBeenCalledWith(expected);
  });

  it('handles http error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    await logout({ user, updateCtx, push });

    const expected = {
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: 'error',
      },
    };

    expect(updateCtx).toHaveBeenCalledWith(expected);
  });
});

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { updateBookmarks } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

const resUser = { username: 'John Smith' };
let updateCtx = null;

describe('updateBookmarks', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    updateCtx = jest.fn();
  });

  it('adds bookmark', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const _id = '123',
      user = { email: 'email@test.com', bookmarks: [] };

    const expected = {
      user: resUser,
      toastData: {
        message: 'Added to your list',
      },
    };

    updateBookmarks({ _id, user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('removes bookmark', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const _id = '123',
      user = { email: 'email@test.com', bookmarks: [_id, '456'] };

    const expected = {
      user: resUser,
      toastData: {
        message: 'Removed from your list',
      },
    };

    updateBookmarks({ _id, user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('handles server error', async () => {
    const message = 'test-error-message';

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const _id = '123',
      user = { email: 'email@test.com', bookmarks: [_id] };

    const expected = {
      toastData: {
        message,
        severity: 'error',
      },
    };

    updateBookmarks({ _id, user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const _id = '123',
      user = { email: 'email@test.com', bookmarks: [] };

    const expected = {
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: 'error',
      },
    };

    updateBookmarks({ _id, user, updateCtx });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });
});

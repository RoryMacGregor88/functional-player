import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { waitFor } from '@/src/utils/test-utils';

import { updateBookmarks } from '@/src/utils';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

const resUser = { username: 'John Smith' };

describe('updateBookmarks', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('adds bookmark', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const _id = '123',
      user = { email: 'email@test.com', bookmarks: [] },
      updateCtx = jest.fn();

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
      user = { email: 'email@test.com', bookmarks: [_id, '456'] },
      updateCtx = jest.fn();

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
      user = { email: 'email@test.com', bookmarks: [_id] },
      updateCtx = jest.fn();

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
      user = { email: 'email@test.com', bookmarks: [] },
      updateCtx = jest.fn();

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

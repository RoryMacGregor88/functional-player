import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import http from './http';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

let onError = null;

const defaultToastData = {
  toastData: {
    severity: 'error',
    message: DEFAULT_ERROR_MESSAGE,
  },
};

describe('http', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    onError = jest.fn();
  });

  it('makes network request', async () => {
    const message = 'test-response-message';
    fetchMock.mockResponse(JSON.stringify({ testRes: { message } }));

    const res = await http({ endpoint: '/test', onError });

    expect(res).toEqual({ testRes: { message } });
  });

  it.each([401, 404, 400, 500, 501, 502])(
    `handles non-2** responses (%d)`,
    async (status) => {
      const error = { error: { message: 'test-response-message' } };
      fetchMock.mockResponse(JSON.stringify(error), { status });

      const res = await http({ endpoint: '/test', onError });

      expect(res).toEqual({});

      expect(onError).toHaveBeenCalledWith(defaultToastData);
    }
  );

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const res = await http({ endpoint: '/test', onError });

    expect(res).toEqual({});

    expect(onError).toHaveBeenCalledWith(defaultToastData);
  });
});

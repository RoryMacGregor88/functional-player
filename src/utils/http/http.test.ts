import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import http from './http';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

enableFetchMocks();

let onError = null;

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

  it('handles client error', async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const res = await http({ endpoint: '/test', onError });

    expect(res).toEqual({});

    expect(onError).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message: DEFAULT_ERROR_MESSAGE,
      },
    });
  });
});

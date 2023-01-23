import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Contact from '@/src/pages/contact';

enableFetchMocks();

// TODO: tests

describe('Contact', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', () => {});
});

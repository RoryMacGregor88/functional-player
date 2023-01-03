import { createContext } from 'react';

import { renderHook } from '@/src/utils/test-utils';

import useCtx from './use-ctx';

describe('useCtx', () => {
  it('returns context', () => {
    const {
      result: { current },
    } = renderHook(useCtx);

    expect(current).toEqual(current);
  });
});

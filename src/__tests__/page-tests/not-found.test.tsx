import { render } from '@/src/utils/test-utils';

import NotFound from '@/src/pages/[...not-found]';

import { PAGE_DOES_NOT_EXIST_MESSAGE } from '@/src/utils/constants';

describe('Not Found', () => {
  it('redirects to dashboard', () => {
    const updateCtx = jest.fn();
    const {
      router: { push },
    } = render(<NotFound updateCtx={updateCtx} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message: PAGE_DOES_NOT_EXIST_MESSAGE,
      },
    });
  });
});

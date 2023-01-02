import { render } from '@/src/utils/test-utils';

import NotFound from '@/src/pages/[...not-found]';

describe('Not Found', () => {
  it('redirects to dashboard', () => {
    const {
      router: { push },
    } = render(<NotFound />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});

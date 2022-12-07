import { render } from '@/src/utils/test-utils';

import NotFound from '@/src/pages/[...not-found]';

describe('notFound', () => {
  it('redirects to dashboard', () => {
    const { router } = render(<NotFound />, {
      push: jest.fn(),
    });
    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });
});

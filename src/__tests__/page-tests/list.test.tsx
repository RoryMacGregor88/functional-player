import { render, screen } from '@/src/utils/test-utils';

import List from '@/src/pages/list';

jest.mock('@/lib', () => ({
  getCourses: () => {},
}));

describe('list', () => {
  it('renders', () => {
    render(<List user={{ bookmarks: [] }} courses={[]} />);

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('redirects to login if no user found', () => {
    const {
      router: { push },
    } = render(<List />, { push: jest.fn() });

    expect(push).toHaveBeenCalledWith('/login');
  });
});

import { render, screen } from '@/src/utils/test-utils';

import List from '@/src/pages/list';

import { LOGIN_REQUIRED_MESSAGE } from '@/src/utils/constants';

jest.mock('@/lib', () => ({
  getCourses: () => {},
}));

const mockCourses = [
  {
    _id: '123',
    title: 'course-title-1',
    artist: 'John Smith',
    level: 'advanced',
    categories: [],
  },
  {
    _id: '456',
    title: 'course-title-2',
    artist: 'John Smith',
    level: 'advanced',
    categories: [],
  },
];

describe('List', () => {
  it('renders', () => {
    render(<List user={{ bookmarks: ['123'] }} courses={mockCourses} />);

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('shows bookmarks if user has bookmarks', () => {
    render(<List user={{ bookmarks: ['123'] }} courses={mockCourses} />);

    expect(screen.getByText(/course-title-1/i)).toBeInTheDocument();
  });

  it('shows `No Bookmarks` message if user has no bookmarks', () => {
    render(<List user={{ bookmarks: [] }} courses={mockCourses} />);

    expect(
      screen.getByText(/you currently have no saved courses./i)
    ).toBeInTheDocument();
  });

  it('redirects to login if no user found', () => {
    const updateCtx = jest.fn();

    const {
      router: { push },
    } = render(<List updateCtx={updateCtx} ctx={{ toastData: null }} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/login');
    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message: LOGIN_REQUIRED_MESSAGE,
      },
    });
  });

  it('does not call updateCtx if already toastData in state', () => {
    const updateCtx = jest.fn(),
      ctx = { toastData: { message: 'test-toast-data' } };

    const {
      router: { push },
    } = render(<List updateCtx={updateCtx} ctx={ctx} />, { push: jest.fn() });

    expect(push).toHaveBeenCalledWith('/login');
    expect(updateCtx).not.toHaveBeenCalledWith();
  });

  it('handles error', () => {
    const updateCtx = jest.fn(),
      message = 'test-error-message';

    const {
      router: { push },
    } = render(
      <List
        user={{ bookmarks: [] }}
        updateCtx={updateCtx}
        error={{ message }}
      />,
      { push: jest.fn() }
    );

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message,
      },
    });
  });
});

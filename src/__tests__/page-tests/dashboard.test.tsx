import { render, screen, waitFor, userEvent } from '@/src/utils/test-utils';

import Dashboard from '@/src/pages/dashboard';

jest.mock('@/lib', () => ({
  getAllCourses: () => {},
  getAllSeries: () => {},
}));

const mockUser = {
    _id: '123',
    email: 'test@email.com',
    username: 'test-username',
    subscriptionId: '12345',
    bookmarks: [],
    customerId: '12345',
    subscriptionStatus: 'Active',
    lastWatched: '',
  },
  mockCourses = [
    {
      _id: '123',
      creationDate: 1,
      title: 'course-title-1',
      description: 'course-desc-1',
      videoId: '12345',
      artist: 'John Smith',
      level: 'advanced',
      categories: [],
    },
    {
      _id: '456',
      creationDate: 1,
      title: 'course-title-2',
      description: 'course-desc-2',
      videoId: '12345',
      artist: 'John Smith',
      level: 'advanced',
      categories: [],
    },
  ];

describe('dashboard', () => {
  it('renders', () => {
    render(
      <Dashboard
        updateCtx={jest.fn()}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />
    );

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders when no user found', () => {
    render(<Dashboard updateCtx={jest.fn()} courses={mockCourses} />);

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('does not display bookmarks is user has no bookmarks', () => {
    render(
      <Dashboard updateCtx={jest.fn()} user={mockUser} courses={mockCourses} />
    );

    expect(screen.queryByText(/your list/i)).not.toBeInTheDocument();
  });

  it('displays bookmarks if user has bookmarks', () => {
    const user = { ...mockUser, bookmarks: ['123'] };
    render(
      <Dashboard updateCtx={jest.fn()} user={user} courses={mockCourses} />
    );

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('does not show lastWatched if user has no lastWatched', () => {
    render(
      <Dashboard updateCtx={jest.fn()} user={mockUser} courses={mockCourses} />
    );

    expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
  });

  it('shows lastWatched if user has lastWatched', () => {
    const user = { ...mockUser, lastWatched: '123' };
    render(
      <Dashboard updateCtx={jest.fn()} user={user} courses={mockCourses} />
    );

    expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
  });

  it('opens video dialog if video clicked', async () => {
    const updateCtx = jest.fn();
    render(
      <Dashboard updateCtx={jest.fn()} user={mockUser} courses={mockCourses} />,
      { updateCtx }
    );

    userEvent.click(screen.getAllByTestId(/course-title-1/i)[0]);

    await waitFor(() => {
      const expected = { selectedVideo: mockCourses[0] };
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('opens toast if server error', async () => {
    const updateCtx = jest.fn(),
      message = 'test-error-message';

    render(
      <Dashboard updateCtx={updateCtx} user={mockUser} error={{ message }} />
    );

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          severity: 'error',
          message,
        },
      });
    });
  });
});

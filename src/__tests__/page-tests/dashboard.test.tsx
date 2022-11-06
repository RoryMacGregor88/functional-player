import { render, screen, waitFor, userEvent } from '@/src/utils/test-utils';

import Dashboard from '@/src/pages/dashboard';

jest.mock('@/lib', () => ({
  getAllCourses: () => {},
  getAllSeries: () => {},
}));

const mockUser = {
    bookmarks: [],
  },
  mockCourses = [
    {
      _id: '123',
      creationDate: 1,
      title: 'course-title-1',
      description: 'course-desc-1',
    },
  ],
  mockSeries = [
    {
      _id: '123',
      title: 'series-title-1',
      courses: mockCourses,
    },
  ];

describe('dashboard', () => {
  it('renders', () => {
    render(
      <Dashboard user={mockUser} courses={mockCourses} series={mockSeries} />
    );

    const seriesTitle = `${mockSeries[0].title} Series`;
    expect(screen.getByText(seriesTitle)).toBeInTheDocument();
  });

  it('renders when no user found', () => {
    render(<Dashboard user={null} courses={mockCourses} series={mockSeries} />);

    const seriesTitle = `${mockSeries[0].title} Series`;
    expect(screen.getByText(seriesTitle)).toBeInTheDocument();
  });

  it('does not display bookmarks is user has no bookmarks', () => {
    render(
      <Dashboard user={mockUser} courses={mockCourses} series={mockSeries} />
    );

    expect(screen.queryByText(/your list/i)).not.toBeInTheDocument();
  });

  it('displays bookmarks if user has bookmarks', () => {
    const user = { ...mockUser, bookmarks: ['123'] };
    render(<Dashboard user={user} courses={mockCourses} series={mockSeries} />);

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('does not show lastWatched if user has no lastWatched', () => {
    render(
      <Dashboard user={mockUser} courses={mockCourses} series={mockSeries} />
    );

    expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
  });

  it('shows lastWatched if user has lastWatched', () => {
    const user = { ...mockUser, lastWatched: '123' };
    render(<Dashboard user={user} courses={mockCourses} series={mockSeries} />);

    expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
  });

  it('opens video dialog if video clicked', async () => {
    const updateCtx = jest.fn();
    render(
      <Dashboard user={mockUser} courses={mockCourses} series={mockSeries} />,
      { updateCtx }
    );

    userEvent.click(screen.getAllByTestId(/course-title-1/i)[0]);

    await waitFor(() => {
      const expected = { selectedVideo: mockCourses[0] };
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });
});

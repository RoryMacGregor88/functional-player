import { screen, render, userEvent, waitFor } from '@/src/utils/test-utils';

import Slider, { ChevronWrapper } from './slider.component';

const course1 = {
    _id: '123',
    videoId: '456',
    title: 'test-video-title-1',
    description: 'description',
    artist: 'John Smith',
    level: 'advanced',
    creationDate: 'January 1st 2023',
    categories: ['Blues'],
  },
  courses = [
    {
      _id: '123',
      videoId: '456',
      title: 'test-video-title-2',
      description: 'description',
      artist: 'John Smith',
      level: 'advanced',
      creationDate: 'January 1st 2023',
      categories: ['Blues'],
    },
    course1,
  ];

describe('slider', () => {
  it('renders', () => {
    render(<Slider title='test-title' courses={courses} />);

    expect(screen.getByText(/test-title/i)).toBeInTheDocument();
    expect(screen.getByText(/test-video-title-1/i)).toBeInTheDocument();

    expect(screen.getByTestId(/left-chevron/i)).toBeInTheDocument();
    expect(screen.getByTestId(/right-chevron/i)).toBeInTheDocument();
  });

  it('does not render chevrons if only one course', () => {
    render(<Slider title='test-title' courses={[course1]} />);

    expect(screen.queryByTestId(/left-chevron/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/right-chevron/i)).not.toBeInTheDocument();
  });

  it('calls updateCtx if video clicked', async () => {
    const { updateCtx } = render(
      <Slider title='test-title' courses={courses} />,
      { updateCtx: jest.fn() }
    );

    userEvent.click(screen.getByText(/test-video-title-1/i));

    const expected = { selectedVideo: course1 };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  describe('ChevronWrapper', () => {
    it('calls click handler', async () => {
      const handleChevronClick = jest.fn();
      render(
        <ChevronWrapper
          orientation='left'
          handleChevronClick={handleChevronClick}
        >
          <span>Icon</span>
        </ChevronWrapper>
      );

      userEvent.click(screen.getByTestId(/left-chevron/i));

      await waitFor(() => {
        expect(handleChevronClick).toHaveBeenCalled();
      });
    });
  });
});

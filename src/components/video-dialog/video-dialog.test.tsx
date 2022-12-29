import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { screen, render, userEvent, waitFor } from '@/src/utils/test-utils';

import VideoDialog, { Overlay } from './video-dialog.component';

import { BOOKMARK_SUCCESS_REMOVE_MESSAGE } from '@/src/utils/constants';

const selectedVideo = {
    _id: '123',
    videoId: '456',
    title: 'test-video-title-1',
    description: 'description',
    artist: 'John Smith',
    level: 'advanced',
    creationDate: 'January 1st 2023',
    categories: ['Blues'],
  },
  testUser = { username: 'John Smith', bookmarks: ['123'] };

const renderComponent = ({ user = testUser } = {}) => {
  const updateCtx = jest.fn(),
    push = jest.fn();
  render(
    <VideoDialog
      open={true}
      user={user}
      selectedVideo={selectedVideo}
      updateCtx={updateCtx}
    />,
    { updateCtx, push }
  );

  return { updateCtx, push };
};

enableFetchMocks();

describe('VideoDialog', () => {
  it('renders', () => {
    renderComponent();

    expect(screen.getByText(/test-video-title-1/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced/i)).toBeInTheDocument();
  });

  it('closes when icon clicked', async () => {
    const { updateCtx } = renderComponent();

    userEvent.click(screen.getByTestId(/close-icon/i));

    const expected = { selectedVideo: null };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  // TODO: broken
  xit('opens dialog if no user and bookmark icon clicked', async () => {
    const { updateCtx } = renderComponent({ user: null });

    userEvent.click(screen.getByTestId(/bookmark-icon/i));

    const expected = {
      dialogData: {
        title: /welcome to functional player/i,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expect.objectContaining(expected));
    });
  });

  it('updates bookmark if user', async () => {
    const resUser = { userame: 'John Smith' };
    fetchMock.mockResponse(JSON.stringify({ resUser }));
    const { updateCtx } = renderComponent();

    userEvent.click(screen.getByTestId(/bookmark-icon/i));

    const expected = {
      user: resUser,
      toastData: {
        message: BOOKMARK_SUCCESS_REMOVE_MESSAGE,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  describe('Overlay', () => {
    it('', () => {});
  });
});

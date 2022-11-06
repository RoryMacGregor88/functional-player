import { screen, render, userEvent, waitFor } from '@/src/utils/test-utils';

import BookmarkIconButton from './bookmark-icon-button.component';

describe('BookmarkIconButton', () => {
  it('renders', () => {
    render(
      <BookmarkIconButton isBookmarked={false} onBookmarkClick={() => {}} />
    );

    expect(screen.getByText(/add to list/i)).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-icon')).toBeInTheDocument();
  });

  it('renders different state `isBookmarked` is true', () => {
    render(
      <BookmarkIconButton isBookmarked={true} onBookmarkClick={() => {}} />
    );

    expect(screen.getByText(/in your list/i)).toBeInTheDocument();
  });

  it('calls handler when button is clicked', async () => {
    const onBookmarkClick = jest.fn();
    render(
      <BookmarkIconButton
        isBookmarked={true}
        onBookmarkClick={onBookmarkClick}
      />
    );

    userEvent.click(screen.getByTestId('bookmark-icon'));

    await waitFor(() => {
      expect(onBookmarkClick).toHaveBeenCalled();
    });
  });
});

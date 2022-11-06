import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import IconButton from './icon-button.component';

describe('IconButton', () => {
  it('renders', () => {
    render(<IconButton onClick={() => {}}>Test Button</IconButton>);

    expect(screen.getByText(/test button/i)).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<IconButton onClick={onClick}>Test Button</IconButton>);

    userEvent.click(screen.getByRole('button', { name: /test button/i }));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });
});

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Toast from './toast.component';

describe('Toast', () => {
  it('renders', () => {
    const message = 'test-message';
    render(<Toast open message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // TODO: broken because action is broken
  xit('calls updateCtx when clicked', async () => {
    const message = 'test-message',
      updateCtx = jest.fn();
    render(<Toast open message={message} updateCtx={updateCtx} />);

    userEvent.click(screen.getByTestId('close-icon'));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ toastData: null });
    });
  });

  it('calls updateCtx after 4 seconds', async () => {
    const message = 'test-message',
      updateCtx = jest.fn();
    render(<Toast open message={message} updateCtx={updateCtx} />);

    await waitFor(
      () => {
        expect(updateCtx).toHaveBeenCalledWith({ toastData: null });
      },
      { timeout: 5000 }
    );
  });
});

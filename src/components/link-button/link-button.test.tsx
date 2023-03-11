import { screen, render, userEvent, waitFor } from '@/src/utils/test-utils';

import LinkButton from './link-button.component';

const testLabel = 'Test Label';

describe('LinkButton', () => {
  it('renders', () => {
    render(<LinkButton>{testLabel}</LinkButton>);

    expect(screen.getByRole('button', { name: testLabel })).toBeInTheDocument();
  });

  it('calls click handler if provided', async () => {
    const onClick = jest.fn();

    render(<LinkButton onClick={onClick}>{testLabel}</LinkButton>, {
      updateCtx: jest.fn(),
      push: jest.fn(),
    });

    userEvent.click(screen.getByRole('button', { name: testLabel }));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });
});

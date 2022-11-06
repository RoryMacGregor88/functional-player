import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Button from './button.component';

describe('button', () => {
  it('renders', () => {
    render(<Button onClick={() => {}}>Test Button</Button>);

    expect(
      screen.getByRole('button', { name: /test button/i })
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Test Button</Button>);

    userEvent.click(screen.getByRole('button', { name: /test button/i }));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('disables button if disabled prop is true', async () => {
    render(
      <Button onClick={() => {}} disabled={true}>
        Test Button
      </Button>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /test button/i })
      ).toBeDisabled();
    });
  });

  it('disables button if isLoading prop is true', async () => {
    render(
      <Button onClick={() => {}} isLoading={true}>
        Test Button
      </Button>
    );

    const button = screen.getByTestId('loading-spinner').parentElement;

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('shows loading spinner if isLoading prop is true', () => {
    render(
      <Button onClick={() => {}} isLoading={true}>
        Test Button
      </Button>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

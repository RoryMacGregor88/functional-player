import DeleteForm from './delete-form.component';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

const renderComponent = ({ isLoading = false } = {}) => {
  const handleDelete = jest.fn();
  render(<DeleteForm handleDelete={handleDelete} isLoading={isLoading} />);
  return { handleDelete };
};

describe('Delete Form', () => {
  it('renders', () => {
    renderComponent();

    expect(screen.getByText(/enter password to proceed/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /proceed/i })
    ).toBeInTheDocument();
  });

  it('disables submit button if form is not dirty', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /proceed/i })).toBeDisabled();
  });

  it('Shows delete verification button', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'password123'
    );

    userEvent.click(screen.getByRole('button', { name: /proceed/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /permanently delete my account/i })
      ).toBeInTheDocument();
    });
  });

  it('shows loading spinner if isLoading is true', async () => {
    renderComponent({ isLoading: true });

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'password123'
    );

    userEvent.click(screen.getByRole('button', { name: /proceed/i }));

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  it('calls delete handler', async () => {
    const { handleDelete } = renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /password/i }),
      'password123'
    );

    userEvent.click(screen.getByRole('button', { name: /proceed/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /permanently delete my account/i })
      ).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole('button', { name: /permanently delete my account/i })
    );

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalled();
    });
  });
});

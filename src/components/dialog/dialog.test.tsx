import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Dialog from './dialog.component';

const dialogData = { dialogData: null };

const renderComponent = (props = {}) => {
  const updateCtx = jest.fn(),
    onClick = jest.fn(),
    actions = [
      {
        label: 'test action 1',
        onClick,
        closeOnClick: false,
      },
      {
        label: 'test action 2',
        onClick,
        closeOnClick: true,
      },
    ];
  render(
    <Dialog open={true} updateCtx={updateCtx} actions={actions} {...props} />
  );
  return { updateCtx, onClick };
};

describe('dialog', () => {
  it('renders', () => {
    const message = 'test-message';
    renderComponent({ message });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('displays title if present', () => {
    const title = 'test-title';
    renderComponent({ title });

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('closes when close button clicked', async () => {
    const { updateCtx } = renderComponent();

    userEvent.click(screen.getByTestId(/close-icon/i));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(dialogData);
    });
  });

  describe('actions', () => {
    it('renders actions', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: /test action 1/i })
      ).toBeInTheDocument();
    });

    it('calls onClick', async () => {
      const { onClick, updateCtx } = renderComponent();

      userEvent.click(screen.getByRole('button', { name: /test action 1/i }));

      await waitFor(() => {
        expect(onClick).toHaveBeenCalled();
        expect(updateCtx).not.toHaveBeenCalled();
      });
    });

    it('calls close if closeOnClick is true', async () => {
      const { onClick, updateCtx } = renderComponent();

      userEvent.click(screen.getByRole('button', { name: /test action 2/i }));

      await waitFor(() => {
        expect(onClick).toHaveBeenCalled();
        expect(updateCtx).toHaveBeenCalledWith(dialogData);
      });
    });
  });
});

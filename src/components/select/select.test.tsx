import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Select from './select.component';

const options = [{ label: 'Test Option', value: 'test-option' }];

describe('Select', () => {
  it('renders', () => {
    render(<Select options={options} />);

    expect(screen.getByText(/explore by category/i)).toBeInTheDocument();
  });

  it('renders options', async () => {
    render(<Select options={options} />);

    userEvent.click(screen.getByText(/explore by category/i));

    await waitFor(() => {
      expect(screen.getByText(/test option/i)).toBeInTheDocument();
    });
  });

  it('navigates to option link', async () => {
    const {
      router: { push },
    } = render(<Select options={options} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByText(/explore by category/i));

    await waitFor(() => {
      userEvent.click(screen.getByText(/test option/i));
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/categories/?category=test-option');
    });
  });
});

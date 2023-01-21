import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Select from './select.component';

const options = [{ label: 'Test Option', value: 'test-option' }],
  label = 'test-label';

  // TODO: selectedCategory is a prop now, not state
  // but state is in navbar now, make sure tests for both have been updated

describe('Select', () => {
  it('renders', () => {
    render(<Select options={options} label={label} />, {
      ctx: { selectedCategory: null },
    });

    expect(screen.getAllByText(label)).toHaveLength(2);
  });

  it('renders options', async () => {
    render(<Select options={options} label={label} />, {
      ctx: { selectedCategory: null },
    });

    userEvent.click(screen.getAllByText(label)[1]);

    await waitFor(() => {
      expect(screen.getByText(/test option/i)).toBeInTheDocument();
    });
  });

  it('reads selected category from ctx', () => {
    const selectedCategory = 'test-option';

    render(<Select options={options} label={label} />, {
      ctx: { selectedCategory },
    });

    expect(screen.getByText(selectedCategory)).toBeInTheDocument();
  });

  it('updates selected category and navigates to option link', async () => {
    const handleCategoryChange = jest.fn();

    render(
      <Select
        options={options}
        label={label}
        handleCategoryChange={handleCategoryChange}
      />,
      {
        ctx: { selectedCategory: null },
      }
    );

    userEvent.click(screen.getAllByText(label)[1]);

    await waitFor(() => {
      userEvent.click(screen.getByText(/test option/i));
    });

    const expected = {
      selectedCategory: 'test-option',
    };

    await waitFor(() => {
      expect(handleCategoryChange).toHaveBeenCalledWith(expected);
    });
  });
});

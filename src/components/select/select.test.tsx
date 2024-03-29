import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Select from './select.component';

const options = [{ label: 'Test Option', value: 'test-option' }],
  label = 'test-label';

describe('Select', () => {
  it('renders', () => {
    render(<Select options={options} label={label} selectedCategory={null} />);

    expect(screen.getAllByText(label)).toHaveLength(2);
  });

  it('renders options', async () => {
    const handleCategoryChange = jest.fn();

    render(
      <Select
        options={options}
        label={label}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={null}
      />
    );

    userEvent.click(screen.getAllByLabelText(label)[1]);

    await waitFor(() => {
      expect(screen.getByText(/test option/i)).toBeInTheDocument();
    });
  });

  it('reads selected category from ctx', () => {
    const selectedCategory = 'test-option';

    render(
      <Select
        options={options}
        label={label}
        selectedCategory={selectedCategory}
      />
    );

    expect(screen.getByLabelText(/test option/i)).toBeInTheDocument();
  });

  it('updates selected category and navigates to option link', async () => {
    const handleCategoryChange = jest.fn();

    render(
      <Select
        options={options}
        label={label}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={null}
      />
    );

    userEvent.click(screen.getAllByLabelText(label)[1]);

    await waitFor(() => {
      userEvent.click(screen.getByText(/test option/i));
    });

    await waitFor(() => {
      expect(handleCategoryChange).toHaveBeenCalledWith('test-option');
    });
  });
});

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Select from './select.component';

import { DEFAULT_SELECT_OPTION } from '@/src/utils/constants';

const options = [{ label: 'Test Option', value: 'test-option' }];

describe('Select', () => {
  it('renders', () => {
    render(<Select options={options} />, {
      ctx: { selectedCategory: DEFAULT_SELECT_OPTION },
    });

    expect(screen.getByText(/explore by category/i)).toBeInTheDocument();
  });

  it('renders options', async () => {
    render(<Select options={options} />, {
      ctx: { selectedCategory: DEFAULT_SELECT_OPTION },
    });

    userEvent.click(screen.getByText(/explore by category/i));

    await waitFor(() => {
      expect(screen.getByText(/test option/i)).toBeInTheDocument();
    });
  });

  it('reads selected category from ctx', () => {
    const selectedCategory = 'test-option';

    render(<Select options={options} />, {
      ctx: { selectedCategory },
    });

    expect(screen.getByText(/test option/i)).toBeInTheDocument();
  });

  it('updates selected category and navigates to option link', async () => {
    const {
      updateCtx,
      router: { push },
    } = render(<Select options={options} />, {
      ctx: { selectedCategory: DEFAULT_SELECT_OPTION },
      push: jest.fn(),
      updateCtx: jest.fn(),
    });

    userEvent.click(screen.getByText(/explore by category/i));

    await waitFor(() => {
      userEvent.click(screen.getByText(/test option/i));
    });

    const expected = {
      selectedCategory: 'test-option',
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
      expect(push).toHaveBeenCalledWith('/categories/?category=test-option');
    });
  });
});

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import SidebarItem from './sidebar-item.component';

const FakeIcon = (props) => <span {...props}>Fake Icon</span>;

describe('SidebarItem', () => {
  it('renders', () => {
    const label = 'Test Label';
    render(<SidebarItem label={label} Icon={FakeIcon} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('calls onClick when Icon clicked', async () => {
    const label = 'Test Label', // real labels have spaces
      onClick = jest.fn();
    render(<SidebarItem label={label} Icon={FakeIcon} onClick={onClick} />);

    userEvent.click(screen.getByTestId(`${label}-icon`));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('navigates to href when clicked', async () => {
    const label = 'Test Label', // real labels have spaces
      href = '/test-href',
      onClick = jest.fn();

    const {
      router: { push },
    } = render(
      <SidebarItem
        label={label}
        Icon={FakeIcon}
        onClick={onClick}
        href={href}
      />,
      {
        push: jest.fn(),
      }
    );

    userEvent.click(screen.getByTestId(`${label}-icon`));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(href, {
        forceOptimisticNavigation: false,
      });
    });
  });
});

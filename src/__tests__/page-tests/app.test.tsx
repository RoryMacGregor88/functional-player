import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import App from '@/src/pages/_app';

const toastMessage = 'Toast message';
const generalDialogMessage = 'General dialog message';
const videoDialogTitle = 'Video Dialog Title';

const TestComponent = ({ updateCtx }) => {
  const toastData = { message: toastMessage },
    dialogData = { message: generalDialogMessage },
    selectedVideo = {
      title: videoDialogTitle,
      level: 'advanced',
      categories: ['Rock', 'Blues'],
    };
  return (
    <div>
      <p>Test Component</p>
      <button onClick={() => updateCtx({ toastData })}>
        Open Toast Notification
      </button>
      <button onClick={() => updateCtx({ dialogData })}>
        Open General Dialog
      </button>
      <button onClick={() => updateCtx({ selectedVideo })}>
        Open Video Dialog
      </button>
    </div>
  );
};

enableFetchMocks();

describe('App', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders', async () => {
    fetchMock.mockResponse(
      JSON.stringify({ resUser: { username: 'John Smith' } })
    );
    render(<App Component={TestComponent} />);

    await waitFor(() => {
      expect(screen.getByText(/test component/i)).toBeInTheDocument();
    });
  });

  it('shows loadmask if token request has not resolved', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    render(<App Component={TestComponent} />);

    await waitFor(() => {
      expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
      expect(screen.queryByText(/test component/i)).not.toBeInTheDocument();
    });
  });

  it('redirects to login if token has expired', async () => {
    fetchMock.mockResponse(
      JSON.stringify({
        error: { message: 'test-error-message' },
        redirect: true,
      })
    );

    const {
      router: { push },
    } = render(<App Component={TestComponent} />, { push: jest.fn() });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });

  it('renders toast notification', async () => {
    fetchMock.mockResponse(
      JSON.stringify({ resUser: { username: 'John Smith' } })
    );

    render(<App Component={TestComponent} />);

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /open toast notification/i,
      });
      expect(button).toBeInTheDocument();
      userEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(toastMessage)).toBeInTheDocument();
    });
  });

  it('renders general-purpose dialog', async () => {
    fetchMock.mockResponse(
      JSON.stringify({ resUser: { username: 'John Smith' } })
    );

    render(<App Component={TestComponent} />);

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /open general dialog/i,
      });
      expect(button).toBeInTheDocument();
      userEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(generalDialogMessage)).toBeInTheDocument();
    });
  });

  it('renders video dialog', async () => {
    fetchMock.mockResponse(
      JSON.stringify({ resUser: { username: 'John Smith', bookmarks: [] } })
    );

    render(<App Component={TestComponent} />);

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: /open video dialog/i,
      });
      expect(button).toBeInTheDocument();
      userEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(videoDialogTitle)).toBeInTheDocument();
    });
  });
});

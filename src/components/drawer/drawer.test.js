import {
  render,
  screen,
  userEvent,
  waitFor,
  fetchMock,
  enableFetchMocks,
} from "@/src/utils";
import { Drawer } from "@/src/components";

enableFetchMocks();

describe("drawer", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders when prop is true", () => {
    render(<Drawer drawerIsOpen={true} />);
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
  });

  it("does not render when prop is false", () => {
    render(<Drawer drawerIsOpen={false} />);
    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  it("routes to links and closes drawer", async () => {
    const toggleDrawer = jest.fn();
    const { router } = render(
      <Drawer drawerIsOpen={true} toggleDrawer={toggleDrawer} />
    );

    userEvent.click(screen.getByRole("link", { name: /login/i }));

    // TODO: this is weird, why 2 hrefs? And what are those options?
    await waitFor(() => {
      expect(toggleDrawer).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith("/login", "/login", {
        locale: undefined,
        scroll: undefined,
        shallow: undefined,
      });
    });
  });

  it("shows logged in icons", () => {
    render(<Drawer drawerIsOpen={true} user={{ username: "John Smith" }} />);

    expect(screen.getByRole("link", { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i })
    ).not.toBeInTheDocument();
  });

  it("shows logged out icons", () => {
    render(<Drawer drawerIsOpen={true} user={null} />);

    expect(
      screen.queryByRole("link", { name: /logout/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  it("logs user out", async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: {} }));
    const toggleDrawer = jest.fn();

    const { updateCtx } = render(
      <Drawer
        drawerIsOpen={true}
        toggleDrawer={toggleDrawer}
        user={{ username: "John Smith" }}
      />
    );

    userEvent.click(screen.getByRole("link", { name: /logout/i }));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: null });
      expect(toggleDrawer).toHaveBeenCalled();
    });
  });

  it("handler error", async () => {
    const message = "test error message";

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));
    const toggleDrawer = jest.fn();

    const { updateCtx } = render(
      <Drawer
        drawerIsOpen={true}
        toggleDrawer={toggleDrawer}
        user={{ username: "John Smith" }}
      />
    );

    userEvent.click(screen.getByRole("link", { name: /logout/i }));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          message,
          severity: "error",
        },
      });
      expect(toggleDrawer).toHaveBeenCalled();
    });
  });
});

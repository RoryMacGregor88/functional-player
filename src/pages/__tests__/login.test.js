import {
  render,
  screen,
  userEvent,
  waitFor,
  fetchMock,
  enableFetchMocks,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

import Login from "@/src/pages/login";

enableFetchMocks();

describe("Login Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<Login />);

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("updates state and redirects to dashboard", async () => {
    const updateCtx = jest.fn();
    const resUser = { username: "John smith" };

    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const { router } = render(<Login updateCtx={updateCtx} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      "123456"
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/dashboard");
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
    });
  });

  it("handles server error", async () => {
    const message = "This is an error";

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));
    render(<Login />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      "test@email.com"
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it("handles client error", async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    render(<Login />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      "test@email.com"
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeEnabled();

    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("redirects to dashboard if user found", async () => {
    const testUser = { username: "John smith" };
    const { router } = render(<Login user={testUser} />);

    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});

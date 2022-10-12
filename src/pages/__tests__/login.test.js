import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import Login from "../login";
import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

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

  it("shows application error well if credentials are invalid", async () => {
    fetchMock.mockResponse(JSON.stringify({ error: "This is an error" }));
    render(<Login />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@emaiil.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      "test@emaiil.com"
    );

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeEnabled();

    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("This is an error")).toBeInTheDocument();
    });
  });

  it("shows server error well if there is a server error", async () => {
    fetchMock.mockResponse(new Error());
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

    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("redirects to dashboard if credentials are valid", async () => {
    const updateCtx = jest.fn();
    const testUser = { username: "John smith" };

    fetchMock.mockResponse(JSON.stringify({ ok: true, user: testUser }));

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

    await userEvent.click(button);

    expect(router.push).toHaveBeenCalledWith("/dashboard");
    expect(updateCtx).toHaveBeenCalledWith({ user: testUser });
  });

  it("redirects to dashboard if user present", async () => {
    const testUser = { username: "John smith" };
    const { router } = render(<Login user={testUser} />);

    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});

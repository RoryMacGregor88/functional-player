import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import {
  render,
  screen,
  userEvent,
  waitFor,
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from "@/src/utils";

import Register from "@/src/pages/register";

enableFetchMocks();

let push = null;

describe("Register Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    push = jest.fn();
  });

  it("renders", () => {
    render(<Register />);

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe/i)).toBeInTheDocument();
    expect(screen.getByText(/finish/i)).toBeInTheDocument();
  });

  it("renders well and enables button", async () => {
    fetchMock.mockResponse(JSON.stringify({ clientSecret: "123" }));

    render(<Register />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-username"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "pass123"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "pass123"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
      expect(
        screen.getByText(REGISTRATION_SUCCESS_MESSAGE)
      ).toBeInTheDocument();
    });
  });

  it("handles server error", async () => {
    const message = "test-error-message";

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    render(<Register />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-username"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "pass123"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "pass123"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it("handles client error", async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    render(<Register />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-username"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "pass123"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "pass123"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("redirects to dashboard if user found", () => {
    const testUser = { username: "John smith" };
    const { router } = render(<Register user={testUser} />, {
      push: jest.fn(),
    });

    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});

import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import Register from "../register";
import {
  DEFAULT_ERROR_MESSAGE,
  REGISTRATION_SUCCESS_MESSAGE,
} from "@/src/utils";

enableFetchMocks();

describe("Register Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<Register />);

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe/i)).toBeInTheDocument();
    expect(screen.getByText(/finish/i)).toBeInTheDocument();
  });

  it("enables Next button page if register form is submitted", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
    });
  });

  it("shows success well if registration successful", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(REGISTRATION_SUCCESS_MESSAGE)
      ).toBeInTheDocument();
    });
  });

  it("shows error well if submission unsuccessful", async () => {
    fetchMock.mockResponse(JSON.stringify({ error: "I am an error" }));

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

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("I am an error")).toBeInTheDocument();
    });
  });

  it("shows error well if submission returns error", async () => {
    fetchMock.mockResponse(new Error());

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

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("redirects to dashboard if user present", () => {
    const testUser = { username: "John smith" };
    const { router } = render(<Register user={testUser} />);

    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});

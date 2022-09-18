import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import Register from "../register";

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

  // TODO: not sure how to test this
  xit("redirects to dashboard if user present", () => {});

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
        screen.getByText(
          'Account successfully created. Click "NEXT" button to continue.'
        )
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
      expect(
        screen.getByText("An unexpected error has occurred")
      ).toBeInTheDocument();
    });
  });
});

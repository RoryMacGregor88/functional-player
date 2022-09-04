import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import Login from "../login";

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

  it("shows server error well is there is a server error", async () => {
    fetchMock.mockResponse(new Error());
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
      expect(
        screen.getByText("An unexpected error has occurred")
      ).toBeInTheDocument();
    });
  });

  // TODO: not sure how to test this
  it("redirects to dashboard if credentials are valid", () => {});

    // TODO: Or this
    it("redirects to dashboard if user present", () => {});
});

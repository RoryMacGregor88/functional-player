import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import Account from "../account";
import {
  DEFAULT_ERROR_MESSAGE,
  PASSWORD_UPDATE_SUCCESS_MESSAGE,
} from "@/src/utils";

enableFetchMocks();

describe("Account Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<Account user={{ username: "test-username" }} />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("redirects to login if no user present", () => {
    const { router } = render(<Account user={null} />);

    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("switches tabs", async () => {
    render(<Account user={{ subscriptionStatus: "active" }} />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole("tab", { name: /my subscription/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /cancel subscription/i })
      ).toBeInTheDocument();
    });
  });

  it("shows well when requests are successful", async () => {
    fetchMock.mockResponse(JSON.stringify({ ok: true }));

    const {} = render(<Account user={{ username: "John Smith" }} />);

    userEvent.click(screen.getByRole("tab", { name: /update password/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /current password/i })
      ).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /current password/i }),
      "oldpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /^new password/i }),
      "newpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /confirm new password/i }),
      "newpassword"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(PASSWORD_UPDATE_SUCCESS_MESSAGE)
      ).toBeInTheDocument();
    });
  });

  it("shows well when requests are unsuccessful", async () => {
    fetchMock.mockResponse(new Error());

    render(<Account user={{ username: "John Smith" }} />);

    userEvent.click(screen.getByRole("tab", { name: /update password/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /current password/i })
      ).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /current password/i }),
      "oldpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /^new password/i }),
      "newpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /confirm new password/i }),
      "newpassword"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("closes well when tab switched", async () => {
    fetchMock.mockResponse(new Error());

    render(<Account user={{ subscriptionStatus: "active" }} />);

    userEvent.click(screen.getByRole("tab", { name: /update password/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /current password/i })
      ).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /current password/i }),
      "oldpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /^new password/i }),
      "newpassword"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /confirm new password/i }),
      "newpassword"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole("tab", { name: /my subscription/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /cancel subscription/i })
      ).toBeInTheDocument();
      expect(screen.queryByText(DEFAULT_ERROR_MESSAGE)).not.toBeInTheDocument();
    });
  });

  //TODO: remove update email? It's maybe too much hassle to allow (stripe)
  it("email success", () => {});
  it("email server error", () => {});
  it("email client error", () => {});

  it("password success", () => {});
  it("password server error", () => {});
  it("password client error", () => {});

  // stripe testing?

  it("delete success", () => {});
  it("delete server error", () => {});
  it("delete client error", () => {});
});

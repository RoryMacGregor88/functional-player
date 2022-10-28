import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from "@/src/utils";

let json = null,
  status = null;

let destroy = null;

import { logout } from "@/src/pages/api/auth/logout";

jest.mock("@/lib", () => ({
  logServerError: () => {},
  handleForbidden: (res, message) =>
    res.status(403).json({ error: { message } }),
  handleServerError: (res) =>
    res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } }),
}));

describe("logout endpoint", () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });

    // throw database error
    destroy = jest.fn().mockImplementation(() => {
      throw new Error();
    });
  });

  it("handles http method forbidden", async () => {
    const req = { method: "GET" },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it("handles token forbidden", async () => {
    const email = "test@email.com";

    const req = {
        method: "POST",
        body: { email },
        session: {},
      },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: TOKEN_ERROR_MESSAGE },
    });
  });

  it("handles error", async () => {
    const email = "test@email.com";

    const req = {
        method: "POST",
        session: { user: { email }, destroy },
        body: { email },
      },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});

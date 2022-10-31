import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from "@/src/utils";

let json = null,
  status = null;

let destroy = null;

import logout from "@/src/pages/api/auth/logout";

jest.mock("iron-session/next", () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock("@/lib", () => ({
  logServerError: jest.fn().mockImplementation((str, err) => {}),
  handleForbidden: jest
    .fn()
    .mockImplementation((res, message) =>
      res.status(403).json({ error: { message } })
    ),
  handleServerError: jest
    .fn()
    .mockImplementation((res) =>
      res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } })
    ),
}));

describe("logout endpoint", () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });

    // mock database error
    destroy = jest.fn().mockImplementation(() => {
      throw new Error("test-server-error");
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
    const req = {
        method: "POST",
        body: { email: "test@email.com" },
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
    const email = "test@email.com",
      req = {
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

import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
} from "@/src/utils";

import resetPassword from "@/src/pages/api/auth/reset-password";

let json = null,
  status = null;

jest.mock("iron-session/next", () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock("@/lib", () => ({
  connectToDatabase: jest.fn().mockImplementation(() => {
    throw new Error("test-server-error");
  }),
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

describe("resetPassword endpoint", () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it("handles http method forbidden", async () => {
    const req = { method: "GET" },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it("handles error", async () => {
    const email = "test@email.com";

    const req = {
        method: "POST",
        session: { user: { email } },
        body: { email },
      },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});

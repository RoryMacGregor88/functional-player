import { DEFAULT_ERROR_MESSAGE, HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

import login from "@/src/pages/api/auth/login";

let json = null,
  status = null;

let findOne = null,
  collection = null;

jest.mock("@/lib", () => ({
  logServerError: () => {},
  connectToDatabase: () => ({ db: { collection } }),
  handleForbidden: (res, message) => {
    return res.status(403).json({ error: { message } });
  },
  handleServerError: (res) => {
    return res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } });
  },
}));

jest.mock("iron-session/next", () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

describe("login endpoint", () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });

    // throw database error
    findOne = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    collection = jest.fn().mockReturnValue({ findOne });
  });

  it("handles http method forbidden", async () => {
    const req = { method: "GET" },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it("handles error", async () => {
    const req = {
        method: "POST",
        body: { email: "test@email.com", password: "123" },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});

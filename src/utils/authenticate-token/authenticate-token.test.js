import {
  waitFor,
  fetchMock,
  enableFetchMocks,
  authenticateToken,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

enableFetchMocks();

describe("authenticateToken", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("authenticates token", async () => {
    const resUser = { userName: "John Smith" };
    fetchMock.mockResponse(JSON.stringify({ resUser }));

    const updateCtx = jest.fn();
    authenticateToken(updateCtx);

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
    });
  });

  it("handles server error", async () => {
    const message = "test-error-message";
    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const updateCtx = jest.fn();
    authenticateToken(updateCtx);

    const expected = {
      user: null,
      toastData: {
        severity: "error",
        message,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it("handler client error", async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const updateCtx = jest.fn();
    authenticateToken(updateCtx);

    const expected = {
      user: null,
      toastData: {
        severity: "error",
        message: DEFAULT_ERROR_MESSAGE,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });
});

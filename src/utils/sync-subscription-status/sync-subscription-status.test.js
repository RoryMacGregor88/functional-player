import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import {
  syncSubscriptionStatus,
  waitFor,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

enableFetchMocks();

let user = null,
  callback = null,
  stateSetter = null;

describe("Reactivation success page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    user = { username: "John Smith" };
    callback = jest.fn();
    stateSetter = jest.fn();
  });

  it("calls callback and state setter if successful", async () => {
    const user = { username: "John Smith" };
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    await syncSubscriptionStatus(user, callback, stateSetter);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({ user });
      expect(stateSetter).toHaveBeenCalledWith(true);
    });
  });

  it("does not call state setter not found", async () => {
    const user = { username: "John Smith" };
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    await syncSubscriptionStatus(user, callback);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({ user });
      expect(stateSetter).not.toHaveBeenCalled();
    });
  });

  //TODO: need to learn how to mock 2 concurrent requests
  xit("handles server error", async () => {
    const message = "test-error-message";

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    await syncSubscriptionStatus(user, callback, stateSetter);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: "error",
          message,
        },
      });
      expect(stateSetter).toHaveBeenCalledWith(true);
    });
  });

  it("handles client error", async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    await syncSubscriptionStatus(user, callback, stateSetter);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        user: null,
        toastData: {
          severity: "error",
          message: DEFAULT_ERROR_MESSAGE,
        },
      });
    });
  });
});

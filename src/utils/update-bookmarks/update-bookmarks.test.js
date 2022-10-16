import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { updateBookmarks, DEFAULT_ERROR_MESSAGE } from "@/src/utils";
import { waitFor } from "@testing-library/react";

enableFetchMocks();

describe("updateBookmarks", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("adds bookmark", async () => {
    fetchMock.mockResponse(JSON.stringify({ ok: true }));

    const _id = "123",
      user = { email: "email@test.com", bookmarks: [] },
      callback = jest.fn();

    const expected = {
      user: { ...user, bookmarks: ["123"] },
      toastData: {
        message: "Added to your list",
      },
    };

    updateBookmarks(_id, user, callback);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(expected);
    });
  });

  it("removes bookmark", async () => {
    fetchMock.mockResponse(JSON.stringify({ ok: true }));

    const _id = "123",
      user = { email: "email@test.com", bookmarks: [_id, "456"] },
      callback = jest.fn();

    const expected = {
      user: { ...user, bookmarks: ["456"] },
      toastData: {
        message: "Removed from your list",
      },
    };

    updateBookmarks(_id, user, callback);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(expected);
    });
  });

  it("handles error", async () => {
    fetchMock.mockResponse(() => {
      throw new Error();
    });

    const _id = "123";
    const user = { email: "email@test.com", bookmarks: [] };
    const callback = jest.fn();

    const expected = {
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: "error",
      },
    };

    updateBookmarks(_id, user, callback);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(expected);
    });
  });
});

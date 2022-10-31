import { syncStripeAndDb } from "@/src/utils";

let db = null,
  findOneAndUpdate = null,
  collection = null;

const email = "test@email.com";

jest.mock("stripe", () =>
  jest.fn().mockImplementation(() => ({
    subscriptions: {
      retrieve: jest.fn().mockImplementation((id) => {
        if (id === "error") throw new Error("test-server-error");
        if (id === "active") return { status: "active" };
        if (id === "cancelled") return { status: "cancelled" };
      }),
    },
  }))
);

describe("syncStripeAndDb", () => {
  beforeEach(() => {
    findOneAndUpdate = jest.fn();
    collection = jest.fn().mockReturnValue({ findOneAndUpdate });
    db = { collection };
  });

  it("returns original value if current status is null", async () => {
    const result = await syncStripeAndDb(db, email, null, "active");
    expect(result).toEqual({ subscriptionStatus: null });
  });

  it("updates db and returns new value if out of sync", async () => {
    const result = await syncStripeAndDb(db, email, "active", "cancelled");

    expect(collection).toHaveBeenCalledWith("users-2");
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { email },
      { $set: { subscriptionStatus: "cancelled" } }
    );

    expect(result).toEqual({ subscriptionStatus: "cancelled" });
  });

  it("returns original value if in sync but unchanged", async () => {
    const result = await syncStripeAndDb(db, email, "active", "active");
    expect(result).toEqual({ subscriptionStatus: "active" });
  });

  it("handles error", async () => {
    const result = await syncStripeAndDb(db, email, "active", "error");
    expect(result).toEqual({ error: true });
  });
});

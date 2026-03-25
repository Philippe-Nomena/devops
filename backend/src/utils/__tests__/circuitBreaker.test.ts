import { CircuitBreaker } from "../circuitBreaker";

describe("CircuitBreaker", () => {
  it("executes function normally when closed", async () => {
    const cb = new CircuitBreaker();
    const result = await cb.execute(async () => "ok");
    expect(result).toBe("ok");
  });

  it("opens after threshold failures", async () => {
    const cb = new CircuitBreaker();
    const fail = async () => {
      throw new Error("fail");
    };
    for (let i = 0; i < 3; i++) {
      await cb.execute(fail).catch(() => {});
    }
    await expect(cb.execute(fail)).rejects.toThrow("Circuit breaker OPEN");
  });
});

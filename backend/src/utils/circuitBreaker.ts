export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private readonly threshold = 3;
  private readonly cooldown = 10000;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (
      this.failures >= this.threshold &&
      Date.now() - this.lastFailure < this.cooldown
    ) {
      throw new Error("Circuit breaker OPEN");
    }
    try {
      const res = await fn();
      this.failures = 0;
      return res;
    } catch (e) {
      this.failures++;
      this.lastFailure = Date.now();
      throw e;
    }
  }
}

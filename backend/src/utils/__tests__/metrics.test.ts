import { metrics, getMetrics } from "../metrics";

describe("metrics", () => {
  it("retourne un objet avec les champs attendus", () => {
    const m = getMetrics();
    expect(m).toHaveProperty("avgResponseTime");
    expect(m).toHaveProperty("totalDocuments");
    expect(m).toHaveProperty("requestsCount");
    expect(m).toHaveProperty("dbStatus");
  });

  it("dbStatus est error quand mongoose n'est pas connecté", () => {
    const m = getMetrics();
    expect(m.dbStatus).toBe("error"); // pas de connexion en test
  });

  it("totalDocuments s'incrémente", () => {
    const before = metrics.totalDocuments;
    metrics.totalDocuments++;
    expect(metrics.totalDocuments).toBe(before + 1);
  });
});

import mongoose from "mongoose";

interface Metrics {
  avgResponseTime: number;
  totalDocuments: number;
  requestsCount: number;
}

const _metrics: Metrics = {
  avgResponseTime: 0,
  totalDocuments: 0,
  requestsCount: 0,
};

export const metrics = _metrics;

export function getMetrics() {
  return {
    avgResponseTime: _metrics.avgResponseTime,
    totalDocuments: _metrics.totalDocuments,
    requestsCount: _metrics.requestsCount,
    dbStatus: mongoose.connection.readyState === 1 ? "healthy" : "error",
  };
}

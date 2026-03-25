import { Request, Response } from "express";
import { generateDocumentPDF } from "../utils/pdfGenerator";
import { CircuitBreaker } from "../utils/circuitBreaker";
import { metrics, getMetrics } from "../utils/metrics";
import { Document } from "../models/Document";

const breaker = new CircuitBreaker();

export const generateDocument = async (req: Request, res: Response) => {
  const start = Date.now();
  try {
    const { type } = req.body;
    const userId = (req as any).user.userId; // extrait du JWT

    if (!["cerfa", "convention"].includes(type))
      return res.status(400).json({ error: "Type invalide" });

    const pdfBuffer = await breaker.execute(async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await new Promise((r) => setTimeout(r, 80));
          if (Math.random() < 0.08) throw new Error("DocuSign simulé down");
          return await generateDocumentPDF(userId, type);
        } catch (e) {
          if (i === 2) throw e;
          await new Promise((r) => setTimeout(r, 150 * (i + 1)));
        }
      }
      throw new Error("Échec après retry");
    });

    metrics.totalDocuments++;
    metrics.avgResponseTime =
      (metrics.avgResponseTime * metrics.requestsCount + (Date.now() - start)) /
      (metrics.requestsCount + 1);
    metrics.requestsCount++;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${type}-${Date.now()}.pdf"`,
    );
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const docs = await Document.find(
      { userId },
      { pdfData: 0 }, // exclure le binaire de la liste
    ).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const metricsHandler = async (_req: Request, res: Response) => {
  res.json(getMetrics());
};

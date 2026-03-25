import { Router } from "express";
import {
  generateDocument,
  getDocuments,
  metricsHandler,
} from "../controllers/document.controller";

const router = Router();
router.post("/generate", generateDocument);
router.get("/", getDocuments);
router.get("/metrics", metricsHandler);
export default router;

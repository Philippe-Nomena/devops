// import { Router } from "express";
// import {
//   deleteDocuments,
//   generateDocument,
//   getDocuments,
//   metricsHandler,
// } from "../controllers/document.controller";

// const router = Router();
// router.post("/generate", generateDocument);
// router.get("/", getDocuments);
// router.get("/metrics", metricsHandler);
// router.delete("/:id", deleteDocuments);
// export default router;

import { Router } from "express";
import {
  generateDocument,
  getDocuments,
  viewDocument,
  deleteDocument,
} from "../controllers/document.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/generate", auth, generateDocument);
router.get("/", auth, getDocuments);
router.get("/:id/view", auth, viewDocument);
router.delete("/:id", auth, deleteDocument);

export default router;

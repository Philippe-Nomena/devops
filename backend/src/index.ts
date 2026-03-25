import express from "express";
import cors from "cors";
import pino from "pino";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { auth } from "./middleware/auth";
import documentRoutes from "./routes/document.routes";
import { User } from "./models/User";
import { getMetrics } from "./utils/metrics";

dotenv.config();
const app = express();
const logger = pino();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost" }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logging structuré
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url });
  next();
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Identifiants invalides" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  return res.json({ token, userId: user._id });
});

app.use("/api/documents", auth, documentRoutes);

// Metrics public
app.get("/metrics", (_req, res) => res.json(getMetrics()));

app.get("/health", (_req, res) =>
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 }),
);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    app.listen(process.env.PORT || 3000, () => console.log("Backend prêt ✅")),
  )
  .catch(console.error);

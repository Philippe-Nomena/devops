// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import rateLimit from "express-rate-limit";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { auth } from "./middleware/auth";
// import documentRoutes from "./routes/document.routes";
// import { User } from "./models/User";
// import { getMetrics } from "./utils/metrics";

// dotenv.config();
// const app = express();

// // ---------------- CORS universel ----------------
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(express.json());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// // ---------------- Login ----------------
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ error: "Identifiants invalides" });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(401).json({ error: "Identifiants invalides" });

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//     expiresIn: "1h",
//   });

//   res.json({ token, userId: user._id });
// });

// // ---------------- Routes documents ----------------
// app.use("/api/documents", auth, documentRoutes);

// // ---------------- Metrics & Health ----------------
// app.get("/metrics", (_req, res) => res.json(getMetrics()));
// app.get("/health", (_req, res) =>
//   res.json({ status: "ok", db: mongoose.connection.readyState === 1 }),
// );

// // ---------------- Connexion MongoDB ----------------
// mongoose
//   .connect(process.env.MONGO_URI!)
//   .then(() =>
//     app.listen(process.env.PORT || 3000, () =>
//       console.log("Backend prêt ✅ sur port", process.env.PORT || 3000),
//     ),
//   )
//   .catch(console.error);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { auth } from "./middleware/auth";
import documentRoutes from "./routes/document.routes";
import { User } from "./models/User";
import { getMetrics } from "./utils/metrics";
import { GridFSBucket } from "mongodb";

dotenv.config();
const app = express();

// ---------------- CORS universel ----------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ---------------- Login ----------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Identifiants invalides" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ token, userId: user._id });
});

// ---------------- Routes documents ----------------
app.use("/api/documents", auth, documentRoutes);

// ---------------- Metrics & Health ----------------
app.get("/metrics", (_req, res) => res.json(getMetrics()));
app.get("/health", (_req, res) =>
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 }),
);

// ---------------- GridFS Bucket ----------------
export let bucket: GridFSBucket;

// ---------------- Connexion MongoDB avec retry ----------------
const connectWithRetry = () => {
  console.log("🔌 Tentative de connexion à MongoDB Atlas...");
  mongoose
    .connect(process.env.MONGO_URI!, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // timeout 5s
      socketTimeoutMS: 45000,
      family: 4,
    })
    .then(() => {
      console.log("✅ Connecté à MongoDB Atlas !");

      // Initialiser GridFS après connexion
      if (!mongoose.connection.db) throw new Error("DB non connectée");
      bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "documents",
      });

      app.listen(process.env.PORT || 3000, () =>
        console.log("Backend prêt ✅ sur port", process.env.PORT || 3000),
      );
    })
    .catch((err) => {
      console.error("❌ Erreur de connexion MongoDB:", err.message);
      console.log("🔁 Nouvelle tentative dans 5 secondes...");
      setTimeout(connectWithRetry, 5000); // retry auto
    });
};

connectWithRetry();

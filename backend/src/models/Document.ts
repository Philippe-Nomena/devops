import mongoose from "mongoose";
import Buffer from "buffer";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["cerfa", "convention"] },
  pdfData: Buffer,
  qrCode: String,
  metadata: Object,
  signatureStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Document = mongoose.model("Document", documentSchema);

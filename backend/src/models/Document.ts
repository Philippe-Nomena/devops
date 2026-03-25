import mongoose, { Schema, Document as MDocument } from "mongoose";

// Interface TypeScript
export interface IDocument extends MDocument {
  userId: mongoose.Types.ObjectId;
  type: "cerfa" | "convention";
  createdAt: Date;
  signatureStatus: string;
  fileId: mongoose.Types.ObjectId; // <-- ObjectId pour GridFS
  metadata?: any;
}

// Schéma Mongoose
const DocumentSchema = new Schema<IDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  type: { type: String, enum: ["cerfa", "convention"], required: true },
  createdAt: { type: Date, default: Date.now },
  signatureStatus: { type: String, default: "pending" },
  fileId: { type: Schema.Types.ObjectId, required: true }, // <-- ObjectId pour GridFS
  metadata: { type: Schema.Types.Mixed },
});

// Export du modèle
export const Document = mongoose.model<IDocument>("Document", DocumentSchema);

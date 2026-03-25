import { Request, Response } from "express";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId as MongoObjectId } from "mongodb";
import { Document as DocumentModel, IDocument } from "../models/Document";
import { generateDocumentPDF } from "../utils/pdfGenerator";
import dotenv from "dotenv";
dotenv.config();
// Initialisation du bucket GridFS après connexion Mongoose
let bucket: GridFSBucket;
mongoose.connection.once("open", () => {
  if (!mongoose.connection.db) throw new Error("DB non connectée");
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "documents",
  });
});

// === Génération d'un document PDF et stockage GridFS ===
export const generateDocument = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    const userId = (req as any).user.userId as mongoose.Types.ObjectId;

    if (!["cerfa", "convention"].includes(type))
      return res.status(400).json({ error: "Type invalide" });

    // Génération du PDF
    const pdfBuffer = await generateDocumentPDF(userId.toString(), type);

    // Stockage dans GridFS
    const uploadStream = bucket.openUploadStream(`${type}-${Date.now()}.pdf`);
    uploadStream.end(pdfBuffer);

    uploadStream.on("finish", async () => {
      const fileId = uploadStream.id as unknown as mongoose.Types.ObjectId;

      // Sauvegarde référence dans MongoDB
      const doc: IDocument = await DocumentModel.create({
        userId,
        type,
        createdAt: new Date(),
        signatureStatus: "pending",
        fileId,
      });

      res.json(doc);
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// === Récupération de tous les documents d'un utilisateur ===
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as mongoose.Types.ObjectId;
    const docs: IDocument[] = await DocumentModel.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// === Affichage d'un PDF (iframe) ===
export const viewDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await DocumentModel.findById(id);
    if (!doc) return res.status(404).json({ error: "Document non trouvé" });

    const downloadStream = bucket.openDownloadStream(doc.fileId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${doc.type}-${doc._id}.pdf"`,
    );
    downloadStream.pipe(res);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// === Suppression d'un document ===
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await DocumentModel.findById(id);
    if (!doc) return res.status(404).json({ error: "Document non trouvé" });

    // Suppression dans GridFS
    await bucket.delete(doc.fileId);

    // Suppression de la référence MongoDB
    await doc.deleteOne();

    res.json({ message: "Document supprimé" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

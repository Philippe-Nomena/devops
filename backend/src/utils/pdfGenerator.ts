import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { Document } from "../models/Document";
import { User } from "../models/User";

export async function generateDocumentPDF(
  userId: string,
  type: "cerfa" | "convention",
): Promise<Buffer> {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  const docId = new mongoose.Types.ObjectId().toString();
  const signatureLink = `https://app.example.com/sign/${docId}`;

  const qrBuffer = await QRCode.toBuffer(signatureLink, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 200,
  });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });
  const buffers: Uint8Array[] = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  doc.fontSize(20).text(type.toUpperCase(), { align: "center" }).moveDown(2);
  doc.fontSize(14).text("Données du titulaire :", { underline: true });
  doc
    .fontSize(12)
    .text(`Nom : ${user.name}`)
    .text(`Email : ${user.email}`)
    .text(`ID : ${user._id}`)
    .moveDown();

  const now = new Date();
  doc
    .text(`Date : ${now.toLocaleString("fr-FR")}`)
    .text(`ID Document : ${docId}`)
    .moveDown(2);

  doc.fontSize(14).text("Signature électronique simulée", { underline: true });
  doc.text("Scannez le QR code :");
  doc.image(qrBuffer, { fit: [200, 200], align: "center" });
  doc.fontSize(10).text(`Lien : ${signatureLink}`, { align: "center" });

  doc
    .fontSize(10)
    .text(
      `Généré avec PDFKit • ${type} • ${now.getFullYear()}`,
      50,
      doc.page.height - 50,
      { align: "center" },
    );

  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));

  // ✅ Concatener tous les chunks Uint8Array en un Buffer Node.js
  const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of buffers) {
    merged.set(b, offset);
    offset += b.length;
  }
  const pdfBuffer = Buffer.from(merged);

  // Sauvegarder dans MongoDB
  await Document.create({
    userId,
    type,
    pdfData: pdfBuffer,
    qrCode: signatureLink,
    metadata: { generatedAt: now, docId, signatureLink },
    signatureStatus: "pending",
  });

  return pdfBuffer;
}

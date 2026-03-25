import { useEffect, useState } from "react";
import { useDocumentStore } from "../store/useDocumentStore";

export default function Dashboard({ token }: { token: string }) {
  const { documents, fetchDocuments } = useDocumentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments(token);
  }, []);

  const generate = async (type: "cerfa" | "convention") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }), // userId extrait du JWT côté backend
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur inconnue");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      fetchDocuments(token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Tableau de bord Documents</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <button onClick={() => generate("cerfa")} disabled={loading}>
          {loading ? "Génération..." : "Générer CERFA"}
        </button>
        <button onClick={() => generate("convention")} disabled={loading}>
          {loading ? "Génération..." : "Générer Convention"}
        </button>
      </div>

      {error && (
        <div
          style={{
            color: "#a32d2d",
            background: "#fcebeb",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        >
          Erreur : {error}
        </div>
      )}

      {previewUrl && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Aperçu PDF</h3>
          <iframe
            src={previewUrl}
            width="100%"
            height="600px"
            title="PDF Preview"
          />
        </div>
      )}

      <h2>Documents générés ({documents.length})</h2>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc: any) => (
            <tr key={doc._id}>
              <td>{doc.type}</td>
              <td>{new Date(doc.createdAt).toLocaleString()}</td>
              <td>{doc.signatureStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

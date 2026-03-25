// import { useEffect, useState } from "react";
// import { useDocumentStore } from "../store/useDocumentStore";
// import BASE_URL from "../url";

// interface DashboardProps {
//   token: string;
//   onLogout: () => void;
// }

// export default function Dashboard({ token, onLogout }: DashboardProps) {
//   const { documents, fetchDocuments } = useDocumentStore();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDocuments(token);
//   }, [token, fetchDocuments]);

//   const generate = async (type: "cerfa" | "convention") => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${BASE_URL}/api/documents/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ type }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Erreur inconnue");
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       setPreviewUrl(url);
//       fetchDocuments(token);
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const badgeColor = (status: string) => {
//     if (status === "signed") return { background: "#e6f4ea", color: "#1e7e34" };
//     if (status === "pending")
//       return { background: "#fff8e1", color: "#b45309" };
//     return { background: "#f0f0f0", color: "#555" };
//   };

//   return (
//     <div
//       style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "Arial" }}
//     >
//       {/* Navbar */}
//       <div
//         style={{
//           background: "#fff",
//           padding: "0 32px",
//           height: "60px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//         }}
//       >
//         <span style={{ fontWeight: 700, fontSize: "18px", color: "#1a1a2e" }}>
//           GestDocs
//         </span>
//         <button
//           onClick={onLogout}
//           style={{
//             padding: "8px 16px",
//             background: "transparent",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "13px",
//             color: "#555",
//           }}
//         >
//           Se déconnecter
//         </button>
//       </div>

//       <div style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
//         {/* Header */}
//         <div style={{ marginBottom: "28px" }}>
//           <h1 style={{ margin: "0 0 4px", color: "#1a1a2e", fontSize: "24px" }}>
//             Tableau de bord
//           </h1>
//           <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
//             Générez et consultez vos documents CERFA et conventions
//           </p>
//         </div>

//         {/* Boutons génération */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "24px",
//             marginBottom: "24px",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
//             Générer un document
//           </h2>
//           <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//             {(["cerfa", "convention"] as const).map((type) => (
//               <button
//                 key={type}
//                 onClick={() => generate(type)}
//                 disabled={loading}
//                 style={{
//                   padding: "12px 24px",
//                   background: loading
//                     ? "#aaa"
//                     : type === "cerfa"
//                       ? "#2563eb"
//                       : "#7c3aed",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   cursor: loading ? "not-allowed" : "pointer",
//                   minWidth: "160px",
//                 }}
//               >
//                 {loading ? "Génération..." : `Générer ${type.toUpperCase()}`}
//               </button>
//             ))}
//           </div>

//           {error && (
//             <div
//               style={{
//                 marginTop: "16px",
//                 background: "#fcebeb",
//                 color: "#a32d2d",
//                 padding: "10px 14px",
//                 borderRadius: "8px",
//                 fontSize: "13px",
//               }}
//             >
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Aperçu PDF */}
//         {previewUrl && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "12px",
//               padding: "24px",
//               marginBottom: "24px",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//             }}
//           >
//             <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
//               Aperçu du document
//             </h2>
//             <iframe
//               src={previewUrl}
//               width="100%"
//               height="600px"
//               title="PDF Preview"
//               style={{ border: "1px solid #eee", borderRadius: "8px" }}
//             />
//           </div>
//         )}

//         {/* Tableau documents */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "24px",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
//             Documents générés
//             <span
//               style={{
//                 marginLeft: "8px",
//                 background: "#e6f1fb",
//                 color: "#185fa5",
//                 fontSize: "12px",
//                 padding: "2px 8px",
//                 borderRadius: "20px",
//                 fontWeight: 500,
//               }}
//             >
//               {documents.length}
//             </span>
//           </h2>

//           {documents.length === 0 ? (
//             <p
//               style={{
//                 color: "#aaa",
//                 textAlign: "center",
//                 padding: "32px 0",
//                 margin: 0,
//               }}
//             >
//               Aucun document généré pour le moment
//             </p>
//           ) : (
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: "14px",
//               }}
//             >
//               <thead>
//                 <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
//                   {["Type", "Date", "Statut"].map((h) => (
//                     <th
//                       key={h}
//                       style={{
//                         textAlign: "left",
//                         padding: "8px 12px",
//                         color: "#888",
//                         fontWeight: 500,
//                         fontSize: "12px",
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.map((doc: any) => (
//                   <tr
//                     key={doc._id}
//                     style={{ borderBottom: "1px solid #f8f8f8" }}
//                   >
//                     <td style={{ padding: "12px" }}>
//                       <span
//                         style={{
//                           background:
//                             doc.type === "cerfa" ? "#e6f1fb" : "#ede9fe",
//                           color: doc.type === "cerfa" ? "#185fa5" : "#5b21b6",
//                           padding: "3px 10px",
//                           borderRadius: "20px",
//                           fontSize: "12px",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {doc.type.toUpperCase()}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px", color: "#555" }}>
//                       {new Date(doc.createdAt).toLocaleString("fr-FR")}
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <span
//                         style={{
//                           ...badgeColor(doc.signatureStatus),
//                           padding: "3px 10px",
//                           borderRadius: "20px",
//                           fontSize: "12px",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {doc.signatureStatus}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useDocumentStore } from "../store/useDocumentStore";
import BASE_URL from "../url";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const { documents, fetchDocuments } = useDocumentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments(token);
  }, [token, fetchDocuments]);

  // Génération d'un document
  const generate = async (type: "cerfa" | "convention") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/documents/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
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

  // Voir un document existant
  const viewDocument = async (docId: string) => {
    console.log(docId);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/documents/${docId}/view`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de récupérer le document");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Supprimer un document
  const deleteDocument = async (docId: string) => {
    console.log(docId);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de supprimer le document");
      fetchDocuments(token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (status: string) => {
    if (status === "signed") return { background: "#e6f4ea", color: "#1e7e34" };
    if (status === "pending")
      return { background: "#fff8e1", color: "#b45309" };
    return { background: "#f0f0f0", color: "#555" };
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "Arial" }}
    >
      {/* Navbar */}
      <div
        style={{
          background: "#fff",
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "18px", color: "#1a1a2e" }}>
          GestDocs
        </span>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#555",
          }}
        >
          Se déconnecter
        </button>
      </div>

      <div style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 4px", color: "#1a1a2e", fontSize: "24px" }}>
            Tableau de bord
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Générez et consultez vos documents CERFA et conventions
          </p>
        </div>

        {/* Boutons génération */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
            Générer un document
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {(["cerfa", "convention"] as const).map((type) => (
              <button
                key={type}
                onClick={() => generate(type)}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: loading
                    ? "#aaa"
                    : type === "cerfa"
                      ? "#2563eb"
                      : "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  minWidth: "160px",
                }}
              >
                {loading ? "Génération..." : `Générer ${type.toUpperCase()}`}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                marginTop: "16px",
                background: "#fcebeb",
                color: "#a32d2d",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Aperçu PDF */}
        {previewUrl && (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
              Aperçu du document
            </h2>
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              title="PDF Preview"
              style={{ border: "1px solid #eee", borderRadius: "8px" }}
            />
          </div>
        )}

        {/* Tableau documents */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", color: "#333" }}>
            Documents générés
            <span
              style={{
                marginLeft: "8px",
                background: "#e6f1fb",
                color: "#185fa5",
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "20px",
                fontWeight: 500,
              }}
            >
              {documents.length}
            </span>
          </h2>

          {documents.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                textAlign: "center",
                padding: "32px 0",
                margin: 0,
              }}
            >
              Aucun document généré pour le moment
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  {["Type", "Date", "Statut", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "#888",
                        fontWeight: 500,
                        fontSize: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: any) => (
                  <tr
                    key={doc._id}
                    style={{ borderBottom: "1px solid #f8f8f8" }}
                  >
                    <td style={{ padding: "12px", fontWeight: 500 }}>
                      {doc.type.toUpperCase()}
                    </td>
                    <td style={{ padding: "12px", color: "#555" }}>
                      {new Date(doc.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          ...badgeColor(doc.signatureStatus),
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {doc.signatureStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

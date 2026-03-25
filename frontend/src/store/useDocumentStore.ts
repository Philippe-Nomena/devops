import { create } from "zustand";
import BASE_URL from "../url";

interface Document {
  _id: string;
  type: string;
  createdAt: string;
  signatureStatus: string;
}

interface Store {
  documents: Document[];
  addDocument: (doc: Document) => void;
  fetchDocuments: (token: string) => Promise<void>;
}

export const useDocumentStore = create<Store>((set) => ({
  documents: [],
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
  fetchDocuments: async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      set({ documents: data });
    } catch (e) {
      console.error("Erreur fetchDocuments", e);
    }
  },
}));

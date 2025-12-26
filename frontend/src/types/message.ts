export interface Source {
  pdf: string;
  article?: number;
  relevance: number;
  preview?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[]; // ✅ Add this
  createdAt: number;
}
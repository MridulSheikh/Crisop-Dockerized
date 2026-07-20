export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  status: "pending" | "complete" | "error";
  createdAt: string;
}

export interface ChatbotApiMessageLike {
  _id?: string;
  id?: string;
  role?: ChatMessageRole;
  content?: string;
  createdAt?: string;
}

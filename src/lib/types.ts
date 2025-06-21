import type { Timestamp } from "firebase/firestore";

export interface Event {
  id: string;
  title: string;
  description: string;
  address: string;
  date: string; // ISO 8601 string
  tags: string[];
  imageUrl?: string;
  userId?: string;
  createdAt?: Timestamp;
  "data-ai-hint"?: string;
}

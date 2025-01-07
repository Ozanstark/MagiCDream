export type DeletionType = "never" | "on_view" | "timed";

export interface EncryptedPhoto {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: DeletionType;
  deletion_time: string | null;
  decryption_count: number | null;
  user_id: string | null;
}
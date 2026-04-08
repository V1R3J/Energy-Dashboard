import { databases, storage, ID, DATABASE_ID, BUCKET_ID } from '../appwrite';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// ── UPLOAD image to bucket + save metadata to DB ──────────────────────────────
export const uploadImage = async (file: File) => {
  const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);

  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      name: file.name,
      fileId: uploaded.$id,
      uploadedAt: new Date().toISOString(),
    }
  );

  return doc;
};

// ── GET all images (metadata from DB) ─────────────────────────────────────────
export const getImages = async () => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
  return res.documents;
};

// ── GET single image metadata ──────────────────────────────────────────────────
export const getImage = async (documentId: string) => {
  const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
  return doc;
};

// ── GET image preview URL (for rendering in <img>) ────────────────────────────
export const getImagePreviewUrl = (fileId: string): string => {
  return storage.getFileDownload(BUCKET_ID, fileId).toString();
};

// ── DELETE image from bucket + remove metadata from DB ───────────────────────
export const deleteImage = async (documentId: string, fileId: string) => {
  await storage.deleteFile(BUCKET_ID, fileId);
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
};
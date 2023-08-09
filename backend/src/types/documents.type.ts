export interface Document {
  id: number;
  documentTypeId?: number;
  userId?: number;
  fileName?: string;
  fileType?: string;
  fileStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

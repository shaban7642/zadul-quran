export interface Document {
  id: number;
  documentTypeId?: number;
  userId?: number;
  reportId?: number;
  fileName?: string;
  fileType?: string;
  fileStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

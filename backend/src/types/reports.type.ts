export interface Report {
  id: number;
  userId?: number;
  sessionId?: number;
  date?: Date;
  submissionDate?: Date;
  reportContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

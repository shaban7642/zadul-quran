export interface Session {
  id?: number;
  patchId?: number;
  userId?: number;
  sessionMethod?: string;
  meetingId?: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  id?: number;
  patchId?: number;
  userId?: number;
  sessionTypeId?: number;
  sessionType?: any;
  sessionMethod?: string;
  meetingId?: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  joinedAt?: Date;
  endedAt?: Date;
}

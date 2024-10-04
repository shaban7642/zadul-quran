import { apiService } from "../services/api.service";
import { convertToNormalDate } from "../utils/convert-to-normal-date";
import { generateQuery } from "../utils/generate-query";

class SessionsApi {
  async getSessions(filterObject: {
    limit: number;
    offset: number;
    status?: string;
    teacherId?: number;
    studentId?: number;
    departmentId?: number;
    date?: any;
  }) {
    return new Promise((resolve, reject) => {
      try {
        const {
          limit,
          offset,
          status,
          teacherId,
          studentId,
          departmentId,
          date,
        } = filterObject;

        const queries = {
          limit,
          offset,
          status,
          teacherId,
          studentId,
          departmentId,
          date:
            date &&
            date.from !== null &&
            date.from !== "" &&
            date.to !== null &&
            date.to !== "" &&
            `${convertToNormalDate(date.from, "from")}to${convertToNormalDate(
              date.to
            )}&`,
        };
        const sessions = apiService.get(`/sessions?${generateQuery(queries)}`);

        resolve(sessions);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async getSessionById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const session = apiService.get(`/sessions/${id}`);
        resolve(session);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async getSessionByStudentId(studentId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const session = apiService.get(`/sessions/${studentId}`);
        resolve(session);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async getSessionTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const types = apiService.get(`/sessions/types`);
        resolve(types);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteSession(ids: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/sessions`, { ids });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createSession(sessionData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/sessions/create/", sessionData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateSession(id: number, sessionData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/sessions/${id}`, sessionData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async startMeeting(
    code: string | string[],
    sessionId: string | string[] | undefined
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get(`/sessions/oauth/callback`, {
          code,
          sessionId,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const sessionApi = new SessionsApi();

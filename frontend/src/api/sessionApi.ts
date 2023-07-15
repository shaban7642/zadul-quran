/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class SessionApi {
  async getSessions() {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get("/sessions/");
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async startSession(data: any, cardId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/sessions/start/?id=${cardId}`, data);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async updateSession(data: any, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/sessions/update/?id=${id}`, {
          ...data,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async resetSession(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/sessions/reset/?id=${id}`, {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async endSession(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/sessions/end/?id=${id}`, {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const sessionApi = new SessionApi();

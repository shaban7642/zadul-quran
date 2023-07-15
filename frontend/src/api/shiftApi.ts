/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class ShiftApi {
  async getShifts(limit: number, page: number) {
    return new Promise((resolve, reject) => {
      try {
        const shifts = apiService.get("/shifts/", {
          limit,
          page: ++page,
        });

        resolve(shifts);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async startShift(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/shifts/start/", {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async endShift(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/shifts/end/", {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const shiftApi = new ShiftApi();

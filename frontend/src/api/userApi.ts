/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class UserApi {
  async getUsers(limit: number, page: number) {
    return new Promise((resolve, reject) => {
      try {
        const users = apiService.get("/auth/users/", {
          limit,
          page: ++page,
        });

        resolve(users);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteUsers(usersList?: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete("/auth/users/delete/", {
          users: usersList,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createUser(userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/auth/create/", userData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateUser(id: number, userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/auth/users/update/?id=${id}`, userData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const userApi = new UserApi();
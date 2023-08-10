import { apiService } from "../services/api.service";

class UserApi {
  async getUsers(limit: number, page: number) {
    return new Promise((resolve, reject) => {
      try {
        const users = apiService.get("/user/", {
          limit,
          page: ++page,
        });

        resolve(users);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async getUserById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.get(`/user/${id}`);
        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteUser(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/user/${id}`);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createUser(userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/user/create/", userData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateUser(id: number, userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/user/${id}`, userData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const userApi = new UserApi();

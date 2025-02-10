import { apiService } from "../services/api.service";
import { generateQuery } from "../utils/generate-query";

class UserApi {
  async getUsers(
    limit: any,
    offset: number,
    name?: string,
    name1?: string,
    name2?: string
  ) {
    return new Promise((resolve, reject) => {
      let path = `/user/`;
      const queries = {
        limit,
        offset: offset * limit,
        roleId: name,
      };
      try {
        if (name1 && name) {
          path = `/user/?${generateQuery(
            queries
          )}&roleId=${name1}&roleId=${name2}`;
          const users = apiService.get(path);
          resolve(users);
        } else {
          const users = apiService.get(`/user/?${generateQuery(queries)}`);

          resolve(users);
        }
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async getAllParents() {
    return new Promise((resolve, reject) => {
      try {
        const parents = apiService.get("/user/all/parents");
        resolve(parents);
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
        const resp = apiService.post("/user/create", userData);
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

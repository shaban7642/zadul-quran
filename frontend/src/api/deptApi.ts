import { apiService } from "../services/api.service";
import { generateQuery } from "../utils/generate-query";
class DeptApi {
  async getDepts(limit: number, offset: number) {
    return new Promise((resolve, reject) => {
      const queries = {
        limit,
        offset,
      };
      try {
        const depts = apiService.get(`/department/?${generateQuery(queries)}`);
        resolve(depts);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createDept(deptData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/department/create`, {
          name: deptData,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateDept(id: number, deptData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/department/${id}`, deptData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteDepts(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/department/${id}`);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const deptApi = new DeptApi();

import { apiService } from "../services/api.service";

class DeptApi {
  async getDepts() {
    return new Promise((resolve, reject) => {
      try {
        const depts = apiService.get("/department/");
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
          depts: deptData,
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

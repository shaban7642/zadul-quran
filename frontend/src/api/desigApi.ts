import { apiService } from "../services/api.service";

class DesigApi {
  async getDesigs() {
    return new Promise((resolve, reject) => {
      try {
        const menus = apiService.get("/cafe/category/");
        resolve(menus);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createDesigs(deptData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/cafe/dept/create`, {
          depts: deptData,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateDesig(id: number, deptData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/cafe/dept/update/?id=${id}`, deptData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteDesigs(deptsList?: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete("/cafe/dept/delete/", {
          depts: deptsList,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const desigApi = new DesigApi();

import { apiService } from "../services/api.service";

class ReportApi {
  async getReports(limit: number, page: number) {
    return new Promise((resolve, reject) => {
      try {
        const reports = apiService.get("/reports", {
          limit,
          page: ++page,
        });
        resolve(reports);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createReport(reportData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/reports/create`, reportData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateReport(id: number, reportData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/reports/${id}`, reportData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteReport(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/reports/${id}`);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const reportApi = new ReportApi();

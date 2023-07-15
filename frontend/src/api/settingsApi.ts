/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class SettingsApi {
  async getStoreSettings() {
    return new Promise((resolve, reject) => {
      try {
        const menus = apiService.get("/storesettings/");
        resolve(menus);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async getCategory(id) {
    return new Promise((resolve, reject) => {
      try {
        const category = apiService.get(`/storesettings/get/?id=${id}`);
        resolve(category);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteCategory(catId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(
          `/storesettings/delete/?id=${catId}`,
          {}
        );
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async updateCategory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/storesettings/update/`, data);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createCategory(CategoryData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/storesettings/create/", CategoryData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createSettings(catId: number, settingsData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(
          `/settings/create/?id=${catId}`,
          settingsData
        );
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async deleteSettings(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/settings/delete/?id=${id}`, {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const settingsApi = new SettingsApi();

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class StoreApi {
  async createStore(values) {
    return new Promise((resolve, reject) => {
      try {
        const store = apiService.post("/store/create/", values);

        resolve(store);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const storeApi = new StoreApi();

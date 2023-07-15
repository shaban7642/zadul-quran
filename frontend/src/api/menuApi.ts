/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class MenuApi {
  async getMenus() {
    return new Promise((resolve, reject) => {
      try {
        const menus = apiService.get("/cafe/category/");
        resolve(menus);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async getCategory(id, page, limit) {
    return new Promise((resolve, reject) => {
      try {
        const category = apiService.get(`/cafe/category/get/?id=${id}`, {
          limit,
          page: ++page,
        });
        resolve(category);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteMenu(menuId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(
          `/cafe/category/delete/?id=${menuId}`,
          {}
        );
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createMenu(menuData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/cafe/category/create/", menuData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async createProducts(id: number, productData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/cafe/product/create/?id=${id}`, {
          products: productData,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateProduct(id: number, productData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(
          `/cafe/product/update/?id=${id}`,
          productData
        );
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteProducts(productsList?: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete("/cafe/product/delete/", {
          products: productsList,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const menuApi = new MenuApi();

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class OrderApi {
  async createOrder(ordersData: any, id?: number): Promise<any> {
    let url = `/orders/create/`;
    if (id) {
      url = `/orders/create/?id=${id}`;
    }
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(url, {
          orders: ordersData,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async deleteOrder(orderId: number, productId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/orders/deletefrom/?id=${orderId}`, {
          product_order_id: productId,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const orderApi = new OrderApi();

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class PaymentApi {
  async getPlans() {
    return new Promise((resolve, reject) => {
      try {
        const plans = apiService.get("/plans/");

        resolve(plans);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async initPayment(planId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const url = apiService.post(`/payment/initiate/?id=${planId}`, {});

        resolve(url);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const paymentApi = new PaymentApi();

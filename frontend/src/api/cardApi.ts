/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "../services/api.service";

class CardApi {
  async getCards() {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get("/cards/");
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createCard(cardsTitle: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/cards/create/", {
          title: cardsTitle,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async updateCard(cardsTitle: any, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/cards/update/?id=${id}`, {
          title: cardsTitle,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async deleteCard(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/cards/delete/?id=${id}`, {});
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const cardApi = new CardApi();

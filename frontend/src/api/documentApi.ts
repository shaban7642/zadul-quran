import axios from "axios";
import { apiService } from "../services/api.service";

class DocumentApi {
  async getDocuments(limit: number, page: number, documentType: string) {
    return new Promise((resolve, reject) => {
      try {
        const documents = apiService.get("/documents/", {
          limit,
          page: ++page,
          documentType,
        });
        resolve(documents);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createDocument(
    documentType: string,
    documentData: any,
    userId: number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(documentType);
        const resp = await axios.post(
          `http://localhost:4000/api/documents/upload?data={"documentType": ${documentType}, "userId": ${userId}}`,
          documentData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateDocument(id: number, documentData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/documents/${id}`, documentData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async deleteDocument(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.delete(`/documents/${id}`);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const documentApi = new DocumentApi();

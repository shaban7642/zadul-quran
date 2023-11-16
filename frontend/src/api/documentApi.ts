import axios from "axios";
import { apiService } from "../services/api.service";
import { generateQuery } from "../utils/generate-query";

class DocumentApi {
  async getDocuments(limit: number, offset: number, documentType: string) {
    return new Promise((resolve, reject) => {
      const queries = {
        limit,
        offset,
        documentType,
      };
      try {
        const documents = apiService.get(
          `/documents/?${generateQuery(queries)}`
        );
        resolve(documents);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async createDocument(
    documentType: any,
    documentData: any,
    userId: number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(documentType);
        const resp = await axios.post(
          `http://localhost:4000/api/documents/upload?data={"documentType": ${JSON.stringify(
            documentType
          )}, "userId": ${userId}}`,
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

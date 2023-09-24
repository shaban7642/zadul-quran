import { apiService } from '../services/api.service';

class DocumentApi {
    async getDocuments() {
        return new Promise((resolve, reject) => {
            try {
                const documents = apiService.get('/documents/');
                resolve(documents);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async createDocument(documentData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                console.log({ documentData });
                const resp = apiService.post(
                    `/documents/upload?data={"documentType": {"name": "books", "id": 1}}`,
                    documentData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateDocument(id: number, documentData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.put(`/documents/${id}`, documentData);
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async deleteDocument(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.delete(`/documents/${id}`);
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }
}

export const documentApi = new DocumentApi();

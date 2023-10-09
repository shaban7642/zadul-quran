import { apiService } from '../services/api.service';

class SessionsApi {
    async getSessions(limit: number, page: number) {
        return new Promise((resolve, reject) => {
            try {
                const sessions = apiService.get('/sessions/', {
                    limit,
                    page: ++page,
                });

                resolve(sessions);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async getSessionById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const session = apiService.get(`/sessions/${id}`);
                resolve(session);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async deleteSession(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.delete(`/sessions/${id}`);
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async createSession(sessionData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.post('/sessions/create/', sessionData);
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateSession(id: number, sessionData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.put(`/sessions/${id}`, sessionData);
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }
    async startMeeting(code: string, sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const resp = apiService.get(`/sessions/oauth/callback`, {
                    code,
                    sessionId,
                });
                resolve(resp);
            } catch (err) {
                reject(new Error('Internal server error'));
            }
        });
    }
}

export const sessionApi = new SessionsApi();

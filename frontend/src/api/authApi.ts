import { apiService } from "../services/api.service";

class AuthApi {
  async login({ email, password }: { email: string; password: string }) {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.post("/auth/login", {
          email,
          password,
        });

        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async reAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get("/auth/reAuthorize");

        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get("/auth/logout", {});

        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async changePassword({
    id,
    newPassword,
    confirmNewPassword,
  }: {
    id: number;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.put("/auth/change-password", {
          id,

          newPassword,
          confirmNewPassword,
        });

        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const authApi = new AuthApi();

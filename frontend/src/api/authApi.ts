import { apiService } from "../services/api.service";

class AuthApi {
  async login({ username, password }: { username: string; password: string }) {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.post("/auth/login/", {
          username,
          password,
        });

        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async register({
    username,
    first_name,
    last_name,
    email,
    phone_number,
    password,
  }: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    password: string;
  }) {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.post("/auth/register/", {
          username,
          first_name,
          last_name,
          email,
          phone_number,
          password,
        });
        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async refreshAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get("/auth/refresh/");

        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/auth/logout/", {});

        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.put("/auth/changePassword/", {
          oldPassword,
          newPassword,
        });

        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async forgetPassword({ newPassword }: { newPassword: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const user = apiService.put("/auth/forgetPassword/", {
          newPassword,
        });

        resolve(user);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const authApi = new AuthApi();

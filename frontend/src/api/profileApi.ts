import { apiService } from "../services/api.service";

class ProfileApi {
  async updateProfile(profileData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.put(`/auth/profile/update/`, profileData);
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const profileApi = new ProfileApi();

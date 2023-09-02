import { apiService } from "../services/api.service";

class RolesApi {
  async getRoles() {
    return new Promise((resolve, reject) => {
      try {
        const roles = apiService.get("/settings/all/roles");
        resolve(roles);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async getAllPermissions() {
    return new Promise((resolve, reject) => {
      try {
        const permissions = apiService.get("/settings/all/permissions");
        resolve(permissions);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async getRolePermissions(name: string) {
    return new Promise((resolve, reject) => {
      try {
        const permissions = apiService.get(
          `/settings/all/rolePermissions/?roleId=${name}`
        );
        resolve(permissions);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async addPermissions(ids: number[], roleId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post(`/settings/add/permission/`, {
          permissionIds: ids,
          roleId,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async removePermissions(ids?: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.post("/settings/remove/permission", {
          rolePermissionsIds: ids,
        });
        resolve(resp);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const rolesApi = new RolesApi();

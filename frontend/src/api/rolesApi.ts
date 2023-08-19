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
        const menus = apiService.get("/settings/all/permissions");
        resolve(menus);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }
  async getRolePermissions() {
    return new Promise((resolve, reject) => {
      try {
        const menus = apiService.get("/settings/all/rolePermissions");
        resolve(menus);
      } catch (err) {
        reject(new Error("Internal server error"));
      }
    });
  }

  async addPermission(ids: number[], roleId: number): Promise<any> {
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

  async deletePermission(ids?: number[]): Promise<any> {
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

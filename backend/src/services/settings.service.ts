import { injectable } from 'inversify';
import { DestroyOptions, FindOptions } from 'sequelize';

import RolePermissionsModel from '../db/models/rolePermissions.model';
import UserModel from '../db/models/users.model';
import PermissionsModel from '../db/models/permissions.model';
import RoleModel from '../db/models/roles.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { RolePermission } from '../types/settings.type';

@injectable()
class SettingsService {
  public rolePermissionsModel = RolePermissionsModel;

  public permissionsModel = PermissionsModel;

  public rolesModel = RoleModel;

  public userModel = UserModel;

  public async addPermissionsToRole({
    permissionIds,
    roleId,
  }: {
    permissionIds: number[];
    roleId?: number;
  }): Promise<RolePermission> {
    try {
      const rolePermissions: any = await this.rolePermissionsModel.bulkCreate(
        permissionIds.map((p) => ({
          roleId,
          permissionsId: p,
        }))
      );
      return rolePermissions.toJSON() as RolePermission;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - addPermissionsToRole',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async removeRolePermissions(query: DestroyOptions): Promise<void> {
    try {
      await this.rolePermissionsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - removeRolePermissions',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async findAllRolePermissions(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.rolePermissionsModel.findAndCountAll(
        query
      );
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - findAllRolePermissions',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAllPermissions(): Promise<any> {
    try {
      const result: any = await this.permissionsModel.findAll();
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - findAllPermissions',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAllRoles(): Promise<any> {
    try {
      const result: any = await this.rolesModel.findAll();
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - findAllRoles',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<RolePermission> {
    try {
      const result: any = await this.rolePermissionsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SettingsService Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default SettingsService;

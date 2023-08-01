/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import Sequelize, { FindOptions, WhereOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { SettingsService, UserService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import HttpException from '../exceptions/HttpException';
import Role from '../db/models/roles.model';
import Permissions from '../db/models/permissions.model';

@injectable()
class SettingsController {
  public userModel = UserModel;

  public settingsService: SettingsService;

  constructor(
    settingsService = iocContainer.get<SettingsService>(
      SERVICE_IDENTIFIER.SETTINGS_SERVICE
    )
  ) {
    this.settingsService = settingsService;
  }

  public getAllRolePermissions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy, ...searchValues } = req.query;

      let roleQuery: any = null;

      for (const [searchByKey, searchByValue] of Object.entries(searchValues)) {
        switch (searchByKey) {
          case 'roleId':
            roleQuery = {
              where: {
                name: searchByValue,
              },
              required: true,
            };
            break;
          default:
        }
      }

      const query: FindOptions = {
        include: [
          { model: Role, ...(roleQuery && { ...roleQuery }) },
          { model: Permissions },
        ],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
        group: ['roleId'],
        raw: true,
      };

      const resp = await this.settingsService.findAllRolePermissions(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public addPermissions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { permissionIds, roleId } = req.body;

      const resp = await this.settingsService.addPermissionsToRole({
        permissionIds: permissionIds as number[],
        roleId,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public findAllPermissions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.settingsService.findAllPermissions();
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public findAllRoles = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.settingsService.findAllRoles();
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public removeRolePermissions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { rolePermissionsIds } = req.body;
      const resp = await this.settingsService.removeRolePermissions({
        where: { id: rolePermissionsIds },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default SettingsController;

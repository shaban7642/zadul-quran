/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import Sequelize, { FindOptions, WhereOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { UserService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import HttpException from '../exceptions/HttpException';
import Role from '../db/models/roles.model';

@injectable()
class UserController {
  public userModel = UserModel;

  public userService: UserService;

  constructor(
    userService = iocContainer.get<UserService>(SERVICE_IDENTIFIER.USER_SERVICE)
  ) {
    this.userService = userService;
  }

  public getAllUsers = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy, ...searchValues } = req.query;

      let searchParams: WhereOptions = {};
      let roleQuery: any = null;

      for (const [searchByKey, searchByValue] of Object.entries(searchValues)) {
        switch (searchByKey) {
          case 'userName':
            searchParams = {
              [Sequelize.Op.or]: [
                {
                  firstName: {
                    [Sequelize.Op.iLike]: `%${searchByValue}%`,
                  },
                },
                {
                  lastName: {
                    [Sequelize.Op.iLike]: `%${searchByValue}%`,
                  },
                },
              ],
            };
            break;
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
        where: {
          ...searchParams,
        },
        attributes: {
          exclude: ['password'],
        },
        include: [{ model: Role, ...(roleQuery && { ...roleQuery }) }],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
      };

      const resp = await this.userService.findAllAndCount(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(req.params.id);
      const resp = await this.userService.findOne({
        where: { id: userId },
        attributes: {
          exclude: ['password'],
        },
      });
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getUserByEmail = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const resp = await this.userService.findOne({
        where: { email },
        attributes: {
          exclude: ['password'],
        },
      });
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const emailExists = await this.userService.findOne({ where: { email } });
      if (!emailExists) {
        const resp = await this.userService.create([req.body]);
        return res.status(200).json(resp[0]);
      }
      res.status(200).json({ message: 'Email already exists' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: userId } = req.params;
      const resp = await this.userService.update(
        { where: { id: Number(userId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public updateUserRole = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role } = req.body;
      const { id: userId } = req.params;

      const roleLookup: any = {
        'Super Admin': 1,
        Admin: 2,
        Teacher: 3,
        Student: 4,
      };

      const roleId = roleLookup[role] || null;
      if (!roleId)
        throw new HttpException(
          400,
          30003,
          'you have entered wrong role, the role must be => Super Admin/Admin/Teacher/Student'
        );

      await this.userService.update(
        { where: { id: userId } },
        {
          roleId,
        }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.params;
      const resp = await this.userService.delete({
        where: { id: Number(userId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

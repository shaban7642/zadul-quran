/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { DepartmentsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';

@injectable()
class DepartmentsController {
  public userModel = UserModel;

  public departmentsService: DepartmentsService;

  constructor(
    departmentsService = iocContainer.get<DepartmentsService>(
      SERVICE_IDENTIFIER.DEPARTMENTS_SERVICE
    )
  ) {
    this.departmentsService = departmentsService;
  }

  public getAllDepartments = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy } = req.query;

      const query: FindOptions = {
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
        raw: true,
      };

      const resp = await this.departmentsService.findAndCountAll(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createDepartment = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, description } = req.body;

      const resp = await this.departmentsService.createOne({
        name,
        description,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateDepartment = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: departmentId } = req.params;
      const resp = await this.departmentsService.update(
        { where: { id: Number(departmentId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public deleteDepartment = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: departmentId } = req.params;
      const resp = await this.departmentsService.deleteDepartment({
        where: { id: Number(departmentId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default DepartmentsController;

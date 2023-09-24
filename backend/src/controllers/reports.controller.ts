/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { ReportsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import Documents from '../db/models/documents.model';
import Sessions from '../db/models/sessions.model';
import Departments from '../db/models/departments.model';
import Patches from '../db/models/patches.model';

@injectable()
class ReportsController {
  public userModel = UserModel;

  public reportsService: ReportsService;

  constructor(
    reportsService = iocContainer.get<ReportsService>(
      SERVICE_IDENTIFIER.REPORTS_SERVICE
    )
  ) {
    this.reportsService = reportsService;
  }

  public getAllReports = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy } = req.query;

      const query: FindOptions = {
        include: [
          { model: Documents },
          { model: UserModel },
          {
            model: Sessions,
          },
        ],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
      };

      const resp = await this.reportsService.findAndCountAll(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createReport = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req;

      const resp = await this.reportsService.createOne({
        userId,
        ...req.body,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateReport = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: reportId } = req.params;
      const resp = await this.reportsService.update(
        { where: { id: Number(reportId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public deleteReport = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: reportId } = req.params;
      const resp = await this.reportsService.deleteReport({
        where: { id: Number(reportId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default ReportsController;

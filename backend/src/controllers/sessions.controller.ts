/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { SessionsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import Patches from '../db/models/patches.model';
import Departments from '../db/models/departments.model';

const attributes = [
  'id',
  'title',
  'patchId',
  'sessionMethod',
  'meetingId',
  'date',
  'startTime',
  'endTime',
  'status',
  'createdAt',
  'updatedAt',
];

@injectable()
class SessionsController {
  public userModel = UserModel;

  public sessionsService: SessionsService;

  constructor(
    sessionsService = iocContainer.get<SessionsService>(
      SERVICE_IDENTIFIER.SESSIONS_SERVICE
    )
  ) {
    this.sessionsService = sessionsService;
  }

  public getAllSessions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy } = req.query;

      const query: FindOptions = {
        attributes,
        include: [
          {
            model: Patches,
            include: [
              { model: UserModel, as: 'student' },
              { model: UserModel, as: 'teacher' },
              { model: Departments },
            ],
          },
        ],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
      };

      const resp = await this.sessionsService.findAndCountAll(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createSessions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
        dayOfWeek,
        startTime,
        endTime,
        title,
        sessionMethod,
      } = req.body;

      const resp = await this.sessionsService.createMany({
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
        dayOfWeek,
        startTime,
        endTime,
        title,
        sessionMethod,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateSession = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: sessionId } = req.params;
      const resp = await this.sessionsService.update(
        { where: { id: Number(sessionId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public deleteSession = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: sessionId } = req.params;
      const resp = await this.sessionsService.deleteSession({
        where: { id: Number(sessionId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default SessionsController;

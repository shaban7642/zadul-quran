import { injectable } from 'inversify';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import SessionsModel from '../db/models/sessions.model';
import PatchesModel from '../db/models/patches.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Session } from '../types/sessions.type';

@injectable()
class SessionsService {
  public sessionsModel = SessionsModel;

  public patchesModel = PatchesModel;

  public userModel = UserModel;

  public async createMany({
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
  }: {
    studentId: number;
    teacherId: number;
    departmentId: number;
    fromDate: Date;
    toDate: Date;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    title: string;
    sessionMethod: string;
  }): Promise<any> {
    try {
      const patch = await this.patchesModel.create({
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
      });
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const targetIndex = dayOfWeek;
      const daysToAdd = (targetIndex - start.getDay() + 7) % 7;

      console.log({ start, end, targetIndex, daysToAdd });
      const result = [];
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + daysToAdd);

      while (currentDate <= end) {
        if (currentDate >= start) {
          result.push(new Date(currentDate).toString());
        }
        currentDate.setDate(currentDate.getDate() + 7);
      }

      console.log({
        patchId: patch.id,
        meetingId: `${Math.random()}`.substring(2, 8),
        // date: res,
        startTime,
        endTime,
        title,
      });

      let sessions;
      for (const res of result) {
        sessions = await this.sessionsModel.create(
          {
            title,
            sessionMethod,
            patchId: patch.id,
            meetingId: `${Math.random()}`.substring(2, 8),
            date: res,
            startTime,
            endTime,
          },
          {
            returning: false,
          }
        );
      }

      console.log({ sessions });

      return { success: true };
    } catch (err) {
      console.log(err);
      logger.log({
        level: 'error',
        label: 'Sessions Service - createMany',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async update(query: UpdateOptions, data: Session) {
    try {
      await this.sessionsModel.update(data, query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Sessions Service - update',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async deleteSession(query: DestroyOptions): Promise<void> {
    try {
      await this.sessionsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Sessions Service - deleteSession',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async findAndCountAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.sessionsModel.findAndCountAll(query);
      const resp = {
        ...result,
        rows: result.rows.map((row: any) => row.toJSON() as Session),
      };
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Sessions Service - findAllAndCount',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.sessionsModel.findAll(query);
      const resp = result.map((row: any) => row.toJSON() as Session);
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Sessions Service - findAll',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<Session> {
    try {
      const result: any = await this.sessionsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Sessions Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default SessionsService;

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
    sessionTypeId,
  }: {
    studentId: number;
    teacherId: number;
    departmentId: number;
    fromDate: Date;
    toDate: Date;
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
    title: string;
    sessionMethod: string;
    sessionTypeId: number;
  }): Promise<any> {
    try {
      const patch = await this.patchesModel.create({
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
        dayOfWeek,
      });

      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999); // Set end date to the end of the day
      const result = [];

      // For each day of the week (e.g., [1, 3, 5] for Mon, Wed, Fri)
      for (const targetDay of dayOfWeek) {
        // Create a new Date object to prevent modifying the original `start`
        const currentDate = new Date(start);

        // Adjust currentDate to the first occurrence of targetDay
        while (currentDate.getDay() !== targetDay) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Loop through the dates, adding 7 days at a time, until we pass `end`
        while (currentDate <= end) {
          result.push(new Date(currentDate).toISOString()); // Save the date
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }

      // Now, create sessions for each valid date in the `result`
      for (const sessionDate of result) {
        console.log('test');
        await this.sessionsModel.create(
          {
            title,
            sessionMethod,
            patchId: patch.id,
            meetingId: `${Math.random()}`.substring(2, 8),
            date: sessionDate,
            startTime,
            endTime,
            sessionTypeId,
          },
          {
            returning: false,
          }
        );
      }

      return { success: true, sessionsCreated: result.length };
    } catch (err) {
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
      const resp = await this.sessionsModel.update(data, query);
      return resp;
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

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
    userId,
    dataToCreate,
  }: {
    userId: number;
    dataToCreate: [{ date: Date; startTime: Date; endTime: Date }];
  }): Promise<Session[]> {
    try {
      const patch = await this.patchesModel.create({});
      const sessions: SessionsModel[] = await this.sessionsModel.bulkCreate([
        {
          patchId: patch.id,
          userId,
          meetingId: `${Math.random()}`.substring(2, 8),
          ...dataToCreate,
        },
      ]);
      return sessions.map((s) => s.toJSON() as Session);
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

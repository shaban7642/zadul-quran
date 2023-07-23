import { injectable } from 'inversify';
import { FindOptions } from 'sequelize';

import UserAgentsModel from '../db/models/userAgents.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { UserAgent } from '../types/userAgent.type';

@injectable()
class UserAgentsService {
  public userAgentsModel = UserAgentsModel;

  public userModel = UserModel;

  public async createOne({
    userId,
    deviceName,
    deviceDescription,
  }: {
    userId: number;
    deviceName?: string;
    deviceDescription?: string;
  }): Promise<UserAgent> {
    try {
      const UserAgents: UserAgentsModel = await this.userAgentsModel.create({
        userId,
        deviceName,
        deviceDescription,
      });
      return UserAgents.toJSON() as UserAgent;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'UserAgents Service - createOne',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async deleteUserAgent(
    userId: number,
    deviceName: string,
    deviceDescription: string
  ): Promise<void> {
    try {
      await this.userAgentsModel.destroy({
        where: {
          userId,
          deviceName,
          deviceDescription,
        },
      });
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'UserAgents Service - deleteUserAgent',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async getUserAgents(userId: any): Promise<any> {
    try {
      const result: any = await this.userAgentsModel.findAll({
        where: { userId },
        raw: true,
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'UserAgents Service - getUserAgents',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<UserAgent> {
    try {
      const result: any = await this.userAgentsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'UserAgents Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default UserAgentsService;

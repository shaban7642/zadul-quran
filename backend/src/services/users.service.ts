/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-continue */
import { injectable } from 'inversify';
import { FindOptions, Transaction, UpdateOptions } from 'sequelize';
import bcrypt from 'bcryptjs';
import Str from '@supercharge/strings';

import UserModel from '../db/models/users.model';
import { User } from '../types/user.type';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';

@injectable()
class UserService {
  public userModel = UserModel;

  public async findAll(query: FindOptions): Promise<User[]> {
    try {
      const resp = await this.userModel.findAll({ ...query });
      return resp.map((r) => r.toJSON() as User);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - findAll',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async findAllAndCount(
    query: FindOptions
  ): Promise<{ rows: User[]; count: number }> {
    try {
      const resp = await this.userModel.findAndCountAll({ ...query });
      const result = {
        ...resp,
        rows: resp.rows.map((r) => r.toJSON() as User),
      };
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - findAll',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async findOne(query: FindOptions): Promise<User> {
    try {
      const resp = await this.userModel.findOne({ ...query });
      return resp?.toJSON() as User;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - findOne',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async delete(query: FindOptions) {
    try {
      await this.userModel.destroy({ ...query });
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - delete',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async update(query: UpdateOptions, data: User) {
    try {
      await this.userModel.update(data, query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - update',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async create(
    data: User[],
    transaction?: Transaction
  ): Promise<User[]> {
    try {
      const userData: User[] = [];
      for (const user of data) {
        const { password } = user;
        const hashedPassword = await bcrypt.hash(password as string, 10);
        const userObj = {
          ...user,
          registrationNumber: `${Str.random()}`,
          lastLoginDate: new Date(),
          password: hashedPassword,
        };
        userData.push(userObj);
      }

      return await this.userModel.bulkCreate(
        userData.map((user) => ({ ...user })),
        { transaction }
      );
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'User Service - create',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }
}

export default UserService;

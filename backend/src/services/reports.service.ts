import { injectable } from 'inversify';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import ReportsModel from '../db/models/reports.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Report } from '../types/reports.type';

@injectable()
class ReportsService {
  public reportsModel = ReportsModel;

  public userModel = UserModel;

  public async createOne(dataToCreate: any): Promise<Report> {
    try {
      const report: ReportsModel = await this.reportsModel.create({
        ...dataToCreate,
      });
      return report.toJSON() as Report;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - createOne',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async update(query: UpdateOptions, data: Report) {
    try {
      await this.reportsModel.update(data, query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - update',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async deleteReport(query: DestroyOptions): Promise<void> {
    try {
      await this.reportsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - deleteReport',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async findAndCountAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.reportsModel.findAndCountAll(query);
      const resp = {
        ...result,
        rows: result.rows.map((row: any) => row.toJSON() as Report),
      };
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - findAllAndCount',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.reportsModel.findAll(query);
      const resp = result.map((row: any) => row.toJSON() as Report);
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - findAll',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<Report> {
    try {
      const result: any = await this.reportsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Reports Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default ReportsService;

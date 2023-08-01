import { injectable } from 'inversify';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import DepartmentsModel from '../db/models/departments.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Department } from '../types/departments.type';

@injectable()
class DepartmentsService {
  public departmentsModel = DepartmentsModel;

  public userModel = UserModel;

  public async createOne({
    name,
    description,
  }: {
    name?: string;
    description?: string;
  }): Promise<Department> {
    try {
      const departments: DepartmentsModel = await this.departmentsModel.create({
        name,
        description,
      });
      return departments.toJSON() as Department;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Departments Service - createOne',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async update(query: UpdateOptions, data: Department) {
    try {
      await this.departmentsModel.update(data, query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Departments Service - update',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async deleteDepartment(query: DestroyOptions): Promise<void> {
    try {
      await this.departmentsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Departments Service - deleteDepartment',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async findAndCountAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.departmentsModel.findAndCountAll(query);
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Departments Service - findAllAndCount',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<Department> {
    try {
      const result: any = await this.departmentsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Departments Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default DepartmentsService;

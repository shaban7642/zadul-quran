import { injectable } from 'inversify';
import { DestroyOptions, FindOptions } from 'sequelize';

import ParentsModel from '../db/models/parents.model';
import StudentParentsModel from '../db/models/studentParents.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Parent } from '../types/parents.type';

@injectable()
class ParentsService {
  public parentsModel = ParentsModel;

  public userModel = UserModel;

  public studentParentsModel = StudentParentsModel;

  public async createOneParent(parentData: Parent): Promise<Parent> {
    try {
      const Parents: ParentsModel = await this.parentsModel.create({
        ...parentData,
      });
      return Parents.toJSON() as Parent;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - createOneParent',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async createOneStudentParent({
    userId,
    parentId,
  }: {
    userId: number;
    parentId: number;
  }): Promise<Parent> {
    try {
      const studentParent: StudentParentsModel = await this.studentParentsModel.create(
        {
          userId,
          parentId,
        }
      );
      return studentParent.toJSON() as StudentParentsModel;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - createOneStudentParent',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async deleteParent(parentId: number): Promise<void> {
    try {
      await this.parentsModel.destroy({
        where: {
          id: parentId,
        },
      });
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - deleteParent',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async deleteStudentParent(query: DestroyOptions): Promise<void> {
    try {
      await this.parentsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - deleteStudentParent',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async getStudentParents(userId: any): Promise<any> {
    try {
      const result: any = await this.studentParentsModel.findAll({
        where: { userId },
        include: [{ model: this.userModel }, { model: this.parentsModel }],
        raw: true,
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - getStudentParents',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<Parent> {
    try {
      const result: any = await this.parentsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAll(query: FindOptions): Promise<Parent> {
    try {
      const result: any = await this.parentsModel.findAll(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Parents Service - findAll',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default ParentsService;

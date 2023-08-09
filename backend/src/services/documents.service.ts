import { injectable } from 'inversify';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import DocumentsModel from '../db/models/documents.model';
import UserModel from '../db/models/users.model';

import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Document } from '../types/documents.type';

@injectable()
class DocumentsService {
  public documentsModel = DocumentsModel;

  public userModel = UserModel;

  public async createOne({
    documentTypeId,
    userId,
    fileName,
    fileType,
    fileStoragePath,
  }: {
    documentTypeId: number;
    userId: number;
    fileName: string;
    fileType: string;
    fileStoragePath: string;
  }): Promise<Document> {
    try {
      const document: DocumentsModel = await this.documentsModel.create({
        documentTypeId,
        userId,
        fileName,
        fileType,
        fileStoragePath,
      });
      return document.toJSON() as Document;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - createOne',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async update(query: UpdateOptions, data: Document) {
    try {
      await this.documentsModel.update(data, query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - update',
        message: err.stack,
      });
      throw new HttpException(500, 30001, err.message);
    }
  }

  public async deleteDocument(query: DestroyOptions): Promise<void> {
    try {
      await this.documentsModel.destroy(query);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - deleteDocument',
        message: err.message,
      });
      throw new HttpException(500, 30006, err.params);
    }
  }

  public async findAndCountAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.documentsModel.findAndCountAll(query);
      const resp = {
        ...result,
        rows: result.rows.map((row: any) => row.toJSON() as Document),
      };
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - findAllAndCount',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findAll(query: FindOptions): Promise<any> {
    try {
      const result: any = await this.documentsModel.findAll(query);
      const resp = result.map((row: any) => row.toJSON() as Document);
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - findAll',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }

  public async findOne(query: FindOptions): Promise<Document> {
    try {
      const result: any = await this.documentsModel.findOne(query);

      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Documents Service - findOne',
        message: err.message,
      });
      throw new HttpException(500, 30001, err.params);
    }
  }
}

export default DocumentsService;

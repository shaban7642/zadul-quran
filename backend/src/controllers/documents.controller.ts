/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';
import DocumentTypes from '../db/models/documentTypes.model';

import { DocumentsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { RequestWithFileAndDocumentType } from '../types/request.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';

@injectable()
class DocumentsController {
  public userModel = UserModel;

  public documentsService: DocumentsService;

  constructor(
    documentsService = iocContainer.get<DocumentsService>(
      SERVICE_IDENTIFIER.DOCUMENTS_SERVICE
    )
  ) {
    this.documentsService = documentsService;
  }

  public getAllDocuments = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy, documentType } = req.query;

      const query: FindOptions = {
        include: [
          {
            model: DocumentTypes,
            ...(documentType && { where: { name: documentType } }),
          },
        ],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
      };

      const resp = await this.documentsService.findAndCountAll(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public uploadDocument = async (
    req: RequestWithFileAndDocumentType,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { file, documentType, userId } = req;

      const resp = await this.documentsService.createOne({
        documentTypeId: documentType.id,
        userId: +userId,
        fileName: file.filename,
        fileType: file.mimetype,
        fileStoragePath: file.path,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateDocument = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: documentId } = req.params;
      const resp = await this.documentsService.update(
        { where: { id: Number(documentId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public deleteDocument = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: documentId } = req.params;
      const resp = await this.documentsService.deleteDocument({
        where: { id: Number(documentId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default DocumentsController;

/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions, Op } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';
import DocumentTypes from '../db/models/documentTypes.model';
import StudentParents from '../db/models/studentParents.model';
import Parents from '../db/models/parents.model';

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
      const {
        offset,
        limit,
        sortDir,
        sortBy,
        documentType,
        pageName,
      } = req.query;

      const userRole = req.role.name;
      let whereCase: any = {};

      if (userRole === 'student' && pageName === 'home-work') {
        whereCase = {
          userId: req.userId,
        };
      } else if (userRole === 'teacher' && pageName === 'home-work') {
        const teacher: any = await this.userModel.findOne({
          where: { id: req.userId },
          include: [
            {
              model: StudentParents,
              include: [{ model: Parents }],
            },
          ],
        });

        if (!teacher || !teacher.studentParents) {
          return res.status(404).json({
            message: 'No students found for this teacher.',
          });
        }

        const studentIds = teacher.studentParents.map(
          (student: StudentParents) => student.id
        );
        // if (!studentIds || studentIds.length === 0) {
        //   return res.status(404).json({
        //     message: 'No students associated with this teacher.',
        //   });
        // }
        whereCase = {
          userId: {
            [Op.in]: studentIds,
          },
        };
      }

      const query: FindOptions = {
        where: whereCase,
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
      const { file, documentType, userId, query } = req;
      let resp;
      if (documentType.id === 2) {
        // for report document
        const { reportId } = JSON.parse(query.data.toString());
        resp = await this.documentsService.createOne({
          documentTypeId: documentType.id,
          userId: +userId,
          reportId,
          fileName: file.filename,
          fileType: file.mimetype,
          fileStoragePath: file.path,
        });
      } else {
        resp = await this.documentsService.createOne({
          documentTypeId: documentType.id,
          userId: +userId,
          fileName: file.filename,
          fileType: file.mimetype,
          fileStoragePath: file.path,
        });
      }
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

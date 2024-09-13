/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import moment from 'moment';
import { NextFunction, Response, Router } from 'express';
import multer from 'multer';
import Path from 'path';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { DocumentsController } from '../controllers';

import enums from '../../shared/enums';
import uploadMiddleware from '../middlewares/upload.middleware';
import { RequestWithIdentity } from '../types/auth.type';

const { Permissions } = enums;

const multerStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const { documentType } = req;
    const path = `public/uploads/documents/${documentType.name}/${req.userId}`;
    fs.mkdirSync(path, { recursive: true });

    cb(null, path);
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = Path.extname(file.originalname);
    const filename = file.originalname.split('.')[0];
    cb(null, `${filename}-${moment().format('YYYYMMDD')}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

class DocumentRoute implements Route {
  public path = '/api/documents';

  public router = Router();

  public documentsController = new DocumentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      accessControlMiddleware([Permissions.documents.READ]),
      this.documentsController.getAllDocuments
    );

    this.router.post(
      `${this.path}/upload`,
      // authMiddleware,
      uploadMiddleware,
      // (req: RequestWithIdentity, res: Response, next: NextFunction) => {
      //   upload.single('file');
      //   next();
      // },
      upload.single('file'),
      // accessControlMiddleware([Permissions.documents.CREATE]),
      this.documentsController.uploadDocument
    );

    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      accessControlMiddleware([Permissions.documents.UPDATE]),
      this.documentsController.updateDocument
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      accessControlMiddleware([Permissions.documents.DELETE]),
      this.documentsController.deleteDocument
    );
  }
}

export default DocumentRoute;

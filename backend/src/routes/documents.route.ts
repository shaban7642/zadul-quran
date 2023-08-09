/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { DocumentsController } from '../controllers';

import enums from '../../shared/enums';
import uploadMiddleware from '../middlewares/upload.middleware';

const { Permissions } = enums;

const multerStorage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const { documentType } = req;
    const path = `public/uploads/documents/${documentType.name}/${req.userId}`;
    fs.mkdirSync(path, { recursive: true });

    cb(null, path);
  },
  filename: (req: any, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
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
      authMiddleware,
      uploadMiddleware,
      upload.single('file'),
      accessControlMiddleware([Permissions.documents.CREATE]),
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

/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Response } from 'express';
import { RequestWithDocumentType } from '../types/auth.type';

async function uploadMiddleware(
  req: RequestWithDocumentType,
  res: Response,
  next: NextFunction
) {
  const { data } = req.query;
  req.documentType = JSON.parse(data as string).documentType;
  next();
}

export default uploadMiddleware;

/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Response } from 'express';
import { RequestWithDocumentType } from '../types/auth.type';

async function uploadMiddleware(
  req: RequestWithDocumentType,
  res: Response,
  next: NextFunction
) {
  try {
    const { data } = req.query;
    const parsedData = JSON.parse(data as string);
    req.documentType = parsedData.documentType;
    req.userId = parsedData?.userId;
    next();
  } catch (error) {
    next(error);
  }
}

export default uploadMiddleware;

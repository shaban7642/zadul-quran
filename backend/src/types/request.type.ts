import { Request } from 'express';

export interface RequestWithFile extends Request {
  identityId?: number;
  userId?: number;
  reportId?: number;
  companyId?: number;
  organizationId?: number;
  accountantId?: number;
  file: any;
  tenant?: string;
}

export interface RequestWithFileAndDocumentType extends Request {
  identityId?: number;
  userId?: number;
  reportId?: number;
  companyId?: number;
  organizationId?: number;
  accountantId?: number;
  file: any;
  documentType: any;
  tenant?: string;
}

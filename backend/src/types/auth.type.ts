import { Request } from 'express';

export interface RequestWithIdentity extends Request {
  userId?: number;
  rolePermissions: any;
  auth?: { [key: string]: any };
  role?: { [key: string]: any };
}

export interface UserIdSet {
  userId: number;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  userId?: number;
}

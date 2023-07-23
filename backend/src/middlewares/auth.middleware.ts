/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from '../db/models/users.model';
import RoleModel from '../db/models/roles.model';
import PermissionModel from '../db/models/permissions.model';
import RolePermissions from '../db/models/rolePermissions.model';
import HttpException from '../exceptions/HttpException';
import { RequestWithIdentity, DataStoredInToken } from '../types/auth.type';

async function authMiddleware(
  req: RequestWithIdentity,
  res: Response,
  next: NextFunction
) {
  const { cookies, headers } = req;

  if (cookies && cookies.Authorization) {
    try {
      const { Authorization } = cookies;
      const secret = process.env.JWT_SECRET;

      const verificationResponse = jwt.verify(
        Authorization,
        secret
      ) as DataStoredInToken;

      const { userId } = verificationResponse;

      const baseQuery = {
        where: {
          id: userId,
        },
      };

      const userQuery = {
        ...baseQuery,
        include: [
          {
            model: RoleModel,
            include: [{ model: PermissionModel }],
          },
        ],
      };

      const userResp: any = await UserModel.findOne(userQuery);

      if (!userResp) {
        next(new HttpException(403, 20001, 'Invalid or expired token'));
      }

      const { role } = userResp;

      req.userId = userId;
      req.rolePermissions = role.permissions;

      next();
    } catch (err) {
      res.clearCookie('Authorization');
      next(new HttpException(403, 20001, err.message));
    }
  } else {
    res.clearCookie('Authorization');
    next(new HttpException(403, 20003, 'No Authentication Tokens Found'));
  }
}

export default authMiddleware;

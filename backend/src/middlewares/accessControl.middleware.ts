import { NextFunction, Response } from 'express';
import { get } from 'lodash';

import HttpException from '../exceptions/HttpException';
import { RequestWithIdentity } from '../types/auth.type';

function checkAuthorization(permisisons: string[], roles: any[]) {
  if (!Array.isArray(permisisons) || !Array.isArray(roles)) {
    return false;
  }

  return permisisons.every((permission) =>
    roles.some((role: any) => role.name === permission)
  );
}

function accessControlMiddleware(requiredPermissions: string[]) {
  return (req: RequestWithIdentity, res: Response, next: NextFunction) => {
    const roles = get(req, 'rolePermissions', []);
    const accessGranted = checkAuthorization(requiredPermissions, roles);
    if (accessGranted) next();
    else next(new HttpException(403, 20001, 'Invalid identity'));
  };
}

export default accessControlMiddleware;

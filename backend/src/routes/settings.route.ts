import { Router } from 'express';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { SettingsController } from '../controllers';

import enums from '../../shared/enums';

const { Permissions } = enums;

class SettingsRoute implements Route {
  public path = '/api/settings';

  public router = Router();

  public settingsController = new SettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/all/rolePermissions`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.settings.READ]),
      this.settingsController.getAllRolePermissions
    );

    this.router.get(
      `${this.path}/all/permissions`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.settings.READ]),
      this.settingsController.findAllPermissions
    );

    this.router.get(
      `${this.path}/all/roles`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.settings.READ]),
      this.settingsController.findAllRoles
    );

    this.router.post(
      `${this.path}/add/permission`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.settings.CREATE]),
      this.settingsController.addPermissions
    );

    this.router.post(
      `${this.path}/remove/permission`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.settings.DELETE]),
      this.settingsController.removeRolePermissions
    );
  }
}

export default SettingsRoute;

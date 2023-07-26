import { Router } from 'express';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { UserController } from '../controllers';

import enums from '../../shared/enums';

const { Permissions } = enums;

class UserRoute implements Route {
  public path = '/api/user';

  public router = Router();

  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.READ]),
      this.userController.getAllUsers
    );

    this.router.get(
      `${this.path}/email`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.READ]),
      this.userController.getUserByEmail
    );

    this.router.get(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.READ]),
      this.userController.getUserById
    );

    this.router.post(
      `${this.path}/create`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.CREATE]),
      this.userController.createUser
    );

    this.router.put(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.UPDATE]),
      this.userController.updateUser
    );

    this.router.put(
      `${this.path}/update/role/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.UPDATE]),
      this.userController.updateUserRole
    );

    this.router.delete(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.users.DELETE]),
      this.userController.deleteUser
    );
  }
}

export default UserRoute;

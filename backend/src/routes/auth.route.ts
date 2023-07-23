import { Router } from 'express';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import { AuthController } from '../controllers';

class AuthRoute implements Route {
  public path = '/api/auth';

  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);

    this.router.get(
      `${this.path}/reAuthorize`,
      authMiddleware,
      this.authController.reAuthorize
    );

    this.router.get(
      `${this.path}/logout`,
      authMiddleware,
      this.authController.logout
    );

    this.router.put(
      `${this.path}/change-password`,
      authMiddleware,
      this.authController.changePassword
    );
  }
}

export default AuthRoute;

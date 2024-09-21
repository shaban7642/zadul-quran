/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { SessionsController } from '../controllers';

import enums from '../../shared/enums';

const { Permissions } = enums;

class SessionRoute implements Route {
  public path = '/api/sessions';

  public router = Router();

  public sessionsController = new SessionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.READ]),
      this.sessionsController.getAllSessions
    );

    this.router.get(
      `${this.path}/types`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.READ]),
      this.sessionsController.getSessionTypes
    );

    this.router.post(
      `${this.path}/create`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.CREATE]),
      this.sessionsController.createSessions
    );

    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.UPDATE]),
      this.sessionsController.updateSession
    );

    this.router.delete(
      `${this.path}`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.DELETE]),
      this.sessionsController.deleteSessions
    );

    this.router.get(
      `${this.path}/oauth/callback`,
      authMiddleware,
      accessControlMiddleware([Permissions.sessions.CREATE]),
      this.sessionsController.generateMeeting
    );
  }
}

export default SessionRoute;

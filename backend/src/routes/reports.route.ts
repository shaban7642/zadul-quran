/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { Router } from 'express';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { ReportsController } from '../controllers';

import enums from '../../shared/enums';

const { Permissions } = enums;

class ReportRoute implements Route {
  public path = '/api/reports';

  public router = Router();

  public reportsController = new ReportsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      accessControlMiddleware([Permissions.reports.READ]),
      this.reportsController.getAllReports
    );

    this.router.post(
      `${this.path}/create`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.reports.CREATE]),
      this.reportsController.createReport
    );

    this.router.put(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.reports.UPDATE]),
      this.reportsController.updateReport
    );

    this.router.delete(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.reports.DELETE]),
      this.reportsController.deleteReport
    );
  }
}

export default ReportRoute;

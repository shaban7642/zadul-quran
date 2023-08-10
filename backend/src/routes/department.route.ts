import { Router } from 'express';
import { Route } from '../types/routes.type';
import authMiddleware from '../middlewares/auth.middleware';
import accessControlMiddleware from '../middlewares/accessControl.middleware';
import { DepartmentsController } from '../controllers';

import enums from '../../shared/enums';

const { Permissions } = enums;

class DepartmentRoute implements Route {
  public path = '/api/department';

  public router = Router();

  public departmentController = new DepartmentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.departments.READ]),
      this.departmentController.getAllDepartments
    );

    this.router.post(
      `${this.path}/create`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.departments.CREATE]),
      this.departmentController.createDepartment
    );

    this.router.put(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.departments.UPDATE]),
      this.departmentController.updateDepartment
    );

    this.router.delete(
      `${this.path}/:id`,
      // authMiddleware,
      // accessControlMiddleware([Permissions.departments.DELETE]),
      this.departmentController.deleteDepartment
    );
  }
}

export default DepartmentRoute;

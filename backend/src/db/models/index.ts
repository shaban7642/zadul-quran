import { Sequelize } from 'sequelize';
import { DialectOptions } from '../../types/sequelize.type';
import Role from './roles.model';
import Permissions from './permissions.model';
import RolePermissions from './rolePermissions.model';
import User from './users.model';
import UserAgents from './userAgents.model';
import Departments from './departments.model';
import Parents from './parents.model';
import StudentParents from './studentParents.model';
import Documents from './documents.model';
import DocumentTypes from './documentTypes.model';
import Patches from './patches.model';
import Sessions from './sessions.model';
import Reports from './reports.model';

console.info('Initializing sequelize...');

const sqlInitialize = () => {
  const dialectOptions: DialectOptions = {
    // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
    // same as host string above
    socketPath: process.env.POSTGRES_HOST as string,
  };
  return new Sequelize(
    process.env.POSTGRES_DATABASE as string,
    process.env.POSTGRES_USERNAME as string,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      logging: false,
      pool: {
        min: 0,
        max: 50,
        idle: 10000,
        acquire: 30000,
      },
      dialectOptions,
    }
  );
};

export const sequelize = sqlInitialize();

export const initModels = async (sequelizeInst: Sequelize) => {
  try {
    console.info('Initializing sequelize models...');
    await Role.initModel(sequelizeInst);
    await Permissions.initModel(sequelizeInst);
    await RolePermissions.initModel(sequelizeInst);
    await User.initModel(sequelizeInst);
    await UserAgents.initModel(sequelizeInst);
    await Departments.initModel(sequelizeInst);
    await Parents.initModel(sequelizeInst);
    await StudentParents.initModel(sequelizeInst);
    await DocumentTypes.initModel(sequelizeInst);
    await Documents.initModel(sequelizeInst);
    await Patches.initModel(sequelizeInst);
    await Sessions.initModel(sequelizeInst);
    await Reports.initModel(sequelizeInst);
  } catch (error) {
    console.log(error);
  }
};

export const initAssociation = async () => {
  try {
    console.info('Initializing sequelize associations...');
    await Role.initAssociation();
    await Permissions.initAssociation();
    await RolePermissions.initAssociation();
    await User.initAssociation();
    await UserAgents.initAssociation();
    await Departments.initAssociation();
    await Parents.initAssociation();
    await StudentParents.initAssociation();
    await DocumentTypes.initAssociation();
    await Documents.initAssociation();
    await Patches.initAssociation();
    await Sessions.initAssociation();
    await Reports.initAssociation();
  } catch (error) {
    console.log(error);
  }
};

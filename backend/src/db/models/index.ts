import { Sequelize } from 'sequelize';
import { DialectOptions } from '../../types/sequelize.type';
import Role from './roles.model';
import Permissions from './permissions.model';
import RolePermissions from './rolePermissions.model';
import User from './users.model';
import UserAgents from './userAgents.model';

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
  } catch (error) {
    console.log(error);
  }
};

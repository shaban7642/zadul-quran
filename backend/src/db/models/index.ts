import { Sequelize } from 'sequelize';
import { DialectOptions } from '../../types/sequelize.type';

console.info('Initializing sequelize...');

const sqlInitialize = () => {
  const dialectOptions: DialectOptions = {
    // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
    // same as host string above
    socketPath: process.env.POSTGRES_HOST,
  };
  return new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USERNAME,
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
  } catch (error) {
    console.log(error);
  }
};

export const initAssociation = async () => {
  try {
    console.info('Initializing sequelize associations...');
  } catch (error) {
    console.log(error);
  }
};

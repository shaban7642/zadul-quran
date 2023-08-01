/* IoC Container */
import 'reflect-metadata';
import { Container } from 'inversify';
import { Sequelize } from 'sequelize';

import { SERVICE_IDENTIFIER } from '../constants';
import ServerConfig from './server.config';

import { sequelize } from '../db/models/index';
import {
  UserService,
  AuthService,
  UserAgentsService,
  SettingsService,
  DepartmentsService,
} from '../services';

const container = new Container();

container
  .bind<ServerConfig>(SERVICE_IDENTIFIER.SERVER_CONFIG)
  .to(ServerConfig)
  .inSingletonScope();

container
  .bind<Sequelize>(SERVICE_IDENTIFIER.SEQUELIZE)
  .toDynamicValue(() => {
    return sequelize;
  })
  .inSingletonScope();

container.bind<UserService>(SERVICE_IDENTIFIER.USER_SERVICE).to(UserService);

container.bind<AuthService>(SERVICE_IDENTIFIER.AUTH_SERVICE).to(AuthService);
container
  .bind<UserAgentsService>(SERVICE_IDENTIFIER.USER_AGENTS_SERVICE)
  .to(UserAgentsService);

container
  .bind<SettingsService>(SERVICE_IDENTIFIER.SETTINGS_SERVICE)
  .to(SettingsService);

container
  .bind<DepartmentsService>(SERVICE_IDENTIFIER.DEPARTMENTS_SERVICE)
  .to(DepartmentsService);

export default container;

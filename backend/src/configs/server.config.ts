/*
 *  Server Config
 */

import { injectable } from 'inversify';
import { ServerConfig } from '../types/configs.type';

@injectable()
class ServerConfigImpl implements ServerConfig {
  public env: string;

  public port: number;

  public dbHost: string;

  public dbName: string;

  public dbUser: string;

  public dbPassword: string;

  public whitelistDomains: string[];

  public jwtSecret: string;

  constructor() {
    this.env = process.env.NODE_ENV || 'local';
    this.port = ((process.env.PORT as any) as number) || 3000;
    this.dbHost = process.env.POSTGRES_HOST || '';
    this.dbName = process.env.POSTGRES_DATABASE || '';
    this.dbUser = process.env.POSTGRES_USERNAME || '';
    this.dbPassword = process.env.POSTGRES_PASSWORD || '';
    this.whitelistDomains = (() => {
      const domains = process.env.WHITELIST_DOMAINS || '';
      const domainsArr = domains.split(',').map((domain) => domain.trim());
      return domainsArr.filter((domain) => domain !== '');
    })();
    this.jwtSecret = process.env.JWT_SECRET || '';
  }
}

export default ServerConfigImpl;

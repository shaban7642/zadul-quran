export interface ServerConfig {
  env: string;
  port: number;
  enableAPI?: boolean;
  enableAuth?: boolean;
  dbHost: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  apiUrl?: string;
  webUrl?: string;
}

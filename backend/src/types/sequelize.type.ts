export interface Ssl {
  host: string;
  key: any;
  cert: any;
  ca: any;
  rejectUnauthorized?: boolean;
  requestCert?: boolean;
}

export interface DialectOptions {
  socketPath: string;
  ssl?: Ssl;
}

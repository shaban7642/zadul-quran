/* eslint-disable import/no-extraneous-dependencies */
import { Request } from 'express';
import cors from 'cors';
import ServerConfig from '../configs/server.config';

function corsMiddleware() {
  const { whitelistDomains } = new ServerConfig();

  const defaultCorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'X-API-Key',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  };

  const corsOptionsDelegate = (req: Request, callback: any): void => {
    if (process.env.NODE_ENV === 'local') {
      callback(null, {
        ...defaultCorsOptions,
        origin: true,
      });
    } else {
      const origin = req.header('Origin');

      if (
        whitelistDomains.indexOf(origin) !== -1 ||
        // NOTE since origin is added by the browser. May need to find better implementation of CORS
        // https://github.com/expressjs/cors/issues/118
        origin === undefined // self origin.
      ) {
        callback(null, {
          ...defaultCorsOptions,
          origin: true,
        });
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  };
  return cors(corsOptionsDelegate);
}

export default corsMiddleware;

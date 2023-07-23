import winston, { format } from 'winston';
import { upperCase } from 'lodash';
// import { LoggingWinston } from '@google-cloud/logging-winston';

const { combine, timestamp: timeStampFormat, printf } = format;

// const loggingWinston = new LoggingWinston();

const errorStackFormat = format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

const customFormat = printf(({ level, message, timestamp, stack, label }) => {
  const errStack = stack ? `\n${stack}` : '';
  const labelTag = label ? ` [${label}] ` : ' ';

  return `${timestamp}${labelTag}- ${upperCase(level)}: ${JSON.stringify(
    message
  )} ${errStack}`;
});

// todo: temp fix
// level: process.env.LOG_LEVEL || 'info';
const optionsLevel: any = process.env.LOG_LEVEL || 'info';

const options: winston.LoggerOptions = {
  level: optionsLevel,
  format: combine(timeStampFormat(), errorStackFormat(), customFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
    // loggingWinston,
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;

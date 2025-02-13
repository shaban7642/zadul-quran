require('dotenv').config();

let dialectOptions = {};

if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test') {
  dialectOptions = {
    ssl: {
      host: process.env.DB_HOST,
    },
  };
}

let config = {
  local: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ...dialectOptions,
    },
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ...dialectOptions,
    },
  },
};

if (process.env.NODE_ENV === 'local') {
  config = config.local;
} else if (process.env.NODE_ENV === 'development') {
  config = config.development;
} else if (process.env.NODE_ENV === 'production') {
  config = config.production;
} else {
  config = config.local;
}

if (process.env.NODE_ENV !== 'production') {
  console.log(
    `Running sequelize-cli on host: ${config.host}; db: ${config.database}`
  );
} else {
  console.log('Running sequelize-cli in production');
}

module.exports = {
  ...config,
};

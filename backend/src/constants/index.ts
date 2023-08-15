const SERVICE_IDENTIFIER = {
  SERVER_CONFIG: Symbol('ServerConfig'),
  APP_CONFIG: Symbol('AppConfig'),
  SEQUELIZE: Symbol('Sequelize'),
  USER_SERVICE: Symbol('UserService'),
  AUTH_SERVICE: Symbol('AuthService'),
  USER_AGENTS_SERVICE: Symbol('UserAgentsService'),
  SETTINGS_SERVICE: Symbol('SettingsService'),
  DEPARTMENTS_SERVICE: Symbol('DepartmentsService'),
  PARENTS_SERVICE: Symbol('ParentsService'),
  DOCUMENTS_SERVICE: Symbol('DocumentsService'),
  SESSIONS_SERVICE: Symbol('SessionsService'),
  REPORTS_SERVICE: Symbol('ReportsService'),
};

const UTIL = {
  ORDER_BY: {
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
  },
  FORMATS: {
    DATE: { YYYYMMDD: 'YYYY-MM-DD' },
  },
};

const DTO_VALIDATOR = {
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[!@#$%^&_.*<>/':"+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  PASSWORD_VALIDATOR_MESSAGE:
    'Password must be longer than or equal to 8 characters, contain at least one uppercase and lowercase letter, a number and a symbol.',
};

export { SERVICE_IDENTIFIER, UTIL, DTO_VALIDATOR };

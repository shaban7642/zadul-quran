const replaceEnum = require('../../utils/sequelize/replaceEnum').default;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return replaceEnum({
      schema: 'public',
      tableName: 'sessions',
      columnName: 'status',
      enumName: 'enum_sessions_status',
      defaultValue: 'waiting',
      newValues: [
        'waiting',
        'expired',
        'running',
        'done',
        'cancelled',
        'absent',
        'rescheduled',
      ],
      queryInterface,
    });
  },

  down: (queryInterface, Sequelize) => {
    return replaceEnum({
      schema: 'public',
      tableName: 'sessions',
      columnName: 'status',
      enumName: 'enum_sessions_status',
      defaultValue: 'waiting',
      newValues: [
        'waiting',
        'expired',
        'running',
        'done',
        'cancelled',
        'absent',
      ],
      queryInterface,
    });
  },
};

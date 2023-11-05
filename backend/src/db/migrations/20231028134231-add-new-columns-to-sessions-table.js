'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'startedAt', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('sessions', 'endedAt', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('sessions', 'sessionTypeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'sessionTypes',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sessions', 'startedAt');
    await queryInterface.removeColumn('sessions', 'endedAt');
    await queryInterface.removeColumn('sessions', 'sessionTypeId');
  },
};

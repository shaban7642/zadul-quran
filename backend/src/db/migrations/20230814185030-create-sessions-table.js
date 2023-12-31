'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patchId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'patches',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
      },
      sessionMethod: {
        type: Sequelize.STRING,
      },
      meetingId: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      startTime: {
        type: Sequelize.TIME,
      },
      endTime: {
        type: Sequelize.TIME,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['waiting', 'expired', 'running', 'done', 'cancelled'],
        defaultValue: 'waiting',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('sessions'),
};

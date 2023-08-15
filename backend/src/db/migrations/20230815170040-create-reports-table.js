'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'documents',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      sessionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sessions',
          key: 'id',
        },
      },
      date: {
        type: Sequelize.DATE,
      },
      submissionDate: {
        type: Sequelize.DATE,
      },
      reportContent: {
        type: Sequelize.TEXT,
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
  down: (queryInterface) => queryInterface.dropTable('reports'),
};

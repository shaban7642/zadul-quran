'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the column (e.g., 'documentId' from 'reports')
    await queryInterface.removeColumn('reports', 'documentId');
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the column in case of rollback
    await queryInterface.addColumn('reports', 'documentId', {
      type: Sequelize.INTEGER, // Define the column type
      allowNull: true, // Adjust based on the original column's allowNull setting
    });
  },
};

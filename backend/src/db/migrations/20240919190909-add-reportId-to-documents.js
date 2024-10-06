'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'reportId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null since not all documents will be associated with a report
      references: {
        model: 'reports', // Name of the related table
        key: 'id', // Column to reference in the Reports table
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'reportId');
  },
};

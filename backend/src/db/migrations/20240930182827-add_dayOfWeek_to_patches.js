'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patches', 'dayOfWeek', {
      type: Sequelize.ARRAY(Sequelize.INTEGER), // Array of integers
      allowNull: true, // This column can be null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('patches', 'dayOfWeek');
  },
};

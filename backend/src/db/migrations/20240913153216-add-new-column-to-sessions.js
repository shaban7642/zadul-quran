'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'joinedAt', {
      type: Sequelize.DATE,
      allowNull: true, // Define if the column can be NULL or not
      defaultValue: null, // Set default value (optional)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sessions', 'joinedAt');
  },
};

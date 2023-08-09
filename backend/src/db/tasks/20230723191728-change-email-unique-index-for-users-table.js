'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, drop the default unique constraint on the email column
    await queryInterface.removeConstraint('users', 'users_email_key', {
      logging: console.log,
    });

    // Then, create a new unique index with a filter to exclude soft-deleted records
    await queryInterface.addIndex('users', ['email'], {
      type: 'unique',
      where: {
        deletedAt: null,
      },
      name: 'unique_email_without_deleted',
      logging: console.log,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

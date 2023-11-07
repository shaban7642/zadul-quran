'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'book', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'unit', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'topic', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'level', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'notes', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'homework', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'newWords', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'expressions', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'rules', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'memorization', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'revision', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'tajweed', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'recitation', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'reading', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('reports', 'memorizationLevel', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'revisionLevel', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('reports', 'readingLevel', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reports', 'book');
    await queryInterface.removeColumn('reports', 'unit');
    await queryInterface.removeColumn('reports', 'topic');
    await queryInterface.removeColumn('reports', 'level');
    await queryInterface.removeColumn('reports', 'notes');
    await queryInterface.removeColumn('reports', 'homework');
    await queryInterface.removeColumn('reports', 'newWords');
    await queryInterface.removeColumn('reports', 'expressions');
    await queryInterface.removeColumn('reports', 'rules');
    await queryInterface.removeColumn('reports', 'memorization');
    await queryInterface.removeColumn('reports', 'revision');
    await queryInterface.removeColumn('reports', 'tajweed');
    await queryInterface.removeColumn('reports', 'recitation');
    await queryInterface.removeColumn('reports', 'reading');
    await queryInterface.removeColumn('reports', 'memorizationLevel ');
    await queryInterface.removeColumn('reports', 'revisionLevel ');
    await queryInterface.removeColumn('reports', 'readingLevel ');
  },
};

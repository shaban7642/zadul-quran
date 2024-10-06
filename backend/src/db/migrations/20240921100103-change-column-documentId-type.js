'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a new temporary column for the array type
    await queryInterface.addColumn('reports', 'documentId_temp', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
    });

    // Step 2: Migrate data from old column to new array column
    // We'll move existing `documentId` into the new column as a single-element array
    await queryInterface.sequelize.query(`
      UPDATE "reports"
      SET "documentId_temp" = ARRAY["documentId"]
      WHERE "documentId" IS NOT NULL
    `);

    // Step 3: Drop the old `documentId` column
    await queryInterface.removeColumn('reports', 'documentId');

    // Step 4: Rename the new column to `documentId`
    await queryInterface.renameColumn(
      'reports',
      'documentId_temp',
      'documentId'
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Step 1: Add back the original column with INTEGER type
    await queryInterface.addColumn('reports', 'documentId_temp', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Step 2: Migrate data back from the array column to the old INTEGER column
    // We'll extract the first element from the array
    await queryInterface.sequelize.query(`
      UPDATE "reports"
      SET "documentId_temp" = "documentId"[1]
      WHERE "documentId" IS NOT NULL
    `);

    // Step 3: Drop the array-type column
    await queryInterface.removeColumn('reports', 'documentId');

    // Step 4: Rename the temp column back to `documentId`
    await queryInterface.renameColumn(
      'reports',
      'documentId_temp',
      'documentId'
    );
  },
};

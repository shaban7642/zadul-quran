const sourcePath = './dev';

const permissions = require(`${sourcePath}/permissions.json`);
const roles = require(`${sourcePath}/roles.json`);
const rolePermissions = require(`${sourcePath}/rolePermissions.json`);

module.exports = {
  up: (queryInterface) => {
    const now = new Date();
    const timestamps = {
      createdAt: now,
      updatedAt: now,
    };

    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        console.log('Seeding roles...');
        await queryInterface.bulkInsert(
          'roles',
          roles.map((data) => ({
            ...data,
            ...timestamps,
          })),
          { transaction }
        );

        console.log('Seeding permissions...');
        await queryInterface.bulkInsert(
          'permissions',
          permissions.map((data) => ({
            ...data,
            ...timestamps,
          })),
          { transaction }
        );

        console.log('Seeding rolePermissions...');
        await queryInterface.bulkInsert(
          'rolePermissions',
          rolePermissions.map((data) => ({
            ...data,
            ...timestamps,
          })),
          { transaction }
        );
      } catch (err) {
        console.log(err);
        transaction.rollback();
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        console.log('Unseeding roles...');
        await queryInterface.bulkDelete('roles', null, { transaction });

        console.log('Unseeding permissions...');
        await queryInterface.bulkDelete('permissions', null, { transaction });

        console.log('Unseeding rolePermissions...');
        await queryInterface.bulkDelete('rolePermissions', null, {
          transaction,
        });

        console.log('Unseeding expenseClaimPaymentTypes...');
        await queryInterface.bulkDelete('expenseClaimPaymentTypes', null, {
          transaction,
        });
      } catch (err) {
        console.log(err);
        transaction.rollback();
      }
    });
  },
};

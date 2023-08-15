'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.sequelize.query(
        `
          INSERT INTO "rolePermissions"("roleId", "permissionId", "createdAt", "updatedAt")
          SELECT roles.id, permissions.id, NOW(), NOW() FROM roles, permissions WHERE roles.name IN( 'super_admin') and permissions.name IN('reports:read', 'reports:create', 'reports:update', 'reports:delete');
        `
      ),
    ]);
  },
  down: () => {},
};

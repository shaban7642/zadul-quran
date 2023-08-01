const permissions = [
  {
    name: 'settings:read',
  },
  {
    name: 'settings:create',
  },
  {
    name: 'settings:update',
  },
  {
    name: 'settings:delete',
  },
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const timestamps = {
      createdAt: now,
      updatedAt: now,
    };
    await queryInterface.bulkInsert(
      'permissions',
      permissions.map((permission) => ({
        ...permission,
        ...timestamps,
      })),
      {}
    );
  },
  down: () => {},
};

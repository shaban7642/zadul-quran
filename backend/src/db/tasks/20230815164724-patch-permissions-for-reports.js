const permissions = [
  {
    name: 'reports:read',
  },
  {
    name: 'reports:create',
  },
  {
    name: 'reports:update',
  },
  {
    name: 'reports:delete',
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

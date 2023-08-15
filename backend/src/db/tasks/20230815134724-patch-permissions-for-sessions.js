const permissions = [
  {
    name: 'sessions:read',
  },
  {
    name: 'sessions:create',
  },
  {
    name: 'sessions:update',
  },
  {
    name: 'sessions:delete',
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

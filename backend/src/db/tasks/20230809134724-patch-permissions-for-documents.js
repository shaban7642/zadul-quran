const permissions = [
  {
    name: 'documents:read',
  },
  {
    name: 'documents:create',
  },
  {
    name: 'documents:update',
  },
  {
    name: 'documents:delete',
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

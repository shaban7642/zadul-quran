const permissions = [
  {
    name: 'departments:read',
  },
  {
    name: 'departments:create',
  },
  {
    name: 'departments:update',
  },
  {
    name: 'departments:delete',
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

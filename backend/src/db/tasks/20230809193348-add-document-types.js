const types = [
  {
    name: 'books',
  },
  {
    name: 'reports',
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
      'documentTypes',
      types.map((permission) => ({
        ...permission,
        ...timestamps,
      })),
      {}
    );
  },
  down: () => {},
};

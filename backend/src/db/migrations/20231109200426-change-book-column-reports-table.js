module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('reports', 'book'),
      queryInterface.addColumn('reports', 'bookId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'documents',
          key: 'id',
        },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('reports', 'bookId'),
      queryInterface.addColumn('reports', 'book', {
        type: Sequelize.STRING,
      }),
    ]);
  },
};

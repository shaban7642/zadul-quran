module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('reports', 'book'),
      queryInterface.addColumn('reports', 'bookId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'documents',
          key: 'id',
          as: 'bookId',
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

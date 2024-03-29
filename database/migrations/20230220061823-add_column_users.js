
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'users',
        'type',
        {
          type: Sequelize.SMALLINT,
        },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'type');
  },
};

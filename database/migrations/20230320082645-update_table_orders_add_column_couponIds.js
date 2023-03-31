
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'orders',
        'couponIds',
        {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('orders', 'couponIds');
  },
};

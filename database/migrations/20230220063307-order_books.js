const constant = require('./../../app/utils/constant.utils.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('order_books', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      orderId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      bookId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      unitPrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      activated: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
      },
      deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
      },
      createdBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      deletedBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('order_books');
  },
};

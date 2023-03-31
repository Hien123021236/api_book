const constant = require('./../../app/utils/constant.utils.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      discountValue: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      discountPercent: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      discountMin: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      discountMax: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: constant.COUPON_TYPE_ENUM.VALUE,
      },
      code: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
    return queryInterface.dropTable('coupons');
  },
};

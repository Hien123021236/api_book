// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Order extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Order.hasMany(models.OrderBook, {
        foreignKey: 'orderId',
        as: 'orderBooks',
      });
    }

    // allow attributes for search
    // static getAttributesForSearch(){
    //   return ['title'];
    // }

    // // allow attributes for sort
    // static getAttributesForSort(){
    //   return ['title', 'ipAddress', 'activated', 'createdAt'];
    // }

    // // allow attributes for filter
    // static getAttributesForFilter(){
    //   return ['title', 'activated', 'deleted', 'createdAt'];
    // }
  }

  Order.init({
    id: {
      type: Sequelize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    },
    totalAmount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activated: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: constant.BOOLEAN_ENUM.TRUE,
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
  }, {
    sequelize: database,
    tableName: 'orders',
  });

  return Order;
};

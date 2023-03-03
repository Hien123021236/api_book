// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class OrderBook extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.OrderBook.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
      });
      models.OrderBook.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
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

  OrderBook.init({
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
      validate: {
        notNull: {
          args: true,
          msg: 'unit price must be not null',
        },
        isInt: {
          args: true,
          msg: 'unit price must be a number',
        },
      },
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'quantity must be not null',
        },
        isInt: {
          args: true,
          msg: 'quantity must be a number',
        },
      },
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
    tableName: 'order_books',
  });

  return OrderBook;
};

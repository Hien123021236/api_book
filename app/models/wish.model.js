// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Wish extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Wish.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      });
      models.Wish.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }

    // allow attributes for search
    static getAttributesForSearch() {
      return ['id'];
    }

    // // allow attributes for sort
    static getAttributesForSort() {
      return ['id', 'activated', 'createdAt'];
    }

    // allow attributes for filter
    static getAttributesForFilter() {
      return ['id', 'activated', 'deleted', 'createdAt'];
    }
  }

  Wish.init({
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
    bookId: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
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
    tableName: 'wishes',
  });

  return Wish;
};

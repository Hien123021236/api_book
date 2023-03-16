// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Category extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Category.belongsToMany(models.Book, {
        through: models.CategoryBook,
        as: 'books',
      });
    }

    // allow attributes for search
    static getAttributesForSearch() {
      return ['name'];
    }

    // // allow attributes for sort
    static getAttributesForSort() {
      return ['name', 'activated', 'createdAt'];
    }

    // allow attributes for filter
    static getAttributesForFilter() {
      return ['name', 'activated', 'deleted', 'createdAt'];
    }
  }

  Category.init({
    id: {
      type: Sequelize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'name must be not null',
        },
        len: {
          args: [1, 255],
          msg: 'name must be not empty and less than 255 characters',
        },
      },
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
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
    tableName: 'categories',
  });

  return Category;
};

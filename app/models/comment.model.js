// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Comment extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Comment.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      });
      models.Comment.belongsTo(models.User, {
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
      return ['id', 'bookId', 'activated', 'deleted', 'createdAt'];
    }
  }

  Comment.init({
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
    star: {
      type: Sequelize.DataTypes.SMALLINT,
      defaultValue: 0,
      validate: {
        isRange: function(value, next) {
          const val = parseInt(value);
          if (val < 1 || val > 5) {
            next(new Error('star must between 1 and 5'));
          }
          next();
        },
      },
    },
    comment: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'comment must be not null',
        },
        len: {
          args: [1, 500],
          msg: 'comment must be between 1 and 500 characters',
        },
      },
    },
    displayName: {
      type: Sequelize.DataTypes.STRING(64),
      allowNull: true,
      validate: {
        len: {
          args: [0, 64],
          msg: 'display name must between 0 and 64 characters',
        },
      },
    },
    verified: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: constant.BOOLEAN_ENUM.FALSE,
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
    tableName: 'comments',
  });

  return Comment;
};

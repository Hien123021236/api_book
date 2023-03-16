// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Coupon extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
    //   models.Wish.belongsTo(models.Book, {
    //     foreignKey: 'bookId',
    //     as: 'book',
    //   });
    //   models.Wish.belongsTo(models.User, {
    //     foreignKey: 'userId',
    //     as: 'user',
    //   });
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

  Coupon.init({
    id: {
      type: Sequelize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: 'name must be not null',
        },
        len: {
          args: [1, 255],
          msg: 'name must be between 1 and 255 characters',
        },
        isUppercase: {
          args: true,
          msg: 'name must be uppercase',
        },
      },
    },
    expiry: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'expiry date must be not null',
        },
        isDate: {
          args: true,
          msg: 'expiry date must be a date string',
        },
      },
    },
    discount: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'discount must be not null',
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
    tableName: 'coupons',
  });

  return Coupon;
};

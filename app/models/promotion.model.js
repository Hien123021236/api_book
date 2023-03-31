// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Promotion extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Promotion.belongsToMany(models.Book, {
        through: 'promotion_books',
        foreignKey: 'promotionId',
        otherKey: 'bookId',
        as: 'books',
      });
    }

    // allow attributes for search
    static getAttributesForSearch() {
      return ['name'];
    }

    // // allow attributes for sort
    static getAttributesForSort() {
      return ['id', 'name', 'discountValue', 'discountPercent', 'activated', 'createdAt'];
    }

    // allow attributes for filter
    static getAttributesForFilter() {
      return ['id', 'name', 'discountValue', 'discountPercent', 'activated', 'createdAt'];
    }
  }

  Promotion.init({
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
          msg: 'name must be between 1 and 255 characters',
        },
        isUnique: function(value, next) {
          Promotion.findOne({
            where: {
              id: {[Sequelize.Op.ne]: this.id},
              name: value,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            attributes: ['id'],
          }).then(function(result) {
            if (result) {
              next(new Error('name must be unique'));
            }
            next();
          });
        },
      },
    },
    startDate: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          msg: 'start date must be a date string',
        },
      },
    },
    endDate: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      validate: {
        isDate: {
          args: true,
          msg: 'end date must be a date string',
        },
      },
    },
    discountValue: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'discount value must be a number',
        },
      },
    },
    discountPercent: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'discount percent must be a number',
        },
        max: 100,
        min: 0,
        check(value, next) {
          if (parseInt(value) < 0 || parseInt(value) > 100) {
            next(new Error('discount Percent must be between 0 to 100 .'));
          }
          next();
        },
      },
    },
    discountMin: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'discount min must be a number',
        },
      },
    },
    discountMax: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'discount max must be a number',
        },
      },
    },
    type: {
      type: Sequelize.DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: constant.PROMOTION_TYPE_ENUM.VALUE,
      validate: {
        notNull: {
          args: true,
          msg: 'type must be not null',
        },
        isInt: {
          msg: 'type must be a number',
        },
        isIn: {
          args: [Object.values(constant.PROMOTION_TYPE_ENUM)],
          msg: `type must be one of (${Object.values(constant.PROMOTION_TYPE_ENUM).toString()})`,
        },
      },
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
  }, {
    sequelize: database,
    tableName: 'promotions',
    validate: {
      checkType(next) {
        if (parseInt(this.type) == constant.PROMOTION_TYPE_ENUM.VALUE && !this.discountValue) {
          next(new Error('discount value must be not null'));
        } else if (parseInt(this.type) == constant.PROMOTION_TYPE_ENUM.PERCENT && !this.discountPercent) {
          next(new Error('discount percent must be not null'));
        }
        next();
      },
    },
  });

  return Promotion;
};

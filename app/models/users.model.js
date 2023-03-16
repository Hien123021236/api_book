// third party components
const Sequelize = require('sequelize');
const validator = require('validator');
const jsonWebToken = require('jsonwebtoken');
const bCrypt = require('bcryptjs');
// our components
const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');
const pieces = require('../utils/pieces.utils');

module.exports = (database, DataTypes) => {
  class User extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders',
      });
      models.User.hasMany(models.Wish, {
        foreignKey: 'userId',
        as: 'wishes',
      });
      models.User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',
      });
    }

    // allow attributes for search
    static getAttributesForSearch() {
      return ['name', 'email'];
    }

    // allow attributes for sort
    static getAttributesForSort() {
      return ['name', 'email', 'ipAddress', 'activated', 'createdAt'];
    }

    // allow attributes for filter
    static getAttributesForFilter() {
      return ['name', 'email', 'ipAddress', 'activated', 'deleted', 'createdAt'];
    }

    static signToken(user) {
      return jsonWebToken.sign({
        id: user.id,
        username: user.username,
        type: user.type,
      },
      config.jwtAuthKey,
      {
        expiresIn: config.tokenLoginExpiredDays,
      });
    }

    static hashPassword(password) {
      return bCrypt.hashSync(password, 10);
    }

    static generateSecretKey() {
      return pieces.genRandomString(32);
    }

    static comparePassword(password, hashPassword) {
      return bCrypt.compareSync(password, hashPassword);
    }

    static verifyToken(token) {
      return jsonWebToken.verify(token, config.jwtAuthKey);
    }

    generateToken() {
      return User.signToken(this);
    }
  }

  User.init({
    id: {
      type: Sequelize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'username must be not null',
        },
        len: {
          args: [3, 24],
          msg: 'username must be between 3 and 24 characters',
        },
      },
    },
    password: {
      type: Sequelize.DataTypes.STRING(128),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password must be not null',
        },
        len: {
          args: [6, 10],
          msg: 'password must be between 6 and 10 characters',
        },
        is: {
          args: '^[a-zA-Z0-9_.-]*$',
          msg: 'password must be only contains numbers and letters',
        },
      },
    },
    verifyToken: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: Sequelize.DataTypes.STRING(64),
      allowNull: true,
      validate: {
        len: {
          args: [0, 64],
          msg: 'email must less than 64 characters',
        },
        isEmail: function(value, next) {
          if (value && !validator.isEmail(value)) {
            next(new Error('email must be email format'));
          }
          next();
        },
        isUnique: function(value, next) {
          User.findOne({
            where: {
              email: value,
            },
          }).then(function(user) {
            if (user) {
              next(new Error('email duplicated'));
            } else {
              next();
            }
          }).catch(function(error) {
            next(error);
          });
        },
      },
    },
    type: {
      type: Sequelize.DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: constant.USER_TYPE_ENUM.USER,
      comment: JSON.stringify(constant.USER_TYPE_ENUM),
      validate: {
        isIn: {
          args: [Object.values(constant.USER_TYPE_ENUM)],
          msg: `type must be in list user type (${Object.values(constant.USER_TYPE_ENUM).toString()})`,
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
    tableName: 'users',
  });

  return User;
};

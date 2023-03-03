// const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {User} = require('../models/index');
const constant = require('../utils/constant.utils');
// const supporter = require('../utils/supporter.utils');

module.exports = {

  create: function(data, callback) {
    try {
      User.build({
        username: data.username,
        password: data.password,
        type: parseInt(data.type),
      }).validate().then(function(user) {
        user.password = User.hashPassword(user.password);
        user.save({
          validate: false,
        }).then(function(result) {
          return callback(null, null, 200, null, result);
        }).catch(function(error) {
          return callback(true, 'query_fail', 400, error, null);
        });
      }).catch(function(validate) {
        const errors = validate.errors?.map(function(e) {
          return {
            name: e.path,
            message: e.message,
          };
        });
        return callback(1, 'invalid_input', 403, errors, null);
      });
    } catch (error) {
      return callback(1, 'create_user_fail', 400, error, null);
    }
  },

  getOne: function(id, accessUserId, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      User.findOne({
        attributes: ['id', 'username', 'createdAt', 'updatedAt', 'deletedAt'],
        where: {id: id},
      }).then(function(user) {
        if (user) {
          return callback(null, null, 200, null, user);
        } else {
          return callback(1, 'wrong_user', 400, 'wrong user', null);
        }
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_user_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, body, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.ADMIN) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const data = {};
      if (body.username != '' && body.username != null) {
        data.username = body.username;
      }
      if (body.password != '' && body.password != null) {
        data.password = body.password;
      }

      async.waterfall([

        // get user
        function(next) {
          User.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
          }).then(function(user) {
            if (!user) {
              return callback(1, 'wrong_user', 420, 'wrong user', null);
            }
            next(null, user);
          });
        },

        // update user
        function(user, next) {
          User.build(data).validate().then(function() {
            Object.assign(user, data);
            user.password = User.hashPassword(user.password);
            user.save({
              validate: false,
            }).then(function(user) {
              return next(null, user);
            }).catch(function(error) {
              return callback(true, 'query_fail', 400, error, null);
            });
          }).catch(function(validate) {
            const errors = validate.errors?.map(function(e) {
              return {
                name: e.path,
                message: e.message,
              };
            });
            return callback(1, 'invalid_input', 403, errors, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'update_user_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'update_user_fail', 400, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.ADMIN) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get user
        function(next) {
          User.findOne({
            attributes: {
              exclude: ['password'],
            },
            where: {
              id: id,
            },
          }).then(function(user) {
            if (!user) {
              return callback(1, 'wrong_user', 420, 'wrong user', null);
            }
            if (user.deleted) {
              return callback(1, 'user_deleted', 403, 'user has been deleted', null);
            }
            next(null, user);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete user
        function(user, next) {
          user.deleted = constant.BOOLEAN_ENUM.TRUE;
          user.deletedAt = moment().format();
          user.save().then(function(user) {
            next(null, user);
          }).catch(function(error) {
            return callback(true, 'delete_user_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'delete_user_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'delete_user_fail', 400, error, null);
    }
  },

  login: function(username, password, callback) {
    User.findOne({
      where: {username: username},
    }).then(function(user) {
      if (!user) {
        return callback(1, 'wrong_user', 400, 'wrong user', null);
      }
      const check = User.comparePassword(password, user.password);
      if (check) {
        return callback(null, null, 200, null, {
          id: user.id,
          username: user.username,
          token: User.signToken(user),
        });
      } else {
        return callback(1, 'wrong_password', 400, 'wrong password', null);
      }
    }).catch(function(error) {
      return callback(1, 'login_fail', 400, error, null);
    });
  },
};

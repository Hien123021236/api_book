const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {User, Wish} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');
const Mailer = require('../mail/mail.service');
const config = require('../configs/general.config');

module.exports = {

  create: function(data, callback) {
    try {
      User.build({
        username: data.username,
        password: data.password,
        email: data.email,
      }).validate().then(function(user) {
        user.password = User.hashPassword(user.password);
        user.save({
          validate: false,
        }).then(function(result) {
          Mailer.sendMailForRegister({
            to: result.email,
            data: {
              username: result.username,
              url: `${config.apiUrl}/v1/users/verify-email?token=${result.generateToken()}`,
            },
          }, function(error) {
            if (error) {
              return callback(true, 'send_verify_mail_fail', 400, error, null);
            }
          });
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

  createByAdmin: function(accessUserId, accessUserType, data, callback) {
    if (accessUserType< constant.USER_TYPE_ENUM.ADMIN) {
      return callback(1, 'permission_denied', 403, 'permission denied', null);
    }
    try {
      User.build({
        username: data.username,
        password: data.password,
        email: data.email,
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
        attributes: ['id', 'username', 'email', 'type', 'createdAt', 'updatedAt', 'deleted'],
        where: {id: id},
      }).then(function(user) {
        if (user) {
          if (user.deleted != constant.BOOLEAN_ENUM.FALSE) {
            return callback(1, 'deleted_user', 403, 'user has been deleted', null);
          }
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

  getAll: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query ={
        attributes: ['id', 'username', 'password', 'email', 'type', 'createdAt', 'updatedAt'],
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      supporter.pasteQuery(User, query, filter, sort, search, page, limit);
      User.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_users_fail', 400, error, null);
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
      if (body.email != '' && body.email != null) {
        data.email = body.email;
      }
      if (body.type != '' && body.type != null) {
        data.type = body.type;
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

  login: function(data, callback) {
    try {
      const where = {
        [Sequelize.Op.or]: [
          {username: data.username_or_email || ''},
          {email: data.username_or_email || ''},
        ],
      };

      User.findOne({
        where: where,
      }).then((user) => {
        if (!user) {
          return callback(1, 'wrong_user', 400, 'Wrong user', null);
        }
        if (user.deleted === constant.BOOLEAN_ENUM.TRUE) {
          return callback(1, 'deleted_user', 400, 'User has been deleted', null);
        }
        if (!User.comparePassword(data.password, user.password)) {
          return callback(1, 'wrong_user', 400, 'Wrong user', null);
        }
        if (!user.verified) {
          return callback(1, 'user_unverified', 400, 'user unverified', null);
        }
        return callback(null, null, 200, null, user);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'login_fail', 400, error, null);
    }
  },

  verifyEmailToken: function(accessUserId, accessUserType, token, callback) {
    if (!token) {
      return callback(1, 'invalid_input', 403, 'token is incorrect', null);
    }

    const decode = User.verifyToken(token);
    if (!decode) {
      return callback(1, 'verify_fail', 400, 'verify fail', null);
    }
    async.waterfall([
      // get user
      function(next) {
        User.findOne({
          where: {id: decode.id},
        }).then((user) => {
          if (!user) {
            return callback(1, 'wrong_user', 400, 'Wrong user', null);
          }
          if (user.deleted) {
            return callback(1, 'deleted_user', 400, 'User has been deleted', null);
          }
          if (user.verified) {
            return callback(1, 'user_verified', 400, 'User verified', null);
          }
          next(null, user);
        }).catch(function(error) {
          return callback(1, 'query_fail', 400, error, null);
        });
      },
      // update user
      function(user, next) {
        user.verified = constant.BOOLEAN_ENUM.TRUE,
        user.verifyToken = null;
        user.updatedAt = moment().format();
        user.save({validate: false}).then(function(user) {
          return callback(null, null, 200, null, 'verify email success');
        }).catch(function(error) {
          return callback(1, 'verify email fail', 400, error, null);
        });
      },
    ]);
  },

  verify: function(token, callback) {
    try {
      if (!token) {
        return callback(1, 'invalid_input', 403, 'Missing token', null);
      }

      const result = User.verifyToken(token);
      if (!result) {
        return callback(1, 'verify_fail', 400, null, null);
      }

      User.findOne({
        where: {id: result.id},
      }).then((user) => {
        if (user) {
          if (user.deleted === constant.BOOLEAN_ENUM.TRUE) {
            return callback(1, 'deleted_user', 400, 'User has been deleted', null);
          } else {
            return callback(null, null, 200, null, user);
          }
        } else {
          return callback(1, 'wrong_user', 400, 'Wrong user', null);
        }
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'verify_fail', 400, error, null);
    }
  },

  requestPasswordReset: function(email, callback) {
    try {
      if (!email) {
        return callback(1, 'invalid_input', 403, 'email is incorrect', null);
      }

      async.waterfall([
        // get user
        function(next) {
          User.findOne({
            where: {email: email},
          }).then((user) => {
            if (!user) {
              return callback(1, 'wrong_user', 400, 'Wrong user', null);
            }
            if (user.deleted) {
              return callback(1, 'deleted_user', 400, 'User has been deleted', null);
            }
            next(null, user);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // create verifyToken and save
        function(user, next) {
          user.verifyToken = user.generateToken();
          user.updatedAt = moment().format();
          user.save({validate: false}).then(function(user) {
            next(null, user);
          }).catch(function(error) {
            return callback(1, 'update user fail', 400, error, null);
          });
        },
        // create email forgot password
        function(user, next) {
          Mailer.sendMailForResetPassword({
            to: user.email,
            data: {
              username: user.username,
              url: `${config.apiUrl}/v1/users/reset-password?email=${user.email}&token=${user.verifyToken}`,
            },
          }, function(error) {
            if (error) {
              return callback(true, 'send_verify_mail_fail', 400, error, null);
            }
          });
          next(null, user);
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'create_request_fail', 400, 'create email to change password fail', null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'create_request_fail', 400, error, null);
    }
  },

  resetPassword: function(accessUserId, accessUserType, email, token, newPassword, callback) {
    if (!(token && email && newPassword)) {
      return callback(1, 'invalid_input', 403, 'token, email and new password is incorrect', null);
    }
    const decode = User.verifyToken(token);
    if (!decode) {
      return callback(1, 'verify_fail', 400, 'verify fail', null);
    }
    async.waterfall([
      // get user
      function(next) {
        User.findOne({
          where: {
            id: decode.id,
          },
        }).then((user) => {
          if (!user) {
            return callback(1, 'wrong_user', 400, 'Wrong user', null);
          }
          if (user.deleted) {
            return callback(1, 'deleted_user', 400, 'User has been deleted', null);
          }

          if (user.verifyToken==null) {
            return callback(1, 'verify token null', 400, 'verify token null', null);
          }
          next(null, user);
        }).catch(function(error) {
          return callback(1, 'query_fail', 400, error, null);
        });
      },
      // update user
      function(user, next) {
        user.password = User.hashPassword(newPassword);
        user.verifyToken = null;
        user.updatedAt = moment().format();
        user.save({validate: false}).then(function(user) {
          return callback(null, null, 200, null, 'Password reset was successful');
        }).catch(function(error) {
          return callback(1, 'Password reset fail', 400, error, null);
        });
      },
    ]);
  },

  deleteUserWishes: function(accessUserId, accessUserType, userId, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && accessUserId != userId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      Wish.destroy({where: {userId: userId}}).then(function() {
        return callback(null, null, 200, null, null);
      }).catch(function(error) {
        return callback(true, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'delete_wishes_fail', 400, error, null);
    }
  },
};

// const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Coupon} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {
  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      Coupon.build({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        discountValue: data.discountValue,
        discountPercent: data.discountPercent,
        discountMin: data.discountMin,
        discountMax: data.discountMax,
        activated: data.activated,
        type: parseInt(data.type),
        code: data.code,
        quantity: data.quantity,
        createdBy: accessUserId,
      }).validate().then(function(coupon) {
        coupon.save({
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
        return callback(1, 'invalid_input', 400, errors, null);
      });
    } catch (error) {
      return callback(1, 'create_coupon_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      Coupon.findOne({
        where: {id: id},
      }).then(function(coupon) {
        if (!coupon) {
          return callback(1, 'wrong_coupon,', 400, 'wrong coupon', null);
        }
        if (coupon.deleted) {
          return callback(1, 'coupon_deleted,', 400, 'coupon has been deleted', null);
        }
        return callback(null, null, 200, null, coupon);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_coupon_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query ={
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };
      supporter.pasteQuery(Coupon, query, filter, sort, search, page, limit);
      Coupon.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_coupons_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, body, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      async.waterfall([
        // get coupon
        function(next) {
          Coupon.findOne({
            where: {
              id: id,
            },
          }).then(function(coupon) {
            if (!coupon) {
              return callback(1, 'wrong_coupon', 400, 'wrong coupon', null);
            }
            if (coupon.deleted) {
              return callback(1, 'coupon_deleted', 400, 'coupon has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && coupon.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, coupon);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },

        // update coupon
        function(coupon, next) {
          const data = {...coupon.dataValues};
          for (const attr in coupon.get()) {
            if (body[attr] != '' && body[attr] != null && body[attr] != undefined) {
              data[attr] = body[attr];
            }
          }
          Coupon.build(data).validate().then(function() {
            Object.assign(coupon, data);
            coupon.updatedAt = moment().format();
            coupon.save({
              validate: false,
            }).then(function(coupon) {
              next(null, coupon);
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
            return callback(1, 'invalid_input', 400, errors, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'update_coupon_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'update_coupon_fail', 400, error, null);
    }
  },
  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get coupon
        function(next) {
          Coupon.findOne({
            where: {
              id: id,
            },
          }).then(function(coupon) {
            if (!coupon) {
              return callback(1, 'wrong_coupon', 400, 'wrong coupon', null);
            }
            if (coupon.deleted) {
              return callback(1, 'coupon_deleted', 400, 'coupon has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && coupon.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, coupon);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete coupon
        function(coupon, next) {
          coupon.deleted = constant.BOOLEAN_ENUM.TRUE;
          coupon.deletedAt = moment().format();
          coupon.save().then(function(coupon) {
            next(null, coupon);
          }).catch(function(error) {
            return callback(true, 'delete_coupon_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'delete_coupon_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'delete_coupon_fail', 400, error, null);
    }
  },
};

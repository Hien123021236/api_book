// const Sequelize = require('sequelize');
// const async = require('async');
// const config = require('../configs/general.config');
const {OrderBook} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {

  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      OrderBook.build({
        orderId: data.orderId,
        bookId: data.bookId,
        unitPrice: data.unitPrice,
        quantity: data.quantity,
        createdBy: accessUserId,
      }).validate().then(function(orderBook) {
        orderBook.save({
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
      return callback(1, 'create_orderBook_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, id, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      OrderBook.findOne({
        where: {id: id},
      }).then(function(orderBook) {
        if (!orderBook) {
          return callback(1, 'wrong_orderBook,', 400, 'wrong order book', null);
        }
        if (order.deleted) {
          return callback(1, 'orderBook_deleted,', 403, 'order book has been deleted', null);
        }
        if (order.createdBy != accessUserId) {
          return callback(1, 'permission_denied,', 403, 'permission denied', null);
        }
        return callback(null, null, 200, null, order);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_orderBook_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, fillter, sort, search, page, limit, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const query ={
        where: {
          createdBy: accessUserId,
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      supporter.pasteQuery(OrderBook, query, fillter, sort, search, page, limit);

      OrderBook.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_order-books_fail', 400, error, null);
    }
  },

  update: function(accessUserId, id, data, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      OrderBook.update({
        orderId: data.orderId,
        bookId: data.bookId,
        unitPrice: data.unitPrice,
        quantity: data.quantity,
      }, {
        validate: true,
        where: {id: id},
      }).then(function([updatedCount]) {
        if (updatedCount) {
          OrderBook.findOne({
            where: {id: id},
          }).then(function(orderBook) {
            return callback(null, null, 200, null, orderBook);
          }).catch(function(error) {
            return callback(1, 'get_orderBook_fail', 403, error, null);
          });
        } else {
          return callback(1, 'wrong_orderBook', 420, 'wrong order book', null);
        }
      }).catch(function(error) {
        const validErrors = error.errors?.map(function(e) {
          return {
            name: e.path,
            message: e.message,
          };
        });
        return callback(1, 'invalid_input', 403, validErrors || error, null);
      });
    } catch (error) {
      return callback(1, 'update_orderBook_fail', 420, error, null);
    }
  },

  delete: function(accessUserId, id, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      OrderBook.update({
        deleted: constant.BOOLEAN_ENUM.TRUE,
      }, {
        where: {
          id: id,
          createdBy: accessUserId,
        },
      }).then(function(result) {
        if (!result[0]) {
          return callback(1, 'permission_denied', 403, 'permission denied', null);
        } else {
          return callback(null, null, 200, null, result);
        }
      }).catch(function(error) {
        return callback(true, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'delete_orderBook_fail', 400, error, null);
    }
  },
};

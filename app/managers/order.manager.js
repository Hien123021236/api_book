const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Order, OrderBook, Book} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {

  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const items = data.items; // [{id: "", qty: 1}]

      async.waterfall([
        // get books
        function(next) {
          Book.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: items.map((i) => i.id),
              },
            },
          }).then(function(books) {
            if (books.length < items.length) {
              return callback(1, 'invalid_items', 400, 'book id is incorrect', null);
            }
            next(null, books);
          }).catch(function(error) {
            return callback(1, 'get_books_fail', 400, error, null);
          });
        },
        // create order
        function(books, next) {
          Order.create({
            userId: data.userId,
            createdBy: accessUserId,
          }).then(function(order) {
            next(null, books, order);
          }).catch(function(error) {
            return callback(1, 'create_order_fail', 400, error, null);
          });
        },
        // create order books
        function(books, order, next) {
          OrderBook.bulkCreate(items.map((i) => {
            return {
              orderId: order.id,
              bookId: i.id,
              quantity: i.qty,
              unitPrice: books.find((b) => b.id == i.id)?.price,
              createdBy: accessUserId,
            };
          })).then(function(orderBooks) {
            next(null, order, orderBooks);
          }).catch(function(error) {
            return callback(1, 'create_order_book_fail', 400, error, null);
          });
        },
        // update total amount
        function(order, orderBooks, next) {
          order.totalAmount = orderBooks.reduce((sum, orderBook)=> sum + orderBook.unitPrice * orderBook.quantity, 0);
          order.save().then(function(order) {
            next(null, {
              ...order.dataValues,
              items: orderBooks,
            });
          }).catch(function(error) {
            return callback(1, 'update_total_amount_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'create_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'create_order_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      Order.findOne({
        where: {id: id},
        include: [
          {
            model: OrderBook,
            as: 'orderBooks',
            include: [
              {model: Book, as: 'book'},
            ],
          },
        ],
      }).then(function(order) {
        if (!order) {
          return callback(1, 'wrong_order,', 400, 'wrong order', null);
        }
        if (order.userId != accessUserId && accessUserType < constant.USER_TYPE_ENUM.ADMIN) {
          return callback(1, 'permission_denied', 403, 'permission denied', null);
        }
        if (order.deleted) {
          return callback(1, 'order_deleted,', 403, 'order has been deleted', null);
        }
        if (order.createdBy != accessUserId) {
          return callback(1, 'permission_denied,', 403, 'permission denied', null);
        }
        return callback(null, null, 200, null, order);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_order_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, fillter, sort, search, pageNumber, pageSize, callback) {
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

      supporter.pasteQuery(Order, query, fillter, sort, search, pageNumber, pageSize);

      Order.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, pageNumber, pageSize);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_orders_fail', 400, error, null);
    }
  },

  update: function(accessUserId, id, data, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      Order.update({
        userId: data.userId,
        orderDay: data.orderDay,
      }, {
        validate: true,
        where: {id: id},
      }).then(function([updatedCount]) {
        if (updatedCount) {
          Order.findOne({
            where: {id: id},
          }).then(function(order) {
            return callback(null, null, 200, null, order);
          }).catch(function(error) {
            return callback(1, 'get_order_fail', 403, error, null);
          });
        } else {
          return callback(1, 'wrong_order', 420, 'wrong order', null);
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
      return callback(1, 'update_order_fail', 420, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.ADMIN) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      async.waterfall([
        // get order
        function(next) {
          Order.findOne({
            where: {
              id: id,
            },
          }).then(function(order) {
            if (!order) {
              return callback(1, 'wrong_order', 403, 'wrong order', null);
            }
            if (order.deleted) {
              return callback(1, 'order_deleted', 403, 'order has been deleted', null);
            }
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete order
        function(order, next) {
          order.deleted = constant.BOOLEAN_ENUM.TRUE;
          order.deletedAt = moment().format();
          order.save().then(function(order) {
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete order books
        function(order, next) {
          OrderBook.update({
            deleted: constant.BOOLEAN_ENUM.TRUE,
            deletedAt: moment().format(),
          }, {
            where: {
              orderId: order?.id,
            },
          }).then(function() {
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
      ], function(error, order) {
        if (error) {
          return callback(1, 'delete_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, order);
      });
    } catch (error) {
      return callback(1, 'delete_order_fail', 400, error, null);
    }
  },
};

const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');
const _ = require('lodash');


// const config = require('../configs/general.config');
const {Order, OrderBook, Book, Coupon} = require('../models/index');
const bookManager = require('../managers/book.manager');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

function calcTotalAmountAfterDiscount(totalAmount, coupons) {
  if (!coupons.length) {
    return totalAmount;
  }
  let totalDiscountPrice = 0;
  coupons.forEach((coupon) => {
    let discountPrice = 0;
    if (coupon.type == constant.COUPON_TYPE_ENUM.PERCENT) {
      discountPrice = parseInt(totalAmount) * (parseInt(coupon.discountPercent)) / 100;
    } else
    if (coupon.type == constant.COUPON_TYPE_ENUM.VALUE) {
      discountPrice = parseInt(coupon.discountValue);
    }

    if (coupon.discountMin && discountPrice < coupon.discountMin) {
      discountPrice = parseInt(coupon.discountMin);
    }
    if (coupon.discountMax && discountPrice > coupon.discountMax) {
      discountPrice = parseInt(coupon.discountMax);
    }
    totalDiscountPrice += discountPrice;
  });

  return totalAmount - totalDiscountPrice;
}

module.exports = {

  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const items = data.items; // [{id: "", qty: 1}]

      async.waterfall([
        // check books
        function(next) {
          if (!items.length) {
            next(null, []);
          } else {
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
          }
        },
        // create order
        function(books, next) {
          Order.create({
            userId: data?.userId,
            createdBy: accessUserId,
          }).then(function(order) {
            if (!order) {
              return callback(1, 'create_order_fail', 400, 'create order fail', null);
            }
            if (!books.length) {
              return callback(null, null, 200, null, order);
            }
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
      async.waterfall([
        // get order
        function(next) {
          Order.findOne({
            where: {id: id},
            include: [
              {
                model: OrderBook,
                as: 'orderBooks',
                include: [
                  {
                    model: Book,
                    as: 'book',
                    include: [
                      {
                        model: Promotion,
                        as: 'promotions',
                      },
                    ],
                  },
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
            next(null, order);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // get coupons
        function(order, next) {
          const couponIds = JSON.parse(order.couponIds ||null) ||[];
          Coupon.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: couponIds,
              },
              deleted: constant.BOOLEAN_ENUM.FALSE,
              [Sequelize.Op.or]: [
                {startDate: null},
                {startDate: {
                  [Sequelize.Op.lte]: moment().format(),
                }},
              ],
              [Sequelize.Op.or]: [
                {startDate: null},
                {endDate: {
                  [Sequelize.Op.gte]: moment().format(),
                }},
              ],
            },
          }).then(function(coupons) {
            order.couponIds = couponIds.filter((id) => coupons.find((c) => c.id == id));
            next(null, order, coupons);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // calc price
        function(order, coupons, next) {
          if (order.status == constant.ORDER_STATUS_ENUM.ORDERED) {
            order.orderBooks = order.orderBooks.map((orderBook) => {
              const promo = orderBook.book.promotions.at(0);
              orderBook.dataValues.oldPrice = orderBook.book.price;
              orderBook.dataValues.newPrice = bookManager.calcNewPrice(orderBook.book.price, promo);
            });
            order.dataValues.totalAmount = order.orderBooks.reduce((sum, ob)=> sum + ob.newPrice * ob.quantity, 0);
            order.dataValues.couponAmount = calcTotalAmountAfterDiscount(order.dataValues.totalAmount, coupons);
          }
          return callback(null, null, 200, null, order);
        },
      ]);
    } catch (error) {
      return callback(1, 'get_order_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const query ={
        where: {
          createdBy: accessUserId,
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      supporter.pasteQuery(Order, query, fillter, sort, search, page, limit);

      Order.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_orders_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, data, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      const items = data.items; // [{id: "", qty: 1}]
      async.waterfall([
        // get order , get books
        function(next) {
          async.parallel([
            function(next) {
              // get order
              Order.findOne({
                where: {
                  id: id,
                },
              }).then(function(order) {
                next(null, order);
              }).catch(function(error) {
                return callback(1, 'query_fail', 400, error, null);
              });
            },
            // get books
            function(next) {
              Book.findAll({
                where: {
                  id: {
                    [Sequelize.Op.in]: items.map((i)=>i.id),
                  },
                },
              }).then(function(books) {
                next(null, books);
              }).catch(function(error) {
                return callback(1, 'query_fail', 400, error, null);
              });
            },
          ], function(error, [order, books]) {
            if (!order) {
              return callback(1, 'wrong_order', 400, 'wrong order', null);
            }
            if (order.deleted) {
              return callback(1, 'order_deleted', 400, 'order has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && order.userId != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (order.status != constant.ORDER_STATUS_ENUM.ORDERED) {
              return callback(1, 'status_not_ordered ', 403, 'status not ordered', null);
            }
            if (books.length < items.length) {
              return callback(1, 'invalid_bookIds', 400, 'book id is incorrect', null);
            }
            next(error, order, books);
          });
        },
        // delete old order_books
        function(order, books, next) {
          OrderBook.destroy({
            where: {
              orderId: order.id,
            },
          }).then(function(result) {
            next(null, order, books);
          }).catch(function(error) {
            return callback(true, 'delete_order_books_fail', 400, error, null);
          });
        },
        // create new order_books
        function(order, books, next) {
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
            return callback(1, 'create_order_books_fail', 400, error, null);
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
          return callback(true, 'update_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'update_order_fail', 400, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
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
              return callback(1, 'wrong_order', 400, 'wrong order', null);
            }
            if (order.deleted) {
              return callback(1, 'order_deleted', 400, 'order has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && order.createdBy !=accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
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
          order.deletedBy = accessUserId;
          order.save().then(function(order) {
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete order books
        function(order, next) {
          OrderBook.destroy({
            where: {
              orderId: order?.id,
            },
          }).then(function() {
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // update quantity coupon
        function(order, next) {
          if (order.status==constant.ORDER_STATUS_ENUM.CONFIRMED) {
            Coupon.increment({
              quantity: 1,
            }, {
              where: {
                id: {
                  [Sequelize.Op.in]: JSON.parse(order.couponIds),
                },
              },
            }).then(function(result) {
              next(null, order);
            }).catch(function(error) {
              return callback(true, 'update_quantity_coupons_fail', 400, error, null);
            });
          }
          next(null, order);
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'delete_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, 'delete order successfully');
      });
    } catch (error) {
      return callback(1, 'delete_order_fail', 400, error, null);
    }
  },

  confirm: function(accessUserId, accessUserType, id, callback) {
    if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
      return callback(1, 'permission_denied', 403, 'permission denied', null);
    }
    try {
      async.waterfall([
        // get order
        function(next) {
          Order.findOne({
            where: {id: id},
            include: [
              {
                model: OrderBook,
                as: 'orderBooks',
                include: [
                  {
                    model: Book,
                    as: 'book',
                    include: [
                      {
                        model: Promotion,
                        as: 'promotions',
                      },
                    ],
                  },
                ],
              },
            ],
          }).then(function(order) {
            if (!order) {
              return callback(1, 'wrong_order', 400, 'wrong order', null);
            }
            if (order.deleted) {
              return callback(1, 'order_deleted', 400, 'order has been deleted', null);
            }
            if (accessUserType< constant.USER_TYPE_ENUM.ADMIN && order.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (order.status != constant.ORDER_STATUS_ENUM.ORDERED) {
              return callback(1, 'status_not_ordered', 403, 'status not ordered', null);
            }
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // get coupons
        function(order, next) {
          const couponIds = JSON.parse(order.couponIds ||null) ||[];
          Coupon.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: couponIds,
              },
              deleted: constant.BOOLEAN_ENUM.FALSE,
              [Sequelize.Op.or]: [
                {startDate: null},
                {startDate: {
                  [Sequelize.Op.lte]: moment().format(),
                }},
              ],
              [Sequelize.Op.or]: [
                {startDate: null},
                {endDate: {
                  [Sequelize.Op.gte]: moment().format(),
                }},
              ],
            },
          }).then(function(coupons) {
            if (coupons.length < couponIds.length) {
              return callback(true, 'has_a_coupon_invalide', 400, 'has a coupon invalide', null);
            }
            next(null, order, coupons);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // calc price
        function(order, coupons, next) {
          order.orderBooks = order.orderBooks.map((orderBook) => {
            const promo = orderBook.book.promotions.at(0);
            orderBook.dataValues.oldPrice = orderBook.book.price;
            orderBook.dataValues.newPrice = bookManager.calcNewPrice(orderBook.book.price, promo);
          });
          order.dataValues.totalAmount = order.orderBooks.reduce((sum, ob)=> sum + ob.newPrice * ob.quantity, 0);
          order.dataValues.couponAmount = calcTotalAmountAfterDiscount(order.dataValues.totalAmount, coupons);
          next(null, order.orderBooks, order);
        },
        // update order books, order
        function(orderBooks, order, next) {
          async.parallel([
            // update order books
            function(next) {
              OrderBook.bulkCreate(orderBooks, {
                updateOnDuplicate: ['oldPrice', 'newPrice'],
              }).then(function(orderBooks) {
                next();
              }).catch(function(error) {
                return callback(true, 'update_orderBooks_fail', 400, error, null);
              });
            },
            // update order
            function(next) {
              // confirm order
              order.status = constant.ORDER_STATUS_ENUM.CONFIRMED;
              order.updatedBy = accessUserId;
              order.updatedAt = moment().format();
              order.save().then(function(order) {
                next(null, order);
              }).catch(function(error) {
                return callback(true, 'update_order_fail', 400, error, null);
              });
            },
          ], function(error) {
            next(error, order);
          });
        },
        // update quantity coupon
        function(order, next) {
          Coupon.decrement({
            quantity: 1,
          }, {
            where: {
              id: {
                [Sequelize.Op.in]: JSON.parse(order.couponIds),
              },
            },
          }).then(function(result) {
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'update_quantity_coupons_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'confirm_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, 'confirm order successfully');
      });
    } catch (error) {
      return callback(1, 'confirm_order_fail', 400, error, null);
    }
  },

  pay: function(accessUserId, accessUserType, id, body, callback) {
    try {
      if (accessUserType != constant.USER_TYPE_ENUM.ADMIN && accessUserType != constant.USER_TYPE_ENUM.USER) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      const data = {};
      if (body.phone != '' && body.phone != null && body.phone != undefined) {
        data.phone = body.phone;
      }
      if (body.email != '' && body.email != null && body.phone != undefined) {
        data.email = body.email;
      }
      if (body.address != '' && body.address != null && body.phone != undefined) {
        data.address = body.address;
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
              return callback(1, 'wrong_order', 400, 'wrong order', null);
            }
            if (order.deleted) {
              return callback(1, 'order_deleted', 400, 'order has been deleted', null);
            }
            if (accessUserType< constant.USER_TYPE_ENUM.ADMIN && order.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (order.status != constant.ORDER_STATUS_ENUM.CONFIRMED) {
              return callback(1, 'status_not_confirmed ', 403, 'status not confirmed', null);
            }
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // pay order
        function(order, next) {
          order.status = constant.ORDER_STATUS_ENUM.PAIED;
          order.updatedBy = accessUserId;
          order.updatedAt = moment().format();
          order.save().then(function(order) {
            next(null, {
              ...order.dataValues,
              phone: data.phone,
              email: data.email,
              address: data.address,
            });
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
      ], function(error, order) {
        if (error) {
          return callback(1, 'confirm_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, 'pay order successfully');
      });
    } catch (error) {
      return callback(1, 'confirm_order_fail', 400, error, null);
    }
  },

  applyCoupons: function(accessUserId, accessUserType, id, data, callback) {
    try {
      const couponIds = JSON.parse(data.couponIds || null) || [];

      async.waterfall([
        // check order
        function(next) {
          Order.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: OrderBook,
                as: 'orderBooks',
                attributes: ['unitPrice', 'quantity'],
                required: false,
              },

            ],
          }).then(function(order) {
            if (!order) {
              return callback(1, 'wrong_order', 400, 'wrong order', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && order.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (order.status != constant.ORDER_STATUS_ENUM.ORDERED) {
              return callback(1, 'status_not_ordered ', 403, 'status not ordered', null);
            }
            next(null, order);
          }).catch(function(error) {
            return callback(true, 'get_coupon_fail', 400, error, null);
          });
        },
        // check coupons
        function(order, next) {
          Coupon.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: couponIds,
              },
              deleted: constant.BOOLEAN_ENUM.FALSE,
              [Sequelize.Op.or]: [
                {startDate: null},
                {startDate: {
                  [Sequelize.Op.lte]: moment().format(),
                }},
              ],
              [Sequelize.Op.or]: [
                {startDate: null},
                {endDate: {
                  [Sequelize.Op.gte]: moment().format(),
                }},
              ],
            },
          }).then(function(coupons) {
            // check trung
            if (_.uniq(couponIds).length !== couponIds.length) {
              return callback(1, 'duplicate_coupon', 400, 'duplicate coupon', null);
            }
            if (couponIds.length > coupons.length) {
              return callback(1, 'wrong_coupon', 400, 'have a wrong coupon', null);
            }
            next(null, order, coupons);
          }).catch(function(error) {
            return callback(true, 'get_coupons_fail', 400, error, null);
          });
        },
        // add coupons
        function(order, coupons, next) {
          order.couponIds = JSON.stringify(couponIds);
          order.save({
            validate: false,
          }).then(function(order) {
            next(null, order, coupons);
          }).catch(function(error) {
            return callback(true, 'get_coupons_fail', 400, error, null);
          });
        },
        // update total amount
        function(order, coupons, next) {
          const totalBeforeDiscount = order.orderBooks.reduce((sum, orderBook)=> sum + orderBook.unitPrice * orderBook.quantity, 0);
          const totalAfterDiscount = calcTotalAmountAfterDiscount(totalBeforeDiscount, coupons);
          order.totalAmount = totalAfterDiscount;
          order.save().then(function(order) {
            next(null, {
              ...order.dataValues,
              totalBeforeDiscount: totalBeforeDiscount,
              totalAfterDiscount: totalAfterDiscount,
            });
          }).catch(function(error) {
            return callback(1, 'update_total_amount_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'add_coupons_to_order_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'add_coupons_to_order_fail', 400, error, null);
    }
  },
};

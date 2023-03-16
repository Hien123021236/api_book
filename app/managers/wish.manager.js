const Sequelize = require('sequelize');
const async = require('async');
// const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Wish, Book} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {

  create: function(accessUserId, accessUserType, data, callback) {
    try {
      async.waterfall([
        // get book
        function(next) {
          Book.findOne({
            where: {id: data.bookId},
            include: [
              {
                model: Wish,
                as: 'wishes',
              },
            ],
          }).then(function(book) {
            const wish = book.wishes.find((w) => w.userId == accessUserId);
            if (!book) {
              return callback(1, 'wrong_book,', 400, 'wrong book', null);
            }
            if (book.deleted) {
              return callback(1, 'book_deleted,', 403, 'book has been deleted', null);
            }
            if (wish) {
              return callback(1, 'wish_in_list', 400, 'wish was in list', null);
            }
            next(null, book);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // validate
        function(book, next) {
          Wish.build({
            userId: accessUserId,
            bookId: book.id,
            createdBy: accessUserId,
          }).validate().then(function(wish) {
            wish.save({
              validate: false,
            }).then(function(wish) {
              return next(null, wish);
            }).catch(function(error) {
              return callback(true, 'save_wish_fail', 400, error, null);
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
          return callback(1, 'create_wish_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'create_wish_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      if (!accessUserId) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const query ={
        where: {
          createdBy: accessUserId,
        },
        include: [
          {
            model: Book,
            as: 'book',
          },
        ],
      };

      supporter.pasteQuery(Wish, query, filter, sort, search, page, limit);

      Wish.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_wishes_fail', 400, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      async.waterfall([
        // get wish
        function(next) {
          Wish.findOne({
            where: {
              id: id,
            },
          }).then(function(wish) {
            if (!wish) {
              return callback(1, 'wrong_wish,', 400, 'wrong wish', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && wish.userId != accessUserId ) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, wish);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // delete wish
        function(wish, next) {
          wish.destroy({
            where: {
              userId: accessUserId,
            },
          }).then(function() {
            next();
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'delete_wish_fail', 400, error, null);
        }
        return callback(null, null, 200, null, null);
      });
    } catch (error) {
      return callback(1, 'delete_wish_fail', 400, error, null);
    }
  },

  deletes: function(accessUserId, accessUserType, data, callback) {
    try {
      const WishIds = JSON.parse(data.WishIds || null) || [];
      if (WishIds.length <= 0) {
        return callback(1, 'invalid_wishIds', 400, 'wish list must be not empty', null);
      }

      async.waterfall([
        // get wishes
        function(next) {
          Wish.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: WishIds,
              },
            },
          }).then(function(wishes) {
            if (wishes.length < WishIds.length) {
              return callback(1, 'invalid_wishIds', 400, 'wish id is incorrect', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && wishes.find((w) => w.userId != accessUserId)) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next();
          }).catch(function(error) {
            return callback(1, 'get_wishes_fail', 400, error, null);
          });
        },
        // delete wishes
        function(next) {
          Wish.destroy({
            where: {
              id: {
                [Sequelize.Op.in]: WishIds,
              },
            },
          }).then(function() {
            next();
          }).catch(function(error) {
            return callback(1, 'delete_wishes_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(1, 'delete_wishes_fail', 400, error, null);
        }
        return callback(null, null, 200, null, null);
      });
    } catch (error) {
      return callback(1, 'delete_wishes_fail', 400, error, null);
    }
  },
};

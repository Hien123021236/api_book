const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Promotion, PromotionBook, Book} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {
  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      Promotion.build({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        discountValue: data.discountValue,
        discountPercent: data.discountPercent,
        discountMin: data.discountMin,
        discountMax: data.discountMax,
        activated: data.activated,
        type: parseInt(data.type),
        createdBy: accessUserId,
      }).validate().then(function(promotion) {
        promotion.save({
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
      return callback(1, 'create_promotion_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      Promotion.findOne({
        where: {id: id},
        include: [
          {
            model: PromotionBook,
            as: 'promotionBooks',
            include: [
              {model: Book, as: 'book'},
            ],
          },
        ],
      }).then(function(promotion) {
        if (!promotion) {
          return callback(1, 'wrong_promotion,', 400, 'wrong promotion', null);
        }
        if (promotion.deleted) {
          return callback(1, 'promotion_deleted,', 400, 'promotion has been deleted', null);
        }
        return callback(null, null, 200, null, promotion);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_promotion_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query ={
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };
      supporter.pasteQuery(Promotion, query, filter, sort, search, page, limit);
      Promotion.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_promotions_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, body, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
            },
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (promotion.deleted) {
              return callback(1, 'promotion_deleted', 400, 'promotion has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, promotion);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },

        // update promotion
        function(promotion, next) {
          const data = {...promotion.dataValues};
          for (const attr in promotion.get()) {
            if (body[attr] != '' && body[attr] != null && body[attr] != undefined) {
              data[attr] = body[attr];
            }
          }

          Promotion.build(data).validate().then(function() {
            Object.assign(promotion, data);
            promotion.updatedAt = moment().format();
            promotion.save({
              validate: false,
            }).then(function(promotion) {
              next(null, promotion);
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
          return callback(true, 'update_promotion_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'update_promotion_fail', 400, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
            },
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (promotion.deleted) {
              return callback(1, 'promotion_deleted', 400, 'promotion has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, promotion);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete promotion
        function(promotion, next) {
          promotion.deleted = constant.BOOLEAN_ENUM.TRUE;
          promotion.deletedAt = moment().format();
          promotion.save().then(function(promotion) {
            next(null, promotion);
          }).catch(function(error) {
            return callback(true, 'delete_promotion_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'delete_promotion_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'delete_promotion_fail', 400, error, null);
    }
  },

  addBook: function(accessUserId, accessUserType, id, bookId, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // check promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Book,
                as: 'books',
                attributes: ['id'],
              },
            ],
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            const book = promotion.books.find((b) => b.id == bookId);
            if (book) {
              return callback(1, 'duplicated_book', 400, 'duplicated book', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_promotion_fail', 400, error, null);
          });
        },
        // check book
        function(next) {
          Book.findOne({
            where: {
              id: bookId,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Promotion,
                as: 'promotions',
                attributes: ['id'],
                where: {
                  deleted: constant.BOOLEAN_ENUM.FALSE,
                },
                required: false,
              },
            ],
          }).then(function(book) {
            if (!book) {
              return callback(1, 'wrong_book', 400, 'wrong book', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (book.promotions.length > 0) {
              return callback(1, 'book_applied_other_promotion', 403, 'book applied other promotion', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_book_fail', 400, error, null);
          });
        },
        // add promotion-book
        function(next) {
          PromotionBook.create({
            promotionId: id,
            bookId: bookId,
            createdBy: accessUserId,
          }).then(function(promotionBook) {
            return callback(null, null, 200, null, 'create promotion book successfully');
          }).catch(function(error) {
            return callback(1, 'create_promotion_book_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'create_promotion_book_fail', 400, error, null);
    }
  },

  addBooks: function(accessUserId, accessUserType, id, bookIds, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      bookIds = JSON.parse(bookIds || null) || [];

      async.waterfall([
        // check promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Book,
                as: 'books',
                attributes: ['id'],
              },
            ],
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            // find a book of promotion.books in bookIds
            const book = promotion.books.find((b) => bookIds.find((bookId) => bookId == b.id));
            if (book) {
              return callback(1, 'duplicated_book', 400, 'have one duplicated book', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_promotion_fail', 400, error, null);
          });
        },
        // check books
        function(next) {
          Book.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: bookIds,
              },
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Promotion,
                as: 'promotions',
                attributes: ['id'],
                where: {
                  deleted: constant.BOOLEAN_ENUM.FALSE,
                },
                required: false,
              },
            ],
          }).then(function(books) {
            if (bookIds.length > books.length) {
              return callback(1, 'wrong_book', 400, 'have a wrong book', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && books.find((b) => b.createdBy != accessUserId)) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            if (books.find((b) => b.promotions.length > 0)) {
              return callback(1, 'book_applied_other_promotion', 403, 'have a book applied other promotion', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_books_fail', 400, error, null);
          });
        },
        // add promotion-book
        function(next) {
          const data = bookIds.map((bookId)=>{
            return {
              promotionId: id,
              bookId: bookId,
              createdBy: accessUserId,
            };
          });
          PromotionBook.bulkCreate(data).then(function(promotionBooks) {
            return callback(null, null, 200, null, 'add books to promotion successfully');
          }).catch(function(error) {
            return callback(1, 'add_books_to_promotion_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'add_books_to_promotion_fail', 400, error, null);
    }
  },

  removeBook: function(accessUserId, accessUserType, id, bookId, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // check promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Book,
                as: 'books',
                attributes: ['id'],
              },
            ],
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            const book = promotion.books.find((b) => b.id == bookId);
            if (!book) {
              return callback(1, 'invald_book', 400, 'book is not in book list applied for this promotion', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_promotion_fail', 400, error, null);
          });
        },
        // check book
        function(next) {
          Book.findOne({
            where: {
              id: bookId,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
          }).then(function(book) {
            if (!book) {
              return callback(1, 'wrong_book', 400, 'wrong book', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_book_fail', 400, error, null);
          });
        },
        // delete promotion-book
        function(next) {
          PromotionBook.destroy({
            where: {
              promotionId: id,
              bookId: bookId,
            },
          }).then(function(promotionBook) {
            return callback(null, null, 200, null, 'delete promotion book successfully');
          }).catch(function(error) {
            return callback(1, 'delete_book_from_promotion_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'delete_book_from_promotion_fail', 400, error, null);
    }
  },

  removeBooks: function(accessUserId, accessUserType, id, bookIds, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      bookIds = JSON.parse(bookIds || null) || [];

      async.waterfall([
        // check promotion
        function(next) {
          Promotion.findOne({
            where: {
              id: id,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [
              {
                model: Book,
                as: 'books',
                attributes: ['id'],
              },
            ],
          }).then(function(promotion) {
            if (!promotion) {
              return callback(1, 'wrong_promotion', 400, 'wrong promotion', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && promotion.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            // find a bookId of bookIds not in promotion.books
            const notFoundBookId = bookIds.find((bookId) => !promotion.books.find((b) => b.id == bookId));
            if (notFoundBookId) {
              return callback(1, 'invald_book', 400, 'have a book is not in book list applied for this promotion', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_promotion_fail', 400, error, null);
          });
        },
        // check books
        function(next) {
          Book.findAll({
            where: {
              id: {[Sequelize.Op.in]: bookIds},
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
          }).then(function(books) {
            if (books.length < bookIds.length) {
              return callback(1, 'wrong_book', 400, 'have a wrong book', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && books.find((b) => b.createdBy != accessUserId)) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_books_fail', 400, error, null);
          });
        },
        // delete promotion-books
        function(next) {
          PromotionBook.destroy({
            where: {
              promotionId: id,
              bookId: {[Sequelize.Op.in]: bookIds},
            },
          }).then(function(promotionBooks) {
            return callback(null, null, 200, null, 'delete promotion books successfully');
          }).catch(function(error) {
            return callback(1, 'delete_promotion_books_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'delete_promotion_books_fail', 400, error, null);
    }
  },

  getPromotionsByBook: function(accessUserId, accessUserType, bookId, filter, sort, search, page, limit, callback) {
    try {
      async.waterfall([
        // get book
        function(next) {
          Book.findOne({
            where: {
              id: bookId,
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
          }).then(function(book) {
            if (!book) {
              return callback(1, 'wrong_book', 400, 'wrong book', null);
            }
            next();
          }).catch(function(error) {
            return callback(true, 'get_book_fail', 400, error, null);
          });
        },
        // get promotions
        function(next) {
          const query ={
            where: {
              deleted: constant.BOOLEAN_ENUM.FALSE,
            },
            include: [{
              model: Book,
              as: 'books',
              where: {
                id: bookId,
              },
            }],
          };

          supporter.pasteQuery(Promotion, query, filter, sort, search, page, limit);
          Promotion.findAndCountAll({
            ...query,
            log: console.log,
          }).then(function(result) {
            // remove books from promotion
            result.rows.map((promo) => {
              promo.dataValues.books = null;
              return promo;
            });
            // paste to pagination format
            const paginationResult = supporter.paginationResult(result, page, limit);
            return callback(null, null, 200, null, paginationResult);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error.message, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'get_promotions_by_book_fail', 400, error, null);
    }
  },
};

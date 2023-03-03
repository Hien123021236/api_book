const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Book, Category, CategoryBook, database} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');
const UploadService = require('../services/upload.service');


module.exports = {

  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      const categoryIds = JSON.parse(data.categoryIds || null) || [];

      if (categoryIds.length <= 0) {
        return callback(1, 'invalid_categoryIds', 400, 'category list must be not null', null);
      }

      database.transaction().then(function(trans) {
        async.waterfall([
          // get categories
          function(next) {
            Category.findAll({
              where: {
                id: {
                  [Sequelize.Op.in]: categoryIds,
                },
              },
            }).then(function(categories) {
              if (categories.length < categoryIds.length) {
                return callback(1, 'invalid_categoryIds', 400, 'category id is incorrect', null);
              }
              next();
            }).catch(function(error) {
              return callback(1, 'get_categories_fail', 400, error, null);
            });
          },
          // validate
          function(next) {
            Book.build({
              isbn: data.isbn,
              name: data.name,
              pageCount: data.pageCount,
              authors: data.authors,
              price: data.price,
              publishedDate: data.publishedDate,
              series: data.series,
              description: data.description,
              createdBy: accessUserId,
            }).validate().then(function(book) {
              return next(null, book);
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
          // save book
          function(book, next) {
            book.save({
              validate: false,
              transaction: trans,
            }).then(function(book) {
              return next(null, book);
            }).catch(function(error) {
              return callback(true, 'save_book_fail', 400, error, null);
            });
          },
          // create category book
          function(book, next) {
            CategoryBook.bulkCreate(categoryIds.map((i) => {
              return {
                categoryId: i,
                bookId: book.id,
                createdBy: accessUserId,
              };
            })).then(function() {
              next(null, book);
            }).catch(function(error) {
              return callback(1, 'create_category_book_fail', 400, error, null);
            });
          },
          // comit transaction
          function(book, next) {
            trans.commit().then(function(result) {
              next(null, book);
            }).catch(function(error) {
              trans.rollback();
              next(error);
            });
          },
        ], function(error, result) {
          if (error) {
            return callback(1, 'create_book_fail', 400, error, null);
          }
          return callback(null, null, 200, null, result);
        });
      }).catch(function(error) {
        return callback(1, 'create_transaction_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'create_book_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      Book.findOne({
        where: {id: id},
        include: [
          {model: Category, as: 'categories'},
        ],
      }).then(function(book) {
        if (!book) {
          return callback(1, 'wrong_book,', 400, 'wrong book', null);
        }
        if (book.deleted) {
          return callback(1, 'book_deleted,', 403, 'book has been deleted', null);
        }
        return callback(null, null, 200, null, book);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_book_fail', 400, error, null);
    }
  },

  getAllNonAuth: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query ={
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      supporter.pasteQuery(Book, query, filter, sort, search, page, limit);

      Book.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_books_fail', 400, error, null);
    }
  },

  getAllAuth: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const query ={
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      // if agent the show books of this agent
      if (accessUserType == constant.USER_TYPE_ENUM.AGENT) {
        query.where.createdBy = accessUserId;
      }

      supporter.pasteQuery(Book, query, filter, sort, search, page, limit);

      Book.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_books_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      const categoryIds = JSON.parse(data.categoryIds || null) || [];

      if (categoryIds.length <= 0) {
        return callback(1, 'invalid_categoryIds', 400, 'category list must be not null', null);
      }

      database.transaction().then(function(trans) {
        async.waterfall([
          // get book, categories
          function(next) {
            async.parallel([
              // get book
              function(next) {
                Book.findOne({
                  where: {
                    id: id,
                  },
                }).then(function(book) {
                  next(null, book);
                }).catch(function(error) {
                  return callback(true, 'query_fail', 400, error, null);
                });
              },
              // get categories
              function(next) {
                Category.findAll({
                  where: {
                    id: {
                      [Sequelize.Op.in]: categoryIds,
                    },
                  },
                }).then(function(categories) {
                  next(null, categories);
                }).catch(function(error) {
                  return callback(1, 'get_categories_fail', 400, error, null);
                });
              },
            ], function(error, [book, categories]) {
              if (!book) {
                return callback(1, 'wrong_book', 403, 'wrong book', null);
              }
              if (book.deleted) {
                return callback(1, 'book_deleted', 403, 'book has been deleted', null);
              }
              if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && book.createdBy != accessUserId) {
                return callback(1, 'permission_denied', 403, 'permission denied', null);
              }
              if (categories.length < categoryIds.length) {
                return callback(1, 'invalid_categoryIds', 400, 'category id is incorrect', null);
              }
              next(error, book);
            });
          },
          // update book
          function(book, next) {
            book.isbn = data.isbn;
            book.name = data.name;
            book.pageCount = data.pageCount;
            book.authors = data.authors;
            book.price = data.price;
            book.publishedDate = data.publishedDate;
            book.description = data.description;
            book.updatedBy = accessUserId;
            book.updatedAt = moment().format();
            book.save({
              validate: true,
              transaction: trans,
            }).then(function(book) {
              next(null, book);
            }).catch(function(error) {
              const errors = error.errors?.map(function(e) {
                return {
                  name: e.path,
                  message: e.message,
                };
              });
              if (errors) {
                return callback(1, 'invalid_input', 403, errors, null);
              } else {
                return callback(true, 'update_book_fail', 400, error, null);
              }
            });
          },
          // delete old category_books
          function(book, next) {
            CategoryBook.destroy({
              where: {
                bookId: book.id,
              },
            }).then(function(result) {
              next(null, book);
            }).catch(function(error) {
              return callback(true, 'delete_category_books_fail', 400, error, null);
            });
          },
          // create new category_books
          function(book, next) {
            CategoryBook.bulkCreate(categoryIds.map((i) => {
              return {
                categoryId: i,
                bookId: book.id,
                createdBy: accessUserId,
              };
            }, {transaction: trans})).then(function() {
              next(null, book);
            }).catch(function(error) {
              return callback(1, 'create_category_books_fail', 400, error, null);
            });
          },
          // comit transaction
          function(book, next) {
            trans.commit().then(function(result) {
              next(null, book);
            }).catch(function(error) {
              trans.rollback();
              next(error);
            });
          },
        ], function(error, book) {
          if (error) {
            return callback(true, 'update_book_fail', 400, error, null);
          }
          return callback(null, null, 200, null, book);
        });
      }).catch(function(error) {
        return callback(1, 'create_transaction_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'update_book_fail', 420, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get book
        function(next) {
          Book.findOne({
            where: {
              id: id,
            },
          }).then(function(book) {
            if (!book) {
              return callback(1, 'wrong_book', 403, 'wrong book', null);
            }
            if (book.deleted) {
              return callback(1, 'book_deleted', 403, 'book has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, book);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete book
        function(book, next) {
          book.deleted = constant.BOOLEAN_ENUM.TRUE;
          book.deletedAt = moment().format();
          book.save().then(function(book) {
            next(null, book);
          }).catch(function(error) {
            return callback(true, 'delete_book_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'delete_book_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'delete_book_fail', 400, error, null);
    }
  },

  getSeries: function(accessUserId, accessUserType, callback) {
    if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
      return callback(1, 'permission_denied', 403, 'permission denied', null);
    }
    try {
      Book.aggregate('series', 'DISTINCT', {
        where: {
          createdBy: accessUserId,
          deleted: constant.BOOLEAN_ENUM.FALSE,
          series: {
            [Sequelize.Op.not]: null,
          },
        },
        plain: false,
      }).then(function(results) {
        const series = results.map((result) => result.DISTINCT);
        return callback(null, null, 200, null, series);
      }).catch(function(error) {
        return callback(1, 'get_series_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_series_fail', 400, error, null);
    }
  },

  uploadImages: function(accessUserId, accessUserType, id, data, files, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get book, categories
        function(next) {
          Book.findOne({
            where: {
              id: id,
            },
          }).then(function(book) {
            if (accessUserId != book?.createdBy) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, book);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // upload images
        function(book, next) {
          UploadService.uploadFiles(files, function(error, results) {
            next(error, book, results);
          });
        },
        // update book
        function(book, results, next) {
          const thumbnail = results.find((r) => r.name == 'thumbnail')?.url || book.thumbnail;
          const image1 = results.find((r) => r.name == 'image1')?.url || book.image1;
          const image2 = results.find((r) => r.name == 'image2')?.url || book.image2;
          const image3 = results.find((r) => r.name == 'image3')?.url || book.image3;
          const image4 = results.find((r) => r.name == 'image4')?.url || book.image4;
          book.thumbnail = data.thumbnail || data.thumbnail == '' ? data.thumbnail : thumbnail;
          book.image1 = data.image1 || data.image1 == '' ? data.image1 : image1;
          book.image2 = data.image2 || data.image2 == '' ? data.image2 : image2;
          book.image3 = data.image3 || data.image3 == '' ? data.image3 : image3;
          book.image4 = data.image4 || data.image4 == '' ? data.image4 : image4;
          book.updatedBy = accessUserId;
          book.updatedAt = moment().format();
          book.save({
            validate: false,
          }).then(function(book) {
            next(null, book);
          }).catch(function(error) {
            return callback(true, 'update_book_fail', 400, error, null);
          });
        },
      ], function(error, book) {
        if (error) {
          return callback(true, 'update_book_fail', 400, error, null);
        }
        return callback(null, null, 200, null, book);
      });
    } catch (error) {

    }
  },
};

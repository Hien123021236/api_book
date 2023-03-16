// const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');
const {Sequelize} = require('sequelize');

// const config = require('../configs/general.config');
const {Comment, Book} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {

  create: function(accessUserId, accessUserType, body, callback) {
    try {
      const data = {
        userId: accessUserId,
        bookId: body.bookId,
        star: body.star || parseInt(body.star) || 0,
        comment: body.comment,
        displayName: body.displayName,
        createdBy: accessUserId,
      };
      async.waterfall([
        // get book
        function(next) {
          Book.findOne({
            where: {id: data.bookId},
            include: [
              {
                model: Comment,
                as: 'comments',
              },
            ],
          }).then(function(book) {
            const comment = book.comments.find((c) => c.userId == accessUserId);
            if (!book) {
              return callback(1, 'wrong_book,', 400, 'wrong book', null);
            }
            if (book.deleted) {
              return callback(1, 'book_deleted,', 403, 'book has been deleted', null);
            }
            if (comment) {
              return callback(1, 'user_was_commented', 400, 'user was commented', null);
            }
            next();
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // validate
        function(next) {
          Comment.build(data).validate().then(function(comment) {
            comment.save({
              validate: false,
            }).then(function(comment) {
              return next(null, comment);
            }).catch(function(error) {
              return callback(true, 'save_comment_fail', 400, error, null);
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
          return callback(1, 'create_comment_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'create_comment_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      Comment.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Book,
            as: 'book',
          },
        ],
      }).then(function(comment) {
        if (!comment) {
          return callback(1, 'wrong_comment,', 400, 'wrong_comment', null);
        }
        if (comment.deleted) {
          return callback(1, 'comment_deleted,', 400, 'comment has been deleted', null);
        }
        if (!comment.verified && accessUserType < constant.USER_TYPE_ENUM.ADMIN && comment.book.createdBy != accessUserId && comment.userId != accessUserId) {
          return callback(1, 'comment_unverified,', 400, 'comment unverified', null);
        }
        return callback(null, null, 200, null, comment);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_comment_fail', 400, error, null);
    }
  },

  getAllWithAuth: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query = {
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };

      async.waterfall([
        // check and make query
        function(next) {
          if (accessUserType == constant.USER_TYPE_ENUM.ADMIN) {
            next(null, query);
          } else
          if (accessUserType == constant.USER_TYPE_ENUM.USER) {
            // where verified == true || userId == accessUserId
            query.where[Sequelize.Op.and] = Sequelize.literal(`(verified = ${constant.BOOLEAN_ENUM.TRUE} OR userId = ${accessUserId})`);
            next(null, query);
          } else
          if (accessUserType == constant.USER_TYPE_ENUM.AGENT) {
            // where verified == true || userId == accessUserId
            Book.findAll({
              attributes: ['id'],
              where: {
                createdBy: accessUserId,
                deleted: constant.BOOLEAN_ENUM.FALSE,
              },
            }).then(function(books) {
              const bookIds = books.map((b) => b.id);
              query.where[Sequelize.Op.and] = Sequelize.literal(`(bookId IN (${bookIds.toString()}) OR (bookId NOT IN (${bookIds.toString()}) && verified = ${constant.BOOLEAN_ENUM.TRUE}))`);
              next(null, query);
            }).catch(function(error) {
              return callback(1, 'get_books_of_user_fail', 400, error, null);
            });
          }
        },
        // get comments
        function(query, next) {
          supporter.pasteQuery(Comment, query, filter, sort, search, page, limit);
          Comment.findAndCountAll({
            ...query,
            logging: console.log,
          }).then(function(result) {
            const paginationResult = supporter.paginationResult(result, page, limit);
            return callback(null, null, 200, null, paginationResult);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error.message, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'get_comments_fail', 400, error, null);
    }
  },

  getAllWithoutAuth: function(accessUserId, accessUserType, filter, sort, search, page, limit, callback) {
    try {
      const query = {
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
          verified: constant.BOOLEAN_ENUM.TRUE,
        },
      };

      supporter.pasteQuery(Comment, query, filter, sort, search, page, limit);

      Comment.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_comments_fail', 400, error, null);
    }
  },

  verify: function(accessUserId, accessUserType, commentId, callback) {
    try {
      if (!commentId) {
        return callback(1, 'commentId_incorrect', 400, 'comment id is incorrect', null);
      }
      async.waterfall([
        // get comment
        function(next) {
          Comment.findOne({
            where: {id: commentId},
            include: [
              {
                model: Book,
                as: 'book',
              },
            ],
          }).then(function(comment) {
            if (!comment) {
              return callback(1, 'wrong_comment,', 400, 'wrong comment', null);
            }
            if (comment.deleted) {
              return callback(1, 'comment_deleted,', 400, 'comment has been deleted', null);
            }
            if (comment.verified) {
              return callback(1, 'comment_verified', 400, 'Comment verified', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && comment.book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, comment);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // verify comment
        function(comment, next) {
          comment.verified = constant.BOOLEAN_ENUM.TRUE;
          comment.updatedAt = moment().format();
          comment.save().then(function(comment) {
            next(null, comment);
          }).catch(function(error) {
            return callback(true, 'verify_comment_fail', 400, error, null);
          });
        },
        // update book (totalStar and countStar)
        function(comment, next) {
          Book.increment({
            totalStar: comment.star,
            countStar: 1,
          }, {
            where: {id: comment.bookId},
          }).then(function(result) {
            comment.dataValues.book = null;
            return callback(null, null, 200, null, comment);
          }).catch(function(error) {
            return callback(true, 'update_book_rate_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'verify_comment_fail', 400, error, null);
    }
  },

  unverify: function(accessUserId, accessUserType, commentId, callback) {
    try {
      if (!commentId) {
        return callback(1, 'commentId_incorrect', 400, 'comment id is incorrect', null);
      }
      async.waterfall([
        // get comment
        function(next) {
          Comment.findOne({
            where: {id: commentId},
            include: [
              {
                model: Book,
                as: 'book',
              },
            ],
          }).then(function(comment) {
            if (!comment) {
              return callback(1, 'wrong_comment,', 400, 'wrong comment', null);
            }
            if (comment.deleted) {
              return callback(1, 'comment_deleted,', 400, 'comment has been deleted', null);
            }
            if (!comment.verified) {
              return callback(1, 'comment_not_verified', 400, 'Comment have not verified yet', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && comment.book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, comment);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // unverify comment
        function(comment, next) {
          comment.verified = constant.BOOLEAN_ENUM.FALSE;
          comment.updatedAt = moment().format();
          comment.save().then(function(comment) {
            next(null, comment);
          }).catch(function(error) {
            return callback(true, 'unverify_comment_fail', 400, error, null);
          });
        },
        // update book (totalStar and countStar)
        function(comment, next) {
          Book.decrement({
            totalStar: comment.star,
            countStar: 1,
          }, {
            where: {id: comment.bookId},
          }).then(function(result) {
            comment.dataValues.book = null;
            return callback(null, null, 200, null, comment);
          }).catch(function(error) {
            return callback(true, 'update_book_rate_fail', 400, error, null);
          });
        },
      ]);
    } catch (error) {
      return callback(1, 'unverify_comment_fail', 400, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, commentId, callback) {
    try {
      if (!commentId) {
        return callback(1, 'commentId_incorrect', 400, 'comment id is incorrect', null);
      }
      async.waterfall([
        // get comment
        function(next) {
          Comment.findOne({
            where: {id: commentId},
            include: [
              {
                model: Book,
                as: 'book',
              },
            ],
          }).then(function(comment) {
            if (!comment) {
              return callback(1, 'wrong_comment,', 400, 'wrong comment', null);
            }
            if (comment.deleted) {
              return callback(1, 'comment_deleted,', 400, 'comment has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && comment.book.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, comment);
          }).catch(function(error) {
            return callback(1, 'query_fail', 400, error, null);
          });
        },
        // verify comment
        function(comment, next) {
          comment.deleted = constant.BOOLEAN_ENUM.TRUE;
          comment.deletedAt = moment().format();
          comment.save().then(function(comment) {
            next(null, comment);
          }).catch(function(error) {
            return callback(true, 'delete_comment_fail', 400, error, null);
          });
        },
        // update book (totalStar and countStar)
        function(comment, next) {
          if (comment.verified) {
            Book.decrement({
              totalStar: comment.star,
              countStar: 1,
            }, {
              where: {id: comment.bookId},
            }).then(function(result) {
              comment.dataValues.book = null;
              return callback(null, null, 200, null, comment);
            }).catch(function(error) {
              return callback(true, 'update_book_rate_fail', 400, error, null);
            });
          } else {
            return callback(null, null, 200, null, comment);
          }
        },
      ]);
    } catch (error) {
      return callback(1, 'delete_comment_fail', 400, error, null);
    }
  },

};

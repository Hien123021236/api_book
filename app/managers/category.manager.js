// const Sequelize = require('sequelize');
const async = require('async');
const moment = require('moment-timezone');

// const config = require('../configs/general.config');
const {Category, Book} = require('../models/index');
const constant = require('../utils/constant.utils');
const supporter = require('../utils/supporter.utils');

module.exports = {
  create: function(accessUserId, accessUserType, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }
      async.waterfall([
        // validate
        function(next) {
          Category.build({
            name: data.name,
            description: data.description,
            createdBy: accessUserId,
          }).validate().then(function(category) {
            return next(null, category);
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
        // save category
        function(category, next) {
          category.save({
            validate: false,
          }).then(function(category) {
            return next(null, category);
          }).catch(function(error) {
            return callback(true, 'save_category_fail', 400, error, null);
          });
        },
      ], function(error, category) {
        if (error) {
          return callback(1, 'create_category_fail', 400, error, null);
        }
        return callback(null, null, 200, null, category);
      });
    } catch (error) {
      return callback(1, 'create_category_fail', 400, error, null);
    }
  },

  getOne: function(accessUserId, accessUserType, id, callback) {
    try {
      Category.findOne({
        where: {id: id},
      }).then(function(category) {
        if (!category) {
          return callback(1, 'wrong_category,', 400, 'wrong category', null);
        }
        if (category.deleted) {
          return callback(1, 'category_deleted,', 403, 'category has been deleted', null);
        }
        return callback(null, null, 200, null, category);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error, null);
      });
    } catch (error) {
      return callback(1, 'get_category_fail', 400, error, null);
    }
  },

  getAll: function(accessUserId, accessUserType, fillter, sort, search, page, limit, callback) {
    try {
      const query ={
        where: {
          deleted: constant.BOOLEAN_ENUM.FALSE,
        },
      };
      supporter.pasteQuery(Category, query, fillter, sort, search, page, limit);
      Category.findAndCountAll(query).then(function(result) {
        const paginationResult = supporter.paginationResult(result, page, limit);
        return callback(null, null, 200, null, paginationResult);
      }).catch(function(error) {
        return callback(1, 'query_fail', 400, error.message, null);
      });
    } catch (error) {
      return callback(1, 'get_categories_fail', 400, error, null);
    }
  },

  update: function(accessUserId, accessUserType, id, data, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.AGENT) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get category
        function(next) {
          Category.findOne({
            where: {
              id: id,
            },
          }).then(function(category) {
            if (!category) {
              return callback(1, 'wrong_category', 403, 'wrong category', null);
            }
            if (category.deleted) {
              return callback(1, 'category_deleted', 403, 'category has been deleted', null);
            }
            if (accessUserType < constant.USER_TYPE_ENUM.ADMIN && category.createdBy != accessUserId) {
              return callback(1, 'permission_denied', 403, 'permission denied', null);
            }
            next(null, category);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },

        // update category
        function(category, next) {
          category.name = data.name,
          category.description = data.description,
          category.updatedAt = moment().format();
          category.save({validate: false}).then(function(category) {
            next(null, category);
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
              return callback(true, 'update_category_fail', 400, error, null);
            }
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'update_category_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'update_category_fail', 420, error, null);
    }
  },

  delete: function(accessUserId, accessUserType, id, callback) {
    try {
      if (accessUserType < constant.USER_TYPE_ENUM.ADMIN) {
        return callback(1, 'permission_denied', 403, 'permission denied', null);
      }

      async.waterfall([
        // get category
        function(next) {
          Category.findOne({
            where: {
              id: id,
            },
            include: [
              {
                model: Book,
                as: 'books',
                where: {
                  deleted: constant.BOOLEAN_ENUM.FALSE,
                },
                required: false,
              },
            ],
          }).then(function(category) {
            if (!category) {
              return callback(1, 'wrong_category', 403, 'wrong category', null);
            }
            if (category.deleted) {
              return callback(1, 'category_deleted', 403, 'category has been deleted', null);
            }
            if (category.books.length > 0) {
              return callback(1, 'can_not_delete_category', 403, 'can not delete the category has books', null);
            }
            next(null, category);
          }).catch(function(error) {
            return callback(true, 'query_fail', 400, error, null);
          });
        },
        // delete category
        function(category, next) {
          category.deleted = constant.BOOLEAN_ENUM.TRUE;
          category.deletedAt = moment().format();
          category.save().then(function(category) {
            next(null, category);
          }).catch(function(error) {
            return callback(true, 'delete_category_fail', 400, error, null);
          });
        },
      ], function(error, result) {
        if (error) {
          return callback(true, 'delete_category_fail', 400, error, null);
        }
        return callback(null, null, 200, null, result);
      });
    } catch (error) {
      return callback(1, 'delete_book_fail', 400, error, null);
    }
  },
};

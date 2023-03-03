// const config = require('../configs/general.config');
const categoryManager = require('../managers/category.manager');
const rest = require('../utils/restware.utils');
// const constant = require('../utils/constant.utils');

module.exports = {
  create: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const data = req.body || '';
    categoryManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getOne: function(req, res) {
    const id = req.params.id || '';
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.query.accessUserType || 0;
    categoryManager.getOne(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getAll: function(req, res) {
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.query.accessUserType || 0;
    const filter = req.query.filter || '';
    const sort = req.query.sort || '';
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = req.query.limit || Number.MAX_SAFE_INTEGER;
    categoryManager.getAll(accessUserId, accessUserType, filter, sort, search, page, limit, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  update: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const id = req.params.id || '';
    const data = req.body || '';
    categoryManager.update(accessUserId, accessUserType, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  delete: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const id = req.params.id || '';
    categoryManager.delete(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },
};

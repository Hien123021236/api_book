// const config = require('../configs/general.config');
const orderManager = require('../managers/order.manager');
const rest = require('../utils/restware.utils');
// const constant = require('../utils/constant.utils');

module.exports = {
  create: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const data = req.body || '';
    orderManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getOne: function(req, res) {
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.query.accessUserType || 0;
    const id = req.params.id || '';
    orderManager.getOne(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getAll: function(req, res) {
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const filter = req.query.filter || '';
    const sort = req.query.sort || '';
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = req.query.limit || Number.MAX_SAFE_INTEGER;
    orderManager.getAll(accessUserId, filter, sort, search, page, limit, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  update: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const id = req.params.id || '';
    const data = req.body || '';
    orderManager.update(accessUserId, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
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
    orderManager.delete(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },
};

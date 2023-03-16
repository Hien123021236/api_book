// const config = require('../configs/general.config');
const commentManager = require('../managers/comment.manager');
const rest = require('../utils/restware.utils');
// const constant = require('../utils/constant.utils');

module.exports = {
  create: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const data = req.body || '';
    commentManager.create(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
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
    commentManager.getOne(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getAllWithAuth: function(req, res) {
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.query.accessUserType || 0;
    const filter = req.query.filter || '';
    const sort = req.query.sort || '';
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = req.query.limit || Number.MAX_SAFE_INTEGER;
    commentManager.getAllWithAuth(accessUserId, accessUserType, filter, sort, search, page, limit, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  getAllWithoutAuth: function(req, res) {
    const accessUserId = req.query.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.query.accessUserType || 0;
    const filter = req.query.filter || '';
    const sort = req.query.sort || '';
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = req.query.limit || Number.MAX_SAFE_INTEGER;
    commentManager.getAllWithoutAuth(accessUserId, accessUserType, filter, sort, search, page, limit, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  verify: function(req, res) {
    const id = req.params.id || '';
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    commentManager.verify(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  unverify: function(req, res) {
    const id = req.params.id || '';
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    commentManager.unverify(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  delete: function(req, res) {
    const id = req.params.id || '';
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    commentManager.delete(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },
};

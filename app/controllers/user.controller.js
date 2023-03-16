// const config = require('../configs/general.config');
const userManager = require('../managers/user.manager');
const rest = require('../utils/restware.utils');
// const constant = require('../utils/constant.utils');

module.exports = {
  create: function(req, res) {
    const data = req.body || '';
    userManager.create(data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      const resData = {};
      resData.id = result.id;
      resData.username = result.username;
      resData.email = result.email;
      return rest.sendSuccessOne(res, resData, httpCode);
    });
  },

  createByAdmin: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const data = req.body || '';
    userManager.createByAdmin(accessUserId, accessUserType, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      const resData = {};
      resData.id = result.id;
      resData.username = result.username;
      resData.email = result.email;
      resData.type = result.type;
      return rest.sendSuccessOne(res, resData, httpCode);
    });
  },

  getOne: function(req, res) {
    const id = req.params.id || '';
    const accessUserId = req.query.accessUserId;
    userManager.getOne(id, accessUserId, function(errorCode, errorMessage, httpCode, errorDescription, result) {
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
    const page = req.query.pageNumber || 1;
    const limit = req.query.pageSize || Number.MAX_SAFE_INTEGER;
    userManager.getAll(accessUserId, accessUserType, filter, sort, search, page, limit, function(errorCode, errorMessage, httpCode, errorDescription, result) {
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
    userManager.update(accessUserId, accessUserType, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      const resData = {};
      resData.id = result.id;
      resData.username = result.username;
      resData.email = result.email;
      return rest.sendSuccessOne(res, resData, httpCode);
    });
  },

  delete: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const id = req.params.id || '';
    userManager.delete(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  login: function(req, res) {
    const data = req.body || '';
    userManager.login(data, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      const resData = {};
      resData.id = result.id;
      resData.username = result.username;
      resData.email = result.email;
      resData.type = result.type;
      return rest.sendSuccessToken(res, result.generateToken(), resData);
    });
  },

  verifyEmailToken: function(req, res) {
    const token = req.query.token || '';
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    userManager.verifyEmailToken(accessUserId, accessUserType, token, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  requestPasswordReset: function(req, res) {
    const email = req.body.email ||'';
    userManager.requestPasswordReset(email, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  resetPassword: function(req, res) {
    const email = req.body.email || '';
    const token = req.body.token || '';
    const newPassword = req.body.newPassword ||'';
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    userManager.resetPassword(accessUserId, accessUserType, email, token, newPassword, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },

  verify: function(req, res) {
    const token = req.body.token || '';
    userManager.verify(token, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      const resData = {};
      resData.id = result.id;
      resData.username = result.username;
      resData.email = result.email;
      resData.type = result.type;
      return rest.sendSuccessToken(res, result.generateToken(), resData);
    });
  },

  deleteUserWishes: function(req, res) {
    const accessUserId = req.body.accessUserId || global.INFO.anonymousId;
    const accessUserType = req.body.accessUserType || 0;
    const id = req.params.id || '';
    userManager.deleteUserWishes(accessUserId, accessUserType, id, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },
};

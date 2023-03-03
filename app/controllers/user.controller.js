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

  update: function(req, res) {
    const accessUserId = req.body.accessUserId;
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
      return rest.sendSuccessOne(res, resData, httpCode);
    });
  },

  delete: function(req, res) {
    const accessUserId = req.body.accessUserId;
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
    const username = req.body.username || '';
    const password = req.body.password || '';
    userManager.login(username, password, function(errorCode, errorMessage, httpCode, errorDescription, result) {
      if (errorCode) {
        return rest.sendError(res, errorCode, errorMessage, httpCode, errorDescription);
      }
      return rest.sendSuccessOne(res, result, httpCode);
    });
  },
};

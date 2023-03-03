const config = require('../configs/general.config');

const LoggerUtils = function() {};

// allow log level -> 0: disable, 1 -> error, 2 -> debug, 3 -> info
const enableLog = config.enableLog;

LoggerUtils.prototype.info = function(logText) {
  if (enableLog >= 3) {
    console.log('Info:::::' + new Date());
    console.log(logText);
  }
};

LoggerUtils.prototype.debug = function(logText) {
  if (enableLog >= 2) {
    console.log('Debug:::::' + new Date());
    console.log(logText);
  }
};

LoggerUtils.prototype.error = function(logText) {
  if (enableLog >= 1) {
    console.log('Error:::::' + new Date());
    console.log(logText);
  }
};

module.exports = new LoggerUtils();

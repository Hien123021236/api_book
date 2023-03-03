const fs = require('fs');
const async = require('async');
const path = require('path');
const config = require('../configs/general.config');

class UploadService {
  static uploadFile(file, callback) {
    fs.copyFile(file.path, path.resolve('public', 'files', file.filename), function(error) {
      if (error) {
        callback(error);
      };
      callback(null, {
        name: file?.fieldname,
        filename: file?.filename,
        originalname: file?.originalname,
        mimetype: file?.mimetype,
        url: `${config.apiUrl}/public/files/${file.filename}`,
      });
    });
  }

  static uploadFiles(files, callback) {
    const results = [];
    async.eachSeries(files, function(file, next) {
      UploadService.uploadFile(file, function(error, result) {
        if (error) {
          next(error);
        } else {
          results.push(result);
          next();
        }
      });
    }, function(error) {
      if (error) {
        callback(error);
      } else {
        callback(null, results);
      }
    });
  }
}

module.exports = UploadService;

const async = require('async');
const fs = require('fs');
const path = require('path');
const sendgrid = require('@sendgrid/mail');
const config = require('../configs/general.config');

class EmailService {
  static send({to, subject, template, data}, callback) {
    async.waterfall([
      // read template
      function(next) {
        async.parallel([
          // read .html template
          function(next) {
            fs.readFile(path.resolve('app', 'mail', 'templates', `${template}.html`), function(error, buffer) {
              if (error) {
                next(null, null);
              } else {
                next(null, buffer.toString());
              }
            });
          },
          // read .txt template
          function(next) {
            fs.readFile(path.resolve('app', 'mail', 'templates', `${template}.txt`), function(error, buffer) {
              if (error) {
                next(null, null);
              } else {
                next(null, buffer.toString());
              }
            });
          },
        ], function(error, [html, text]) {
          if (error) {
            next(error);
          } else {
            next(null, html, text);
          }
        });
      },
      // replace
      function(html, text, next) {
        try {
          for (const key of Object.keys(data)) {
            if (html) {
              html = html.replaceAll(`{{${key}}}`, data[key]);
            }
            if (text) {
              text = text.replaceAll(`{{${key}}}`, data[key]);
            }
          }
          next(null, html, text);
        } catch (error) {
          next(error);
        }
      },
      // send email
      function(html, text, next) {
        sendgrid.setApiKey(config.sendGridApiKey);
        const msg = {
          to: to,
          from: 'ngochien1011f337@gmail.com',
          subject: subject,
          html: html,
          text: text,
        };
        sendgrid
            .send(msg)
            .then(function(resp) {
              next(null, resp);
            }).catch(function(error) {
              next(error);
            });
      },
    ], function(error, resp) {
      callback && callback(error, resp);
    });
  }

  static sendMailForRegister({to, data}, callback) {
    EmailService.send({
      to,
      subject: 'Thank for Registation',
      template: 'register',
      data,
    }, callback);
  }

  static sendMailForResetPassword({to, data}, callback) {
    EmailService.send({
      to,
      subject: 'Forgot password link',
      template: 'forgotpassword',
      data,
    }, callback);
  }
};

module.exports = EmailService;

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

module.exports = function(app, multer) {
  fs
      .readdirSync(__dirname)
      .filter((file) => {
        return (file !== basename) && (file.endsWith('.route.js'));
      })
      .forEach((file) => {
        require(path.join(__dirname, file))(app, multer);
      });
};



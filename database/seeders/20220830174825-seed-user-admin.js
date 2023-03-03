/* eslint-disable no-unused-vars */
const bCrypt = require('bcryptjs');
const constant = require('../../app/utils/constant.utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users',
        [
          {
            username: 'admin',
            password: bCrypt.hashSync('admin', 10),
          },
        ],
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users');
  },
};

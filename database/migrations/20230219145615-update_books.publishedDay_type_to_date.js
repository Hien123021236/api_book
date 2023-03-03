'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('books', 'publishedDay', {
      type: Sequelize.DATEONLY,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('books', 'publishedDay', {
      type: Sequelize.STRING(255),
    });
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'books',
      'price',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('books', 'price');
  }
};

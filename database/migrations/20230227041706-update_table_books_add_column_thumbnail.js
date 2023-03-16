'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'books',
        'thumbnail',
        {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('books', 'thumbnail');
  },
};


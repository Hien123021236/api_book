'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'books',
          'series',
          {
            type: Sequelize.DataTypes.STRING(500),
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'books',
          'image1',
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'books',
          'image2',
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'books',
          'image3',
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'books',
          'image4',
          {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
          },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('books', 'series'),
      queryInterface.removeColumn('books', 'image1'),
      queryInterface.removeColumn('books', 'image2'),
      queryInterface.removeColumn('books', 'image3'),
      queryInterface.removeColumn('books', 'image4'),
    ]);
  },
};

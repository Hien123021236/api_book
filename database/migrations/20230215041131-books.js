const constant = require('./../../app/utils/constant.utils.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('books', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      isbn: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      pageCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      authors: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      publishedDay: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      countStar: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalStar: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      activated: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
      },
      deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
      },
      createdBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      deletedBy: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('books');
  },
};

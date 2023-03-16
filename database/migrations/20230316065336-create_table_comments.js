const constant = require('./../../app/utils/constant.utils.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('comments', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      bookId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      star: {
        type: Sequelize.DataTypes.SMALLINT,
        defaultValue: 0,
      },
      comment: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
      },
      displayName: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: true,
      },
      verified: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
      },
      activated: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.TRUE,
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
    return queryInterface.dropTable('comments');
  },
};

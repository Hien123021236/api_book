const constant = require('./../../app/utils/constant.utils.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: true,
      },
      verifyToken: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      verified: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: constant.BOOLEAN_ENUM.FALSE,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

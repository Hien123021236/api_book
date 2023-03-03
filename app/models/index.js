const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const logger = require('../utils/logger.utils');

const models = {};

const connection = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  schema: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  connectionTimeoutMillis: 10000,
};

const database = new Sequelize(
    connection.database,
    connection.username,
    connection.password,
    connection,
);

database.authenticate()
    .then((res) =>
      logger.debug('Connection to database successfully.'),
    ).catch((error) =>
      logger.error('Unable to connect to the database - ' + error),
    );

fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file !== basename) && (file.endsWith('.model.js'));
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(database, Sequelize.DataTypes);
      models[model.name] = model;
    });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.database = database;

module.exports = models;

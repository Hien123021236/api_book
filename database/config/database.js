const app = require('../../process.json').apps[0];
console.log(app.env_development);
const config = {
  development: {
    username: app.env_development.DB_USERNAME,
    password: app.env_development.DB_PASSWORD,
    database: app.env_development.DB_DATABASE,
    port: app.env_development.DB_PORT,
    host: app.env_development.DB_HOST,
    dialect: app.env_development.DB_DIALECT,
  },
  production: {
    username: app.env_production.DB_USERNAME,
    password: app.env_production.DB_PASSWORD,
    database: app.env_production.DB_DATABASE,
    port: app.env_production.DB_PORT,
    host: app.env_production.DB_HOST,
    dialect: app.env_production.DB_DIALECT,
  },
  localhost: {
    username: app.env_localhost.DB_USERNAME,
    password: app.env_localhost.DB_PASSWORD,
    database: app.env_localhost.DB_DATABASE,
    port: app.env_localhost.DB_PORT,
    host: app.env_localhost.DB_HOST,
    dialect: app.env_localhost.DB_DIALECT,
  },
};

module.exports = config;

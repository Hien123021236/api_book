const userController = require('../controllers/user.controller');

module.exports = function(app) {
  app.post('/v1/users', userController.create);
  app.post('/v1/users/login', userController.login);
  app.get('/v1/auth/users/:id', userController.getOne);
  app.put('/v1/auth/users/:id', userController.update);
  app.delete('/v1/auth/users/:id', userController.delete);
};

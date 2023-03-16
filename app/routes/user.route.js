const userController = require('../controllers/user.controller');

module.exports = function(app) {
  app.post('/v1/users', userController.create);
  app.post('/v1/auth/users', userController.createByAdmin);
  app.get('/v1/auth/users/:id', userController.getOne);
  app.get('/v1/auth/users', userController.getAll);
  app.put('/v1/auth/users/:id', userController.update);
  app.delete('/v1/auth/users/:id', userController.delete);
  app.post('/v1/login', userController.login);
  app.post('/v1/verify', userController.verify);
  app.get('/v1/users/verify-email', userController.verifyEmailToken);
  app.post('/v1/users/forgot-password', userController.requestPasswordReset);
  app.post('/v1/users/reset-password', userController.resetPassword);
  app.delete('/v1/auth/users/wishes/:id', userController.deleteUserWishes);
};

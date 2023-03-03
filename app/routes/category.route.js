const categoryController = require('../controllers/category.controller');

module.exports = function(app) {
  app.post('/v1/auth/categories', categoryController.create);
  app.get('/v1/auth/categories/:id', categoryController.getOne);
  app.get('/v1/auth/categories', categoryController.getAll);
  app.put('/v1/auth/categories/:id', categoryController.update);
  app.delete('/v1/auth/categories/:id', categoryController.delete);
};

const bookController = require('../controllers/book.controller');

module.exports = function(app) {
  app.post('/v1/auth/books', bookController.create);
  app.get('/v1/auth/books/series', bookController.getSeries);
  app.get('/v1/auth/books/:id', bookController.getOne);
  app.get('/v1/auth/books', bookController.getAllAuth);
  app.get('/v1/books', bookController.getAllNonAuth);
  app.put('/v1/auth/books/:id', bookController.update);
  app.delete('/v1/auth/books/:id', bookController.delete);
  app.post('/v1/auth/books/:id/images', bookController.uploadImages);
};

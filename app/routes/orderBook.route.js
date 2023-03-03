const orderBookController = require('../controllers/orderBook.controller');

module.exports = function(app) {
  app.post('/v1/auth/order-books', orderBookController.create);
  app.get('/v1/auth/order-books/:id', orderBookController.getOne);
  app.get('/v1/auth/order-books', orderBookController.getAll);
  app.put('/v1/auth/order-books/:id', orderBookController.update);
  app.delete('/v1/auth/order-books/:id', orderBookController.delete);
};

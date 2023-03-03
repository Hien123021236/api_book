const orderController = require('../controllers/order.controller');

module.exports = function(app) {
  app.post('/v1/auth/orders', orderController.create);
  app.get('/v1/auth/orders/:id', orderController.getOne);
  app.get('/v1/auth/orders', orderController.getAll);
  app.put('/v1/auth/orders/:id', orderController.update);
  app.delete('/v1/auth/orders/:id', orderController.delete);
};

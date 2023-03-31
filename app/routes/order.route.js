const orderController = require('../controllers/order.controller');

module.exports = function(app) {
  app.post('/v1/auth/orders', orderController.create);
  app.get('/v1/auth/orders/:id', orderController.getOne);
  app.get('/v1/auth/orders', orderController.getAll);
  app.put('/v1/auth/orders/:id', orderController.update);
  app.delete('/v1/auth/orders/:id', orderController.delete);
  app.post('/v1/auth/orders/:id/apply-coupons', orderController.applyCoupons);
  app.post('/v1/auth/orders/:id/confirm', orderController.confirm);
  app.post('/v1/auth/orders/:id/pay', orderController.pay);
};

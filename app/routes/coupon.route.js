const couponController = require('../controllers/coupon.controller');

module.exports = function(app) {
  app.post('/v1/auth/coupons', couponController.create);
  app.get('/v1/coupons/:id', couponController.getOne);
  app.get('/v1/coupons', couponController.getAll);
  app.patch('/v1/auth/coupons/:id', couponController.update);
  app.delete('/v1/auth/coupons/:id', couponController.delete);
};

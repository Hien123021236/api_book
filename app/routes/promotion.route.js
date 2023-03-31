const promotionController = require('../controllers/promotion.controller');

module.exports = function(app) {
  app.post('/v1/auth/promotions', promotionController.create);
  app.get('/v1/promotions/:id', promotionController.getOne);
  app.get('/v1/promotions', promotionController.getAll);
  app.patch('/v1/auth/promotions/:id', promotionController.update);
  app.delete('/v1/auth/promotions/:id', promotionController.delete);
  app.post('/v1/auth/promotions/:id/book', promotionController.addBook);
  app.post('/v1/auth/promotions/:id/books', promotionController.addBooks);
  app.delete('/v1/auth/promotions/:id/book', promotionController.removeBook);
  app.delete('/v1/auth/promotions/:id/books', promotionController.removeBooks);
  app.get('/v1/promotions/get-by-book/:id', promotionController.getPromotionsByBook);
};

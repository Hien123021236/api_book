const wishController = require('../controllers/wish.controller');

module.exports = function(app) {
  app.post('/v1/auth/wishes', wishController.create);
  app.get('/v1/auth/wishes', wishController.getAll);
  app.delete('/v1/auth/wishes/:id', wishController.delete);
  app.delete('/v1/auth/wishes', wishController.deletes);
};

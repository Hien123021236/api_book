const commentController = require('../controllers/comment.controller');

module.exports = function(app) {
  app.post('/v1/auth/comments', commentController.create);
  app.get('/v1/auth/comments', commentController.getAllWithAuth);
  app.get('/v1/comments', commentController.getAllWithoutAuth);
  app.post('/v1/auth/comments/:id/verify', commentController.verify);
  app.post('/v1/auth/comments/:id/unverify', commentController.unverify);
  app.delete('/v1/auth/comments/:id', commentController.delete);
};

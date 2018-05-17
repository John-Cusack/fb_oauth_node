const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_likes']
    })
  );

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );
};

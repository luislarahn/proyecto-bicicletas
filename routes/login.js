const express = require('express');
const passport = require('../config/passport');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.get('/login', loginController.loginForm);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).render('login/login', {
        title: 'Iniciar sesión',
        error: info && info.message ? info.message : 'Credenciales inválidas'
      });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', loginController.logout);

router.get('/forgot-password', loginController.forgotPasswordForm);
router.post('/forgot-password', loginController.forgotPassword);

router.get('/reset-password/:token', loginController.resetPasswordForm);
router.post('/reset-password/:token', loginController.resetPassword);

module.exports = router;
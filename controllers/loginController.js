exports.loginForm = (req, res) => {
  res.render('login/login', {
    title: 'Iniciar sesión',
    error: null
  });
};

exports.logout = (req, res, next) => {
  req.logout(function(error) {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.redirect('/login');
    });
  });
};
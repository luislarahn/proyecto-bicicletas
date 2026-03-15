const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const emailNormalizado = email.trim().toLowerCase();
      const user = await User.findOne({ email: emailNormalizado });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const isValid = await user.validPassword(password);

      if (!isValid) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      if (!user.verificado) {
        return done(null, false, { message: 'Debe verificar su cuenta antes de iniciar sesión' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
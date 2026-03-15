const crypto = require('crypto');
const User = require('../models/user');
const { sendResetPasswordEmail } = require('../mailer/mailer');

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

exports.forgotPasswordForm = (req, res) => {
  res.render('login/forgot-password', {
    title: 'Recuperar contraseña',
    error: null
  });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).render('login/forgot-password', {
        title: 'Recuperar contraseña',
        error: 'Debe ingresar un correo'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNormalizado });

    if (!user) {
      return res.status(404).render('login/forgot-password', {
        title: 'Recuperar contraseña',
        error: 'No existe un usuario con ese correo'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = rawToken;
    user.passwordResetTokenExpires = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    const resetLink = `http://${req.headers.host}/reset-password/${rawToken}`;
    const previewUrl = await sendResetPasswordEmail(user.email, resetLink);

    res.render('users/message', {
      title: 'Revise su correo',
      message: 'Hemos enviado un correo para restablecer su contraseña.',
      previewUrl,
      actionUrl: '/login',
      actionText: 'Volver al login'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordForm = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).render('users/message', {
        title: 'Token inválido',
        message: 'El enlace de recuperación no es válido o expiró.',
        actionUrl: '/forgot-password',
        actionText: 'Solicitar otro enlace'
      });
    }

    res.render('login/reset-password', {
      title: 'Restablecer contraseña',
      token,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).render('login/reset-password', {
        title: 'Restablecer contraseña',
        token,
        error: 'Debe ingresar una nueva contraseña'
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).render('users/message', {
        title: 'Token inválido',
        message: 'El enlace de recuperación no es válido o expiró.',
        actionUrl: '/forgot-password',
        actionText: 'Solicitar otro enlace'
      });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    res.render('users/message', {
      title: 'Contraseña actualizada',
      message: 'Su contraseña fue restablecida correctamente.',
      actionUrl: '/login',
      actionText: 'Ir al login'
    });
  } catch (error) {
    next(error);
  }
};
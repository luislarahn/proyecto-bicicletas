const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../models/token');
const { sendWelcomeEmail } = require('../mailer/mailer');

exports.registerForm = (req, res) => {
  res.render('users/register', {
    title: 'Registro de usuario'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('users/register', {
        title: 'Registro de usuario',
        error: 'Email y contraseña son obligatorios',
        email
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailNormalizado });
    if (existingUser) {
      return res.status(400).render('users/register', {
        title: 'Registro de usuario',
        error: 'El correo ya está registrado',
        email: emailNormalizado
      });
    }

    const user = new User({
      email: emailNormalizado,
      password
    });

    await user.save();

    const rawToken = crypto.randomBytes(32).toString('hex');

    const token = new Token({
      userId: user._id,
      token: rawToken
    });

    await token.save();

    const verificationLink = `http://${req.headers.host}/users/verify/${rawToken}`;
    const previewUrl = await sendWelcomeEmail(user.email, verificationLink);

    res.render('users/message', {
      title: 'Revise su correo',
      message: 'Usuario creado correctamente. Hemos enviado un correo de bienvenida con el enlace de verificación.',
      previewUrl,
      actionUrl: '/users/register',
      actionText: 'Registrar otro usuario'
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;

    const tokenDoc = await Token.findOne({ token });

    if (!tokenDoc) {
      return res.status(400).render('users/message', {
        title: 'Token inválido',
        message: 'El enlace de verificación no es válido o ya expiró.',
        actionUrl: '/users/register',
        actionText: 'Volver al registro'
      });
    }

    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      return res.status(400).render('users/message', {
        title: 'Usuario no encontrado',
        message: 'No se encontró el usuario asociado a este token.',
        actionUrl: '/users/register',
        actionText: 'Volver al registro'
      });
    }

    user.verificado = true;
    await user.save();

    await Token.deleteOne({ _id: tokenDoc._id });

    res.render('users/message', {
      title: 'Cuenta verificada',
      message: 'Su cuenta fue verificada correctamente.',
      actionUrl: '/',
      actionText: 'Volver al inicio'
    });
  } catch (error) {
    next(error);
  }
};
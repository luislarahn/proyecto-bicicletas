const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { sendResetPasswordEmail } = require('../../mailer/mailer');

exports.authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y password son obligatorios'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNormalizado });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    const isValid = await user.validPassword(password);

    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Contraseña incorrecta'
      });
    }

    if (!user.verificado) {
      return res.status(401).json({
        status: 'error',
        message: 'Debe verificar su cuenta antes de autenticarse'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      req.app.get('secretKey'),
      { expiresIn: '24h' }
    );

    return res.json({
      status: 'success',
      token
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe enviar un email'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNormalizado });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No existe un usuario con ese correo'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = rawToken;
    user.passwordResetTokenExpires = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    const resetLink = `http://${req.headers.host}/reset-password/${rawToken}`;
    const previewUrl = await sendResetPasswordEmail(user.email, resetLink);

    return res.json({
      status: 'success',
      message: 'Correo de recuperación enviado',
      previewUrl
    });
  } catch (error) {
    next(error);
  }
};
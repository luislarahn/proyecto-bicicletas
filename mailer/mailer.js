const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'dominic.stiedemann26@ethereal.email',
    pass: 'dTYYDmhJnERYNKa4ka'
  }
});

async function sendWelcomeEmail(to, verificationLink) {
  const info = await transporter.sendMail({
    from: '"Proyecto Bicicletas" <no-reply@bicicletas.com>',
    to,
    subject: 'Bienvenido - Verifica tu cuenta',
    text: `Bienvenido al proyecto Bicicletas. Verifica tu cuenta aquí: ${verificationLink}`,
    html: `
      <h2>Bienvenido al proyecto Bicicletas</h2>
      <p>Gracias por registrarte.</p>
      <p>Para verificar tu cuenta, haz clic en el siguiente enlace:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
    `
  });

  return nodemailer.getTestMessageUrl(info);
}

async function sendResetPasswordEmail(to, resetLink) {
  const info = await transporter.sendMail({
    from: '"Proyecto Bicicletas" <no-reply@bicicletas.com>',
    to,
    subject: 'Recuperación de contraseña',
    text: `Para restablecer tu contraseña, entra aquí: ${resetLink}`,
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este enlace expirará pronto.</p>
    `
  });

  return nodemailer.getTestMessageUrl(info);
}

module.exports = { sendWelcomeEmail, sendResetPasswordEmail };
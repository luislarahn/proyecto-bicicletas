const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetTokenExpires: {
    type: Date,
    default: null
  },
  verificado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.password = hashedPassword;
});

UserSchema.methods.validPassword = async function(passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', UserSchema);
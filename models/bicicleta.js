const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BicicletaSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  color: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  ubicacion: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'La ubicación debe tener [lat, lng]'
    }
  }
});

module.exports = mongoose.model('Bicicleta', BicicletaSchema);
const Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = async function (req, res) {
  try {
    const bicicletas = await Bicicleta.find({});
    res.status(200).json({ bicicletas: bicicletas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bicicleta_show = async function (req, res) {
  try {
    const bici = await Bicicleta.findOne({ id: req.params.id });

    if (!bici) {
      return res.status(404).json({ error: 'Bicicleta no encontrada' });
    }

    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bicicleta_create = async function (req, res) {
  try {
    const bici = new Bicicleta({
      id: parseInt(req.body.id),
      color: req.body.color,
      modelo: req.body.modelo,
      ubicacion: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
    });

    await bici.save();
    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bicicleta_update = async function (req, res) {
  try {
    const bici = await Bicicleta.findOne({ id: req.body.id });

    if (!bici) {
      return res.status(404).json({ error: 'Bicicleta no encontrada' });
    }

    bici.color = req.body.color || bici.color;
    bici.modelo = req.body.modelo || bici.modelo;

    const lat = req.body.lat !== undefined ? parseFloat(req.body.lat) : bici.ubicacion[0];
    const lng = req.body.lng !== undefined ? parseFloat(req.body.lng) : bici.ubicacion[1];

    bici.ubicacion = [lat, lng];

    await bici.save();

    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bicicleta_delete = async function (req, res) {
  try {
    const bici = await Bicicleta.findOneAndDelete({ id: req.body.id });

    if (!bici) {
      return res.status(404).json({ error: 'Bicicleta no encontrada' });
    }

    res.status(200).json({ bicicleta: bici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
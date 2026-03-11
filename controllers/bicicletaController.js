const Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function (req, res) {
  res.status(200).json({ bicicletas: Bicicleta.allBicis });
};

exports.bicicleta_show = function (req, res) {
  const bici = Bicicleta.findById(req.params.id);

  if (!bici) {
    return res.status(404).json({ error: 'Bicicleta no encontrada' });
  }

  res.status(200).json({ bicicleta: bici });
};

exports.bicicleta_create = function (req, res) {
  const bici = new Bicicleta(
    req.body.id,
    req.body.color,
    req.body.modelo,
    [req.body.lat, req.body.lng]
  );

  Bicicleta.add(bici);
  res.status(200).json({ bicicleta: bici });
};

exports.bicicleta_update = function (req, res) {
  const bici = Bicicleta.findById(req.body.id);

  if (!bici) {
    return res.status(404).json({ error: 'Bicicleta no encontrada' });
  }

  bici.color = req.body.color || bici.color;
  bici.modelo = req.body.modelo || bici.modelo;
  bici.ubicacion = [
    req.body.lat || bici.ubicacion[0],
    req.body.lng || bici.ubicacion[1]
  ];

  res.status(200).json({ bicicleta: bici });
};

exports.bicicleta_delete = function (req, res) {
  const bici = Bicicleta.removeById(req.body.id);
  res.status(200).json({ bicicleta: bici });
};
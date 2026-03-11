const express = require('express');
const router = express.Router();
const bicicletaController = require('../controllers/bicicletaController');

router.get('/bicicletas', bicicletaController.bicicleta_list);
router.get('/bicicletas/:id', bicicletaController.bicicleta_show);
router.post('/bicicletas/create', bicicletaController.bicicleta_create);
router.post('/bicicletas/update', bicicletaController.bicicleta_update);
router.post('/bicicletas/delete', bicicletaController.bicicleta_delete);

module.exports = router;
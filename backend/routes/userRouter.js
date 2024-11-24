const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/dodaj', userController.dodajUporabnika);
router.get('/vsi', userController.vsiUporabniki);
router.get('/:email', userController.najdiUporabnika);
router.put('/:email', userController.spremeniUporabnika);
router.delete('/:email', userController.izbrisiUporabnika);

module.exports = router;
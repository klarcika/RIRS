const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/dodaj', expenseController.dodajStrosek);
router.get('/vsi', expenseController.vsiStroski);
router.get("/oseba", expenseController.stroskiPoOsebi);
router.get("/vsota", expenseController.vsotaStroskovPoOsebi);
router.get('/:id', expenseController.najdiStrosek);
router.put('/:id', expenseController.spremeniStrosek);
router.delete('/:id', expenseController.izbrisiStrosek);

module.exports = router;
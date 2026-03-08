const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/', userController.runUser);
router.get('/:id', userController.getUser);

module.exports = router;
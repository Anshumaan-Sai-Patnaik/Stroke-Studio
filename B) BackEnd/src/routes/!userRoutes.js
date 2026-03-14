const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/signin', userController.runUser);
router.get('/signout', userController.quitUser);

router.get('/:id', userController.getUser);
router.patch('/:id/update', userController.updateUser);

router.delete('/:id/delete', userController.deleteUser);

module.exports = router;
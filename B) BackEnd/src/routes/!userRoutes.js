const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const upload = require("../middleware/upload");

router.post('/upload-avatar', upload.single("image"), userController.avatarUpload);


router.post('/register', userController.makeUser);
router.post('/signin', userController.runUser);
router.get('/signout', userController.quitUser);

router.get('/:id', userController.getUser);
router.patch('/:id/update-profile', userController.updateUserProfile);
router.patch('/:id/update-list', userController.updateUserList);

router.delete('/:id/delete', userController.deleteUser);

module.exports = router;
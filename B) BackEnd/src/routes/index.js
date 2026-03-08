const express = require('express');
const router = express.Router();

router.use('/home', require('./!homeRoutes'));
router.use('/gallery', require('./!galleryRoutes'));
router.use('/user', require('./!userRoutes'))

module.exports = router;
const express = require('express');
const router = express.Router();

router.use('/home', require('./homeRoutes'));
router.use('/gallery', require('./galleryRoutes'));

module.exports = router;
const express = require('express');
const router = express.Router();

router.use('/home', require('./homeRoutes'));

module.exports = router;
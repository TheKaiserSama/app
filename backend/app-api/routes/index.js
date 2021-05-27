const express = require('express');
const router = express.Router();

const privateRoutes = require('./privateRoutes');
const authenticateJwt = require('../middlewares/authenticateJwt');

// router.use(authenticateJwt);
router.use(privateRoutes);

module.exports = router;
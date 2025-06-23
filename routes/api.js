const express = require('express');
const router = express.Router();
const { strictMediaAccess } = require('../utils/utils');
const ApiController = require('../controllers/api.controller');
const { asyncHandler } = require('../middlewares/checkAuth');

router.get('/audio', strictMediaAccess, asyncHandler(ApiController.streamAudio));

module.exports = router;

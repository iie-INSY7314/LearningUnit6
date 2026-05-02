const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validateAuthInput');
const { authLimiter } = require('../middleware/rateLimiters');

router.post('/register', authLimiter, validateRegisterInput, register);
router.post('/login', authLimiter, validateLoginInput, login);
router.get('/me', protect, getProfile);

module.exports = router;

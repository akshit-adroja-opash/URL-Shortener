const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/user.controller.js');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../validators/auth.validators');

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));

module.exports = router;

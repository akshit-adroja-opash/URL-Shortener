const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { createLink, listLinks, getLinkDetails, deleteLink } = require('../controller/url.controller.js');
const {
  createLinkSchema,
  linkIdParamSchema,
} = require('../validators/link.validators');

router.use(auth);

router.post('/', validate(createLinkSchema), asyncHandler(createLink));
router.get('/', asyncHandler(listLinks));
router.get('/:id', validate(linkIdParamSchema, 'params'), asyncHandler(getLinkDetails));
router.delete('/:id', validate(linkIdParamSchema, 'params'), asyncHandler(deleteLink));

module.exports = router;


const Joi = require('joi');

const normalizeUrl = (value, helpers) => {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(candidate);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return helpers.error('string.uri');
    }

    return candidate;
  } catch (error) {
    return helpers.error('string.uri');
  }
};

const createLinkSchema = Joi.object({
  longUrl: Joi.string().trim().custom(normalizeUrl).optional(),
  originalUrl: Joi.string().trim().custom(normalizeUrl).optional(),
}).or('longUrl', 'originalUrl');

const linkIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

module.exports = {
  createLinkSchema,
  linkIdParamSchema,
};

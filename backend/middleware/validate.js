const AppError = require('../utils/AppError');

const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(new AppError(400, 'Validation failed', 'VALIDATION_ERROR', error.details));
  }

  req[property] = value;
  next();
};

module.exports = validate;

const { StatusCodes } = require('http-status-codes');

const handleCastErrorDB = (customError, err) => {
  customError.message = `No item found with ID: ${err.value}`;
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleDuplicateFieldsDB = (customError, err) => {
  const value = err.message.match(/(["'])(\\?.)/)[0];
  customError.message = `Duplicate field value: ${value}, Please use another value!`;
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const handleValidationErrorDB = (customError, err) => {
  customError.message = Object.values(err.errors)
    .map((item) => item.message)
    .join(', ');
  customError.statusCode = StatusCodes.BAD_REQUEST;
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went very wrong',
    status: err.status,
    stack: err.stack,
  };

  if (err.name === 'CastError') handleCastErrorDB(customError, err);
  if (err.code && err.code === 11000) handleDuplicateFieldsDB(customError, err);
  if (err.name === 'ValidationError') handleValidationErrorDB(customError, err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(customError, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(customError, res);
  }
};

module.exports = errorHandlerMiddleware;

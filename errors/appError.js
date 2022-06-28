const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
  constructor(message) {
    super(message);

    this.status = 'error';
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = AppError;

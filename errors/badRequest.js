const { StatusCodes } = require('http-status-codes');
const AppError = require('./appError');

class BadRequestError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;

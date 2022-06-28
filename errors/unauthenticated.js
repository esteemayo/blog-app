const { StatusCodes } = require('http-status-codes');
const AppError = require('./appError');

class UnauthenticatedError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;

const { StatusCodes } = require('http-status-codes');
const AppError = require('./appError');

class NotFoundError extends AppError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;

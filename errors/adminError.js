export class AdminError extends Error {
  constructor(errorCode, responseCode, type, message, details) {
    super(message);
    this.errorCode = errorCode;
    this.responseCode = responseCode;
    this.type = type;
    this.details = details;
  }
}

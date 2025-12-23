// src/utils/AppError.js

import AppErrorCode from "../constants/appErrorCode.js";

/**
 * @import { HttpStatusCode } from "../constants/http.js"
 */

class AppError extends Error {
  /**
   * @param {HttpStatusCode} statusCode
   * @param {string} message
   * @param {AppErrorCode=} errorCode
   */
  constructor(statusCode, message, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default AppError;

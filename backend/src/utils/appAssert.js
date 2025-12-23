// src/utils/appAssert.js

import assert from "node:assert";
import AppError from "./AppError.js";
import AppErrorCode from "../constants/appErrorCode.js";

/**
 * @import { HttpStatusCode } from "../constants/http.js"
 */

/**
 * @typedef {(
 *   condition: any,
 *   httpStatusCode: HttpStatusCode,
 *   message: string,
 *   appErrorCode?: AppErrorCode
 * ) => asserts condition} AppAssert
 */

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 * @type {AppAssert}
 */
const appAssert = (condition, httpStatusCode, message, appErrorCode) =>
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;

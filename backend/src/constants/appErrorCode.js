// src/constants/appErrorCode.js

const AppErrorCode = Object.freeze({
  INVALID_ACCESS_TOKEN: "InvalidAccessToken",
  USER_MISSING_EMAIL_PASSWORD: "UserMissingEmailPassword",
  USER_EMAIL_EXISTS: "UserEmailExists",
  USER_INVALID_CREDENTIALS: "UserInvalidCredentials",
  TODO_MISSING_LIST: "TodoMissingList",
  TODO_MISSING_TITLE: "TodoMissingTitle",
  TODO_NOT_FOUND: "TodoNotFound",
  LIST_NOT_FOUND: "ListNotFound",
  LIST_MISSING_TITLE: "ListMissingTitle",
});

export default AppErrorCode;

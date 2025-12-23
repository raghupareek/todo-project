import { INTERNAL_SERVER_ERROR } from "../constants/http.js";

const errorHandler = (err, req, res, next) => {
  // Log the error stack in development mode
  if (process.env.NODE_ENV === "development") {
    console.error(`Error on path ${req.path}:`, err.stack);
  } else {
    console.error(`Error on path ${req.path}:`, err.message);
  }

  // Custom error format
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode || null,
    });
  }

  // Default to 500
  res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
};

export default errorHandler;

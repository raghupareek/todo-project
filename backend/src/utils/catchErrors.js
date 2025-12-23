// catchErrors.js

const catchErrors = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      // pass error to global error handler
      next(error);
    }
  };
};

export default catchErrors;

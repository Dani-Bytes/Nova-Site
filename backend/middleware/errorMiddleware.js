import { ApiError } from "../utils/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === "CastError" ? 400 : 500);
  const message = err.message || "Server error";

  res.status(statusCode).json({ message });
};

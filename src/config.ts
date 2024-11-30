require("dotenv").config();

export const getPort = () => {
  return process.env.PORT || 5000;
};

export const getMongoUrl = () => {
  return process.env.MONGO_URL || "";
};

export const getCorsAllowedOrigins = () => {
  const allowedOrigins = process.env.CorsAllowedOrigins || "";
  return allowedOrigins.split(",");
};

export const getEnv = () => {
  return process.env.ENV || "";
};

export const getJwtSecret = () => {
  return process.env.JWT_SECRET || "";
};

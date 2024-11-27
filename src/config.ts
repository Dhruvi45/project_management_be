require("dotenv").config();

export const getPort = () => {
  return process.env.PORT || 5000;
};

export const getMongoUrl = () => {
    return process.env.MONGO_URL || '';
  };
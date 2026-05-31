const mongoose = require("mongoose");

const { env } = require("./env");
const logger = require("./logger");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  logger.info("MongoDB connection established");
};

module.exports = { connectDatabase };

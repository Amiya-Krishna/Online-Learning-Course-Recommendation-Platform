require("dotenv").config();

const { createApp } = require("./src/app");
const { connectDatabase } = require("./src/config/db");
const { env } = require("./src/config/env");
const logger = require("./src/config/logger");

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

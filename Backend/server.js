const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

const PORT = env.port || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  app.listen(PORT, () => {
    console.log(`MedAssist server running on port ${PORT} [${env.nodeEnv}]`);
  });
};

startServer();
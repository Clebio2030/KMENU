import 'dotenv/config';
import gracefulShutdown from "http-graceful-shutdown";
import https from 'https';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cron from "node-cron";
import { initIO } from "./libs/socket";
import logger from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";
import Company from "./models/Company";
import BullQueue from './libs/queue';
import { startQueueProcess } from "./queues";
import flowBuilderRoutes from './routes/flowBuilderRoutes';
import app from "./app"; 



const PORT = process.env.PORT || 5000;

const startServer = async (server) => {
  const companies = await Company.findAll({
    where: { status: true },
    attributes: ["id"]
  });

  const allPromises = companies.map(c => StartAllWhatsAppsSessions(c.id));

  Promise.all(allPromises).then(async () => {
    await startQueueProcess();
  });

  if (process.env.REDIS_URI_ACK && process.env.REDIS_URI_ACK !== '') {
    BullQueue.process();
  }

  logger.info(`Server started on port: ${PORT}`);
  initIO(server);
  gracefulShutdown(server);
};

if (process.env.CERTIFICADOS === "true") {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CRT_FILE)
  };

    const server = https.createServer(httpsOptions, app).listen(PORT, () => {
    startServer(server);
    logger.info(`Server started on port: ${PORT} with HTTPS`);
  });
} else {
    const server = app.listen(PORT, () => {
    startServer(server);
    logger.info(`Server started on port: ${PORT}`);
  });
}

process.on("uncaughtException", err => {
  console.error(`${new Date().toUTCString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  console.error(`${new Date().toUTCString()} unhandledRejection:`, reason, p);
  process.exit(1);
});
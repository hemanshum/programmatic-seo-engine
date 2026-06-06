import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(process.env.PORT || 3001, () => {
    console.log(`CMS API running on http://localhost:${process.env.PORT || 3001}`);
  });
};

start();

// Vercel serverless wrapper for NestJS API
const serverless = require('serverless-http');
const { NestFactory } = require('@nestjs/core');
// Import the compiled AppModule after build
const { AppModule } = require('./dist/apps/api/src/app.module');

let cachedHandler = null;

module.exports.handler = async (event, context) => {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule);
    await app.init(); // Initialize without listening
    const expressApp = app.getHttpAdapter().getInstance();
    cachedHandler = serverless(expressApp);
  }
  return cachedHandler(event, context);
};

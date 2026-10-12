/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
// import dotenv from "dotenv";
// dotenv.config("./.env.local");
import { logger } from "./logger/logger.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
export const lambdaHandler = async (event, context) => {
  logger.info("Received event: " + JSON.stringify(event));
  try {
    logger.info("Routing event to inventoryRoutes");
    return await inventoryRoutes(event);

  } catch (error) {

    console.error(error);

    return error;
  }
};

import { createInventory, getInventory, updateStock } from "../controllers/inventoryController.js"
import { logger } from "../logger/logger.js";
export const inventoryRoutes = async (event) => {
  logger.info("Inside inventoryRoutes");
  // logger.log(event);
  const productId = Number(event.pathParameters?.id);
  const quantity = Number(event.queryStringParameters?.quantity);
  logger.info("Product ID: " + productId);
  logger.info("Quantity: " + quantity);
  logger.info("event.httpMethod" + event.httpMethod);


  if (event.httpMethod === "GET" && productId && quantity) {
    const resp = await getInventory(productId, quantity);
    return resp;
  }
  else if (event.httpMethod === "POST" && productId) {
    // logger.info("Creating inventory update event for product id: " + productId + " with stock: " + quantity);

    const body = JSON.parse(event.body);

    return await createInventory(productId, body.stock);


  }
  else if (event.httpMethod === "PUT" && productId) {
    // logger.info("Creating inventory update event for product id: " + productId + " with stock: " + quantity);

    const body = JSON.parse(event.body);

    return await updateStock(productId, body.stock);


  }

  return {
    statusCode: 404,
    body: "Route not found",
  };
};
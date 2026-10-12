import { getDB } from "../config/db.js";
import { DataTypes } from "sequelize";
import { InventoryModel } from "../models/inventoryModel.js";
import { OutOfStockError, InvalidProductIdError, InventoryAlreadyExistsError } from "../exceptions/Exceptions.js";
import { logger } from "../logger/logger.js";
import { ProductModel } from "../models/productModel.js";
export const getInventory = async (productId, quantity) => {
  
  const sequelize = getDB();
  try {
    logger.info("Querying inventory for product id: " + productId);

    const Inventory = InventoryModel(sequelize, DataTypes);

    const productInventory = await Inventory.findOne({ where: { product_id: productId } });
    if (productInventory) {
      logger.info("Found inventory for product id: " + productId);
      if (productInventory.stock < quantity) {
        // logger.error(`Out of stock for product id: ${productInventory.product_id}`);
        throw new OutOfStockError(productInventory.product_id);
      }
      else {
        logger.info(`Sufficient stock available for product id: ${productInventory.product_id}`);
        return {
          statusCode: 200,
          body: JSON.stringify({
            product_id: productInventory.product_id,
            stock: productInventory.stock
          })
        }
      }
    }
    else {
      logger.info("Invalid product id: " + productId);
      throw new InvalidProductIdError(productId);
    }
  }
  catch (error) {
    logger.error("Error occurred while querying inventory: " + error);
    if (error instanceof OutOfStockError) {

      return {
        statusCode: 409,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }


    }
    else if (error instanceof InvalidProductIdError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }
    }
    else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "An unexpected error occurred"
        })
      }
    }


  } finally {
    logger.info("Finished processing inventory request for product id: " + productId);
  };
}
export const createInventory = async (productId, quantity) => {
const sequelize = getDB();
  try {
    logger.info("Started creating inventory for product id: " + productId);
    // const sequelize = getDB();

    const Product = ProductModel(sequelize, DataTypes);
    logger.info("Querying product for id: " + productId);

    const product = await Product.findOne({ where: { id: productId } });
    if (product) {
      logger.info("Found Product for product id: " + productId);
      const Inventory = InventoryModel(sequelize, DataTypes);
      let inventoryRecord = await Inventory.findOne({ where: { product_id: productId } });
      if (inventoryRecord) {
        logger.error("Found inventory record for product id: " + productId);
        throw new InventoryAlreadyExistsError(productId);
      }
      else {
        logger.info("Creating inventory record for product id: " + productId);
        inventoryRecord = await Inventory.create({ product_id: productId, stock: quantity });
        return {
          statusCode: 200,
          body: JSON.stringify({
            product_id: inventoryRecord.product_id,
            stock: inventoryRecord.stock,
            message: "Inventory created successfully"
          })
        }
      }
    }
    else {
      logger.info("Invalid product id: " + productId);
      throw new InvalidProductIdError(productId);
    }
  }
  catch (error) {
    logger.error("Error occurred while querying inventory: " + error);

    if (error instanceof InvalidProductIdError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }
    }
    else if (error instanceof InventoryAlreadyExistsError) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }
    }
    else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "An unexpected error occurred"
        })
      }
    }


  } finally {
    logger.info("Finished processing inventory request for product id: " + productId);
  };
}

export const updateStock = async (productId, quantity) => {
  const sequelize = getDB();
   try {
    logger.info("Started updating inventory for product id: " + productId);
    // const sequelize = getDB();

    const Product = ProductModel(sequelize, DataTypes);
    logger.info("Querying product for id: " + productId);

    const p1 = await Product.findOne({ where: { id: productId } });
    if (p1) {
      logger.info("Found Product for product id: " + productId);
      const Inventory = InventoryModel(sequelize, DataTypes);
      let inventoryRecord = await Inventory.findOne({ where: { product_id: productId } });
      if (!inventoryRecord) {
        logger.error("Inventory record not found for product id: " + productId);
        throw new InventoryNotFoundError(productId);
      }
      else {
        logger.info("Updating inventory record for product id: " + productId);
        inventoryRecord = await Inventory.update({ stock: quantity }, { where: { product_id: productId } });
        return {
          statusCode: 200,
          body: JSON.stringify({
            product_id: inventoryRecord.product_id,
            stock: inventoryRecord.stock,
            message: "Inventory updated successfully"
          })
        }
      }
    }
    else {
      logger.info("Invalid product id: " + productId);
      throw new InvalidProductIdError(productId);
    }
  }
  catch (error) {
    logger.error("Error occurred while updating inventory: " + error);

    if (error instanceof InvalidProductIdError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }
    }
    else if (error instanceof InventoryAlreadyExistsError) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          product_id: error.product_id,
          message: error.message
        })
      }
    }
    else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "An unexpected error occurred"
        })
      }
    }


  } finally {
    logger.info("Finished processing inventory request for product id: " + productId);
  };
};
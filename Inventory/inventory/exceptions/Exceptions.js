export class OutOfStockError extends Error {
  constructor(productId) {
    super(`Out of stock: Product id = ${productId}`);
    this.name = "OutOfStockError";
    this.statusCode = 409;
    this.productId = productId;
  }
}
export class InvalidProductIdError extends Error {
  constructor(productId) {
    super(`Invalid product: Product id = ${productId}`);
    this.name = "InvalidProductIdError";
    this.statusCode = 404;
    this.productId = productId;
  }
}

export class InventoryAlreadyExistsError extends Error {
  constructor(productId) {
    super(`Inventory already exists for product: Product id = ${productId}`);
    this.name = "InventoryAlreadyExistsError";
    this.statusCode = 409;
    this.productId = productId;
  }
}
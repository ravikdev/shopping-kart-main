export const InventoryModel = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("inventory", {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Inventory;
};
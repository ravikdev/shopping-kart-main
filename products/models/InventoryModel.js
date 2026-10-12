module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "inventory",
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

//   Inventory.removeAttribute("id"); // 🔴 important

  return Inventory;
};
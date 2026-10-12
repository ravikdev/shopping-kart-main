const dbConfig = require("../config/dbConfig")
const { DataTypes, Sequelize } = require("sequelize")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: console.log,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})
sequelize
  .authenticate()
  .then(() => {
    console.log("connected...")
  })
  .catch((err) => {
    console.log("Error" + err)
  })

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.products = require("./productModel")(sequelize, DataTypes)
db.reviews = require("./reviewModel.js")(sequelize, DataTypes)
db.category = require("./categoryModel")(sequelize, DataTypes)
db.inventory = require("./InventoryModel")(sequelize, DataTypes)

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!")
})

// 1 to Many Relation (reviews under product)

db.products.hasMany(db.reviews, {
  foreignKey: "product_id",
  as: "review",
})

db.reviews.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product",
})

db.products.hasOne(db.inventory, {
  foreignKey: "product_id",
  as: "inventory",
})

db.inventory.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product",
})
// 2 to Many Relation (product under category)

db.products.belongsTo(db.category, {
  foreignKey: "category_id",
  as: "category",
})

db.category.hasMany(db.products, {
  foreignKey: "category_id",
  as: "products",
})

module.exports = db

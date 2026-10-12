import { Sequelize } from "sequelize";

let sequelize;

export const getDB = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
    sequelize
      .authenticate()
      .then(() => {
        console.log("connected...")
      })
      .catch((err) => {
        console.log("Error" + err)
      })
  }

  return sequelize;
};

export default getDB;
import * as Sequelize from "sequelize";
import config from "./config";

const sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(config.database, config.username, config.password, {
        dialect: config.dialect,
        host: config.host,
        operatorsAliases: Sequelize.Op
      })
    : new Sequelize("oyah", "root", "admin", {
        dialect: "mysql",
        host: "localhost",
        operatorsAliases: Sequelize.Op
      });

export default sequelize;

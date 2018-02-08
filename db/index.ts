import * as Sequelize from "sequelize";
import config from "./config.json";

// export default new Sequelize(config.database, config.username, config.password, { dialect: config.dialect, host: config.host, operatorsAliases: Sequelize.Op });
export default new Sequelize("oyah", "admin", "admin", { dialect: "mysql", host: "localhost", operatorsAliases: Sequelize.Op });
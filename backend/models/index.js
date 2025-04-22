
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const EmailSetup = require("./EmailSetup")(sequelize);

module.exports = {
  sequelize,
  EmailSetup,
};

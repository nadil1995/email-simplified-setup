
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EmailSetup = sequelize.define("EmailSetup", {
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addUsers: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return EmailSetup;
};

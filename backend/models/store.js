import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("Store", {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true }
  });
};

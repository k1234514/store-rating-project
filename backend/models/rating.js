import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("Rating", {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
};

import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { len: [3, 30] }, // min 3, max 30 chars
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 50] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 255] },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "owner"),
      defaultValue: "user",
    },
  });
};

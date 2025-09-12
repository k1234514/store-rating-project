import sequelize from "../config/database.js"; // ✅ config se sequelize lo
import UserModel from "./user.js";
import StoreModel from "./store.js";
import RatingModel from "./rating.js";

// Initialize models
const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// Set up associations
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

export { sequelize, User, Store, Rating };

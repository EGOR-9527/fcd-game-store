const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Пользователь
const UserBase = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nick: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Продавец
const Vendor = sequelize.define("Vendor", {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nameCompany: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Продукт
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT, // Убедитесь, что это FLOAT или DECIMAL
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  keygame: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.UUID,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Корзина
const Basket = sequelize.define("Basket", {
  userId: {
    type: DataTypes.UUID,
  },
  productId: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Все продукты продавца
const AllProductsVendor = sequelize.define("AllProducts", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
  },
  vendorId: {
    // Убедитесь, что это поле существует
    type: DataTypes.UUID,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Модель токенов
const TokenUserModel = sequelize.define("TokenModel", {
  userId: {
    type: DataTypes.UUID,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const TokenVendorModel = sequelize.define("TokenVendorModel", {
  userId: {
    type: DataTypes.UUID,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Определение связей
Vendor.hasMany(Product, { foreignKey: "vendorId" });
Product.belongsTo(Vendor, { foreignKey: "vendorId" });

UserBase.hasMany(Basket, { foreignKey: "userId" });
Basket.belongsTo(UserBase, { foreignKey: "userId" });

Product.hasMany(Basket, { foreignKey: "productId" });
Basket.belongsTo(Product, { foreignKey: "productId" });

// Экспорт моделей
module.exports = {
  UserBase,
  Basket,
  AllProductsVendor,
  Vendor,
  Product,
  TokenUserModel,
  TokenVendorModel,
};

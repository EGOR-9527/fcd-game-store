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
// Продавец
const Vendor = sequelize.define("Vendor", {
  id: {
    type: DataTypes.UUID, // Изменено на UUID
    defaultValue: DataTypes.UUIDV4, // Добавлено значение по умолчанию
    primaryKey: true,
  },
  name: {
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
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.UUID, // Изменено на UUID
    references: {
      model: Vendor,
      key: "id",
    },
  },
});

// Корзина
const Basket = sequelize.define("Basket", {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: UserBase,
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Все продукты продавца
const AllProductsVendor = sequelize.define("AllProducts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: "id",
    },
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
    references: {
      model: UserBase,
      key: "id",
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const TokenVendorModel = sequelize.define("TokenVendorModel", {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: Vendor, // Изменено на Vendor
      key: "id",
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

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

const { Router } = require("express");
const AuthUserController = require("../Controller/auth/authUserController");
const AuthVendorController = require("../Controller/auth/authVendorController");
const vendorCotroller = require("../Controller/vendor/vendorCotroller");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path"); // Импортируем модуль path из стандартной библиотеки

// Настройка multer для сохранения изображений в формате JPG
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла с расширением .jpg
    cb(null, `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}.jpg`);
  },
});

const upload = multer({ storage: storage });
const router = new Router();

// User routes
router.post(
  "/user/login",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  AuthUserController.login
);

router.post(
  "/user/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  body("nick").isString().notEmpty(),
  AuthUserController.registration
);

router.get("/user/refresh", AuthUserController.refresh);

// Vendor routes
router.post(
  "/vendor/login",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  AuthVendorController.login
);

router.post(
  "/vendor/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  body("nameCompany").isString().notEmpty(),
  AuthVendorController.registration
);

router.post(
  "/vendor/addProduct",
  upload.single("img"),
  vendorCotroller.addProduct
);

router.get("/vendor/products/:id", vendorCotroller.allProducts);

router.delete("/vendor/deleteProduct/:id", vendorCotroller.deleteProduct);

router.get("/vendor/refresh", AuthVendorController.refresh);

module.exports = router;

const { Router } = require("express");
const AuthUserController = require("../Controller/auth/authUserController");
const AuthVendorController = require("../Controller/auth/authVendorController");
const vendorCotroller = require("../Controller/vendor/vendorCotroller");
const { body } = require("express-validator");
const upload = require('multer')({ dest: './uploads' });
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
  body("nick").isString().notEmpty(), // Nick is required for users
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
  body("nameCompany").isString().notEmpty(), // Name of the company is required for vendors
  AuthVendorController.registration
);

router.post(
  "/vendor/addProduct",
  upload.single("img"),
  vendorCotroller.addProduct
);

router.get(
 "/vendor/products/:id",
  vendorCotroller.allProducts
);

router.get("/vendor/refresh", AuthVendorController.refresh);

module.exports = router;

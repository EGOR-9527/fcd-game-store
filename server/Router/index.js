const { Router } = require("express");
const AuthUserController = require("../Controller/auth/authUserController");
const AuthVendorController = require("../Controller/auth/authVendorController");
const { body } = require('express-validator');
const router = new Router();

// User router
router.post("/loginUser", AuthUserController.login);
router.post(
  "/registrationUser",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  AuthUserController.registration
); // Corrected spelling

router.get('/userRefresh', AuthUserController.refresh);

// Vendor router
router.post("/loginVendor", AuthVendorController.login);
router.post(
  "/registrationVendor",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  AuthVendorController.registration
); // Corrected spelling

router.get('/vendorRefresh', AuthVendorController.refresh);

module.exports = router;
